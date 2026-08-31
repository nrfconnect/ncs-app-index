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

const githubReleaseRepos: Record<string, { owner: string; repo: string; label: string }> = {
    'asset-tracker-template': {
        owner: 'nrfconnect',
        repo: 'Asset-Tracker-Template',
        label: 'Asset Tracker Template',
    },
    'ncs-serial-modem-host-applications': {
        owner: 'nrfconnect',
        repo: 'ncs-serial-modem-host-applications',
        label: 'Serial Modem Host Applications',
    },
    'quickstart-bluetooth': {
        owner: 'nrfconnect',
        repo: 'quickstart-bluetooth',
        label: 'nRF Cloud Bluetooth Quick Start',
    },
};

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

    appIndex.apps = appIndex.apps.sort((a, b) => {
        // Find the most recent release date for each app
        const getLatestDate = (app: Application) => {
          if (!Array.isArray(app.releases) || app.releases.length === 0) return new Date(0).toISOString();
          // Find the max date from the releases
          const initialDate = app.releases[0]?.date || new Date(0).toISOString();
          return app.releases.reduce((latest: string, curr: Application['releases'][number]) => {
            if (!curr.date) return latest;
            return (new Date(curr.date) > new Date(latest) ? curr.date : latest);
          }, initialDate);
        };
      
        const dateA = getLatestDate(a);
        const dateB = getLatestDate(b);
        
        // Sort descending (most recent first)
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      });

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

async function fetchGithubReleasesWithSdk(
    owner: string,
    repo: string,
    label: string,
    app: OrgIndex['apps'][number],
): Promise<void> {
    try {
        const { Octokit } = await import('@octokit/rest');
        const octokit = new Octokit();
        const releasesResp = await octokit.repos.listReleases({
            owner,
            repo,
            per_page: 5,
        });

        const releasesWithSdk = await Promise.all(
            releasesResp.data.map(async (rel) => {
                let sdkVersion = rel.tag_name;

                try {
                    const westYmlResp = await octokit.repos.getContent({
                        owner,
                        repo,
                        path: 'west.yml',
                        ref: rel.tag_name,
                    });

                    if ('content' in westYmlResp.data) {
                        const westYmlContent = Buffer.from(westYmlResp.data.content, 'base64').toString('utf-8');
                        const revisionMatch = westYmlContent.match(/revision:\s*(.+)/);

                        if (revisionMatch?.[1]) {
                            const revision = revisionMatch[1].trim();

                            if (revision.startsWith('tags/')) {
                                sdkVersion = revision.replace('tags/', '');
                            } else {
                                sdkVersion = revision;
                            }
                        }
                    }
                } catch (err) {
                    console.warn(`Failed to fetch west.yml for ${rel.tag_name}:`, err instanceof Error ? err.message : err);
                }

                return {
                    tag: rel.tag_name,
                    name: rel.name || rel.tag_name,
                    date: rel.published_at || rel.created_at || '',
                    sdk: sdkVersion,
                };
            }),
        );

        app.releases = releasesWithSdk;
    } catch (err) {
        console.error(`Failed to fetch ${label} releases from GitHub:`, err);
    }
}

async function fetchRepoData(
    orgId: string,
    app: OrgIndex['apps'][number],
): Promise<Application> {
    try {
        if (orgId === 'nrfconnect') {
            for (const [key, repoConfig] of Object.entries(githubReleaseRepos)) {
                if (app.name === key) {
                    await fetchGithubReleasesWithSdk(
                        repoConfig.owner,
                        repoConfig.repo,
                        repoConfig.label,
                        app,
                    );
                    break;
                }
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
            manifest: app.manifest,
            kind: app.kind,
            license: app.license ?? 'Other License',
            apps: app.apps,
            releases: app.releases,
            tags: app.tags,
            lastUpdate: app.releases[0]?.date,
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
