/* Copyright (c) 2026 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { githubReleaseRepos } from '../../scripts/githubReleaseRepos';
import {
    fetchGithubReleasesWithSdk,
    filterReleasesByMinTag,
    mergeIndexReleasesBelowMinTag,
    type GithubContentClient,
    type GithubReleaseListItem,
    type PopulatedRelease,
} from '../../scripts/githubReleases';
import { releaseTagSortKey } from '../../scripts/releaseTagCompare';
import type { OrgIndex } from '../../site/src/schema';
import { NCS_MATTER_WEST } from '../fixtures/westManifests';

const PLACEHOLDER: PopulatedRelease = {
    tag: 'placeholder',
    name: 'Releases are automatically populated by generate-index-json script',
    date: '1970-01-01T00:00:00Z',
    sdk: 'placeholder',
};

function release(tag: string, sdk = 'v3.4.0'): PopulatedRelease {
    return { tag, name: tag, date: '2026-01-01T00:00:00Z', sdk };
}

function listItems(...tags: string[]): GithubReleaseListItem[] {
    return tags.map((tag_name) => ({ tag_name, published_at: '2026-01-01T00:00:00Z' }));
}

describe('githubReleaseRepos minReleaseTag', () => {
    it('configures comparable minimum tags for the add-ons with a release history', () => {
        for (const name of [
            'asset-tracker-template',
            'ncs-serial-modem-host-applications',
            'quickstart-bluetooth',
        ]) {
            const min = githubReleaseRepos[name]?.minReleaseTag;
            assert.ok(min, `${name} has no minReleaseTag`);
            assert.ok(releaseTagSortKey(min), `${name} minReleaseTag "${min}" is not comparable`);
        }
    });
});

describe('filterReleasesByMinTag', () => {
    it('returns the list untouched without a minimum', () => {
        const list = listItems('v1.0.0', 'v2.0.0');
        assert.equal(filterReleasesByMinTag(list), list);
    });

    it('drops releases below the minimum and keeps non-semver tags', () => {
        const list = listItems('v1.2.0', 'v1.1.0', 'v1.0.1', 'v1.0.0-rc3', 'preview-foo');
        assert.deepEqual(
            filterReleasesByMinTag(list, 'v1.1.0').map((r) => r.tag_name),
            ['v1.2.0', 'v1.1.0', 'preview-foo'],
        );
    });
});

describe('mergeIndexReleasesBelowMinTag', () => {
    it('returns only fetched releases without a minimum', () => {
        const fetched = [release('v1.0.0')];
        assert.equal(mergeIndexReleasesBelowMinTag([release('v0.1.0')], fetched), fetched);
    });

    it('drops the placeholder entry', () => {
        assert.deepEqual(
            mergeIndexReleasesBelowMinTag([PLACEHOLDER], [release('v1.1.0')], 'v1.1.0'),
            [release('v1.1.0')],
        );
    });

    it('keeps index releases below the minimum unchanged after the fetched ones', () => {
        const old = release('v1.0.0', 'v2.9.0');
        assert.deepEqual(
            mergeIndexReleasesBelowMinTag([PLACEHOLDER, old], [release('v1.1.0')], 'v1.1.0'),
            [release('v1.1.0'), old],
        );
    });

    it('prefers fetched data over index entries for the same tag', () => {
        const stale = release('preview-foo', 'v2.0.0');
        const fresh = release('preview-foo', 'v3.4.0');
        assert.deepEqual(mergeIndexReleasesBelowMinTag([stale], [fresh], 'v1.1.0'), [fresh]);
    });

    it('does not preserve index releases at or above the minimum', () => {
        assert.deepEqual(
            mergeIndexReleasesBelowMinTag([release('v1.2.0')], [release('v1.1.0')], 'v1.1.0'),
            [release('v1.1.0')],
        );
    });
});

describe('fetchGithubReleasesWithSdk with minReleaseTag', () => {
    function setup(tags: string[]) {
        const westRequests: string[] = [];
        const client: GithubContentClient = {
            listReleases: async () => listItems(...tags),
            getFileContent: async (owner, repo, path, ref) => {
                westRequests.push(ref);
                return NCS_MATTER_WEST;
            },
        };
        return { client, westRequests };
    }

    function newApp(releases: PopulatedRelease[]): OrgIndex['apps'][number] {
        return { name: 'quickstart-bluetooth', releases } as OrgIndex['apps'][number];
    }

    it('skips west.yml lookups for releases below the minimum', async () => {
        const { client, westRequests } = setup(['v1.2.0', 'v1.1.0', 'v1.0.1', 'v1.0.0-rc3']);
        const app = newApp([PLACEHOLDER]);

        await fetchGithubReleasesWithSdk(client, 'nrfconnect', 'quickstart-bluetooth', 'QS', app, 'v1.1.0');

        assert.deepEqual(app.releases.map((r) => r.tag), ['v1.2.0', 'v1.1.0']);
        assert.deepEqual([...westRequests].sort(), ['v1.1.0', 'v1.2.0']);
    });

    it('keeps older entries from the index file unchanged', async () => {
        const { client } = setup(['v1.2.0', 'v1.0.1']);
        const old = release('v1.0.1', 'v2.9.0');
        const app = newApp([old]);

        await fetchGithubReleasesWithSdk(client, 'nrfconnect', 'quickstart-bluetooth', 'QS', app, 'v1.1.0');

        assert.deepEqual(app.releases, [release('v1.2.0'), old]);
    });

    it('loads every release when no minimum is configured', async () => {
        const { client } = setup(['v1.2.0', 'v1.0.1']);
        const app = newApp([PLACEHOLDER]);

        await fetchGithubReleasesWithSdk(client, 'nrfconnect', 'quickstart-bluetooth', 'QS', app);

        assert.deepEqual(app.releases.map((r) => r.tag), ['v1.2.0', 'v1.0.1']);
    });
});
