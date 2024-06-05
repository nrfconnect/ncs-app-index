/* Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

// Generates a list of applications registered by organisations from the separate
// files listed under the index directory.

import fs from 'fs/promises';
import path from 'path';
import { Octokit } from '@octokit/rest';
import fetch from 'node-fetch';
import colours from 'ansi-colors';

import type {
    OrgIndex,
    AppIndex,
    validOrgTypes,
    Organization,
    Application,
} from '../site/src/schema';
import { ParsedOrgFile, readOrgIndexFiles } from './orgFiles';
import { execSync } from 'child_process';

const nordicOrgs: string[] = ['nrfconnect', 'nordic', 'nordicplayground'];
const partnerOrgs: string[] = ['golioth'];

function notUndefined<T>(value: T | undefined): value is T {
    return value !== undefined;
}

function initialiseGitHubApi() {
    const authToken =
        process.env.GITHUB_TOKEN ?? execSync('gh auth token', { encoding: 'utf-8' }).trim();

    if (!authToken) {
        throw new Error(
            'No auth token was provided, so you may encounter rate limit issues when calling the GitHub API.\n' +
            'Provide a token by setting the "GITHUB_TOKEN" environment variable.\n',
        );
    }

    return new Octokit({ request: { fetch }, auth: authToken });
}

const octokit = initialiseGitHubApi();

async function generateIndex(orgIndices: ParsedOrgFile[]): Promise<AppIndex> {
    const appIndex: AppIndex = { orgs: {}, apps: [] };

    const data = await Promise.all(orgIndices.map(fetchOrgData));
    for (const { org, apps } of data.filter(notUndefined)) {
        appIndex.orgs[org.id] = org;
        appIndex.apps.push(...apps);
    }

    appIndex.apps = appIndex.apps.sort((a, b) => {
        if (a.stars === b.stars) {
            return a.name < b.name ? -1 : 1;
        }

        return a.stars > b.stars ? -1 : 1;
    });

    return appIndex;
}

async function fetchOrgData({
    id: orgId,
    orgIndex,
}: ParsedOrgFile): Promise<{ org: Organization; apps: Application[] }> {
    try {
        const userData = await octokit.users.getByUsername({ username: orgId });

        let kind: Organization['kind'];
        if (nordicOrgs.includes(orgId)) {
            kind = 'Nordic Semiconductor';
        } else if (partnerOrgs.includes(orgId)) {
            kind = 'Official Partner';
        } else {
            kind = 'External';
        }

        const org: Organization = {
            id: orgId,
            name: orgIndex.name,
            description: orgIndex.description,
            kind,
            type: userData.data.type as (typeof validOrgTypes)[number],
            urls: {
                support: userData.data.html_url,
                email: userData.data.email ?? undefined,
                blog: userData.data.blog ?? undefined,
                twitter: userData.data.twitter_username ?? undefined,
            },
            avatar: userData.data.avatar_url,
            location: userData.data.location ?? undefined,
        };

        const apps = await Promise.all(orgIndex.apps.map((app) => fetchRepoData(orgId, app)));

        console.log(colours.green(`Fetched data for user ${orgId}`));

        return { org, apps: apps.filter(notUndefined) };
    } catch {
        throw new Error(`Failed to fetch data for organization ${orgId}`);
    }
}

async function fetchRepoData(
    orgId: string,
    app: OrgIndex['apps'][number],
): Promise<AppIndex['apps'][number]> {
    try {
        const { data: repoData } = await octokit.repos.get({
            owner: orgId,
            repo: app.name,
        });

        const repoUrl = `https://github.com/${orgId}/${app.name}`;

        console.log(colours.green(`Fetched data for ${orgId}/${app.name}`));

        return {
            id: repoData.id.toString(),
            repo: repoUrl,
            owner: orgId,
            description: app.description ?? repoData.description ?? '',
            name: app.name,
            title: app.title,
            defaultBranch: repoData.default_branch,
            isTemplate: repoData.is_template ?? false,
            kind: app.kind,
            lastUpdate: repoData.updated_at,
            license: app.license ?? repoData.license?.name ?? undefined,
            watchers: repoData.watchers_count,
            stars: repoData.stargazers_count,
            forks: repoData.forks_count,
            apps: app.apps,
            releases: app.releases,
            tags: app.tags
        };
    } catch {
        throw new Error(`Failed to fetch data for ${orgId}/${app.name}`);
    }
}

async function run() {
    const orgIndices = await readOrgIndexFiles();
    const appIndex = await generateIndex(orgIndices);
    const stringified = JSON.stringify(appIndex, undefined, 2);
    const indexPath = path.join(__dirname, '..', 'resources', 'index.json');
    await fs.writeFile(indexPath, stringified);
    console.log(`\nWritten app index to ${indexPath}`);
}

run();
