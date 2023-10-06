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
    validOrgKinds,
    Organization,
    Application,
} from '../site/src/schema';
import { ParsedOrgFile, readOrgIndexFiles } from './orgFiles';

const partnerIds: string[] = [];

function notUndefined<T>(value: T | undefined): value is T {
    return value !== undefined;
}

function initialiseGitHubApi() {
    const authToken = process.env.GITHUB_TOKEN;

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

    return appIndex;
}

async function fetchOrgData({
    id: orgId,
    orgIndex,
}: ParsedOrgFile): Promise<{ org: Organization; apps: Application[] }> {
    try {
        const userData = await octokit.users.getByUsername({ username: orgId });

        const org: Organization = {
            id: orgId,
            name: orgIndex.name,
            description: orgIndex.description,
            isPartner: partnerIds.includes(orgId),
            type: userData.data.type as (typeof validOrgKinds)[number],
            urls: {
                support: userData.data.url,
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

        const releases = await octokit.repos.listReleases({
            owner: orgId,
            repo: app.name,
        });

        console.log(colours.green(`Fetched data for ${orgId}/${app.name}`));

        return {
            id: repoData.id.toString(),
            repo: `https://github.com/${orgId}/${app.name}`,
            owner: orgId,
            description: app.description ?? repoData.description ?? '',
            name: app.name,
            defaultBranch: repoData.default_branch,
            forks: repoData.forks_count,
            isTemplate: repoData.is_template ?? false,
            kind: app.kind,
            lastUpdate: repoData.updated_at,
            license: repoData.license?.spdx_id ?? undefined,
            watchers: repoData.watchers_count,
            releases: releases.data.map((release) => ({
                date: release.created_at,
                name: release.name ?? release.tag_name,
                tag: release.tag_name,
            })),
            tags: app.tags,
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
