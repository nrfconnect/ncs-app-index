/* Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

// Generates a list of applications registered by organisations from the separate
// files listed under the index directory.

import fs from 'fs/promises';
import path from 'path';
import colours from 'ansi-colors';
import type {
    OrgIndex,
    AppIndex,
    validOrgTypes,
    Organization,
    Application,
} from '../site/src/schema';
import { ParsedOrgFile, readOrgIndexFiles } from './orgFiles';

const nordicOrgs: string[] = ['nrfconnect', 'nordic', 'nordicplayground', 'hello-nrfcloud'];
const partnerOrgs: string[] = ['golioth', 'blecon'];

function notUndefined<T>(value: T | undefined): value is T {
    return value !== undefined;
}

async function generateIndex(orgIndices: ParsedOrgFile[]): Promise<AppIndex> {
    const appIndex: AppIndex = { orgs: {}, apps: [] };

    const data = await Promise.all(orgIndices.map(fetchOrgData));
    for (const { org, apps } of data.filter(notUndefined)) {
        appIndex.orgs[org.id] = org;
        appIndex.apps.push(...apps);
    }

    appIndex.apps = appIndex.apps.sort((a, b) => a.name < b.name ? -1 : 1);

    return appIndex;
}

async function fetchOrgData({
    id: orgId,
    orgIndex,
}: ParsedOrgFile): Promise<{ org: Organization; apps: Application[] }> {
    try {
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
            type: 'Organization' as (typeof validOrgTypes)[number],
            contact: orgIndex.contact,
            avatar: orgIndex.avatar,
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
): Promise<Application> {
    try {
        // Special handling for Asset Tracker Template
        if (
            orgId === 'nrfconnect' &&
            (app.name === 'asset-tracker-template' || app.repo?.toLowerCase().includes('asset-tracker-template'))
        ) {
            try {
                // Use GitHub API to fetch latest release(s)
                const { Octokit } = await import('@octokit/rest');
                const octokit = new Octokit();
                const releasesResp = await octokit.repos.listReleases({
                    owner: 'nrfconnect',
                    repo: 'Asset-Tracker-Template',
                    per_page: 5
                });
                app.releases = releasesResp.data.map((rel) => ({
                    tag: rel.tag_name,
                    name: rel.name || rel.tag_name,
                    date: rel.published_at || rel.created_at || '',
                    sdk: rel.tag_name // You may want to parse SDK version from tag or body if needed
                }));
            } catch (err) {
                console.error('Failed to fetch Asset Tracker Template releases from GitHub:', err);
            }
        }
        try {
            app.releases = app.releases.sort((a, b) => {
                const [updatedA, updatedB] = [
                    new Date(a.date),
                    new Date(b.date)
                ];
                if (updatedA === updatedB) {
                    return a.name.localeCompare(b.name);
                }
                return updatedA > updatedB ? -1 : 1;
            });
        } catch {
            console.log(`failed to parse ${app.name}`)
        }
        console.log(colours.green(`Fetched data for ${orgId}/${app.name}`));
        return {
            id: app.repo,
            repo: app.repo,
            owner: orgId,
            description: app.description,
            name: app.name,
            title: app.title,
            defaultBranch: app.defaultBranch ?? app.releases[0]?.tag,
            kind: app.kind,
            license: app.license ?? 'Other License',
            apps: app.apps,
            releases: app.releases,
            tags: app.tags,
            docsUrl: app.docsUrl,
            restricted: app.restricted,
            avatar: app.avatar,
            testStatus: app.testStatus,
        } as Application;
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
