/* Copyright (c) 2026 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

import type { Octokit } from '@octokit/rest';

import { PLACEHOLDER_RELEASE_TAG } from '../site/src/releaseSelectOptions';
import type { OrgIndex } from '../site/src/schema';
import {
    shouldFetchGithubReleaseWithMinTag,
    shouldPreserveIndexReleaseWithMinTag,
} from './releaseTagCompare';
import {
    resolveNcsSdkRevisionFromWestManifest,
    type FetchWestManifest,
    type WestRepoRef,
} from './westManifestSdk';

/** Page size for GitHub `listReleases` (max 100). */
export const GITHUB_RELEASES_PER_PAGE = 100;

export type GithubReleaseListItem = {
    tag_name: string;
    name?: string | null;
    published_at?: string | null;
    created_at?: string | null;
};

export type GithubContentClient = {
    listReleases: (
        owner: string,
        repo: string,
        perPage: number,
    ) => Promise<GithubReleaseListItem[]>;
    getFileContent: (
        owner: string,
        repo: string,
        path: string,
        ref: string,
    ) => Promise<string | undefined>;
};

function createWestFetcher(client: GithubContentClient, owner: string, repo: string): FetchWestManifest {
    return async (importRef: WestRepoRef) => {
        return client.getFileContent(importRef.owner, importRef.repo, 'west.yml', importRef.revision);
    };
}

export async function resolveReleaseSdkVersion(
    client: GithubContentClient,
    owner: string,
    repo: string,
    releaseTag: string,
): Promise<string> {
    const westYml = await client.getFileContent(owner, repo, 'west.yml', releaseTag);
    if (!westYml) {
        return releaseTag;
    }

    const fetchWest = createWestFetcher(client, owner, repo);
    const sdk = await resolveNcsSdkRevisionFromWestManifest(westYml, fetchWest);
    return sdk ?? releaseTag;
}

export type PopulatedRelease = {
    tag: string;
    name: string;
    date: string;
    sdk: string;
};

export async function populateGithubReleasesForApp(
    client: GithubContentClient,
    owner: string,
    repo: string,
    releaseList: GithubReleaseListItem[],
): Promise<PopulatedRelease[]> {
    return Promise.all(
        releaseList.map(async (rel) => {
            const sdk = await resolveReleaseSdkVersion(client, owner, repo, rel.tag_name);
            return {
                tag: rel.tag_name,
                name: rel.name || rel.tag_name,
                date: rel.published_at || rel.created_at || '',
                sdk,
            };
        }),
    );
}

/** Drops releases older than `minReleaseTag` before any per-release west.yml lookups. */
export function filterReleasesByMinTag(
    releaseList: GithubReleaseListItem[],
    minReleaseTag?: string,
): GithubReleaseListItem[] {
    if (!minReleaseTag) {
        return releaseList;
    }
    return releaseList.filter((rel) => shouldFetchGithubReleaseWithMinTag(rel.tag_name, minReleaseTag));
}

/**
 * Appends releases from the org index file that predate `minReleaseTag`, so they stay as
 * written there. Placeholder entries and tags that GitHub already returned are skipped.
 */
export function mergeIndexReleasesBelowMinTag(
    indexReleases: PopulatedRelease[],
    fetched: PopulatedRelease[],
    minReleaseTag?: string,
): PopulatedRelease[] {
    if (!minReleaseTag) {
        return fetched;
    }
    const fetchedTags = new Set(fetched.map((rel) => rel.tag));
    const preserved = indexReleases.filter(
        (rel) =>
            rel.tag !== PLACEHOLDER_RELEASE_TAG &&
            !fetchedTags.has(rel.tag) &&
            shouldPreserveIndexReleaseWithMinTag(rel.tag, minReleaseTag),
    );
    return [...fetched, ...preserved];
}

export async function fetchGithubReleasesWithSdk(
    client: GithubContentClient,
    owner: string,
    repo: string,
    label: string,
    app: OrgIndex['apps'][number],
    minReleaseTag?: string,
): Promise<void> {
    try {
        const releaseList = await client.listReleases(owner, repo, GITHUB_RELEASES_PER_PAGE);
        const fetched = await populateGithubReleasesForApp(
            client,
            owner,
            repo,
            filterReleasesByMinTag(releaseList, minReleaseTag),
        );
        app.releases = mergeIndexReleasesBelowMinTag(app.releases, fetched, minReleaseTag);
    } catch (err) {
        console.error(`Failed to fetch ${label} releases from GitHub:`, err);
    }
}

export function createOctokitGithubClient(octokit: Octokit): GithubContentClient {
    return {
        listReleases: async (owner, repo, perPage) => {
            const releases = await octokit.paginate(octokit.repos.listReleases, {
                owner,
                repo,
                per_page: perPage,
            });
            return releases as GithubReleaseListItem[];
        },
        getFileContent: async (owner, repo, path, ref) => {
            try {
                const response = await octokit.repos.getContent({ owner, repo, path, ref });
                const data = response.data;
                if (data && typeof data === 'object' && 'content' in data && typeof data.content === 'string') {
                    return Buffer.from(data.content, 'base64').toString('utf-8');
                }
            } catch (err) {
                console.warn(
                    `Failed to fetch ${path} for ${owner}/${repo}@${ref}:`,
                    err instanceof Error ? err.message : err,
                );
            }
            return undefined;
        },
    };
}
