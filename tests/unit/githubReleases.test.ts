/* Copyright (c) 2026 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { githubReleaseRepoForAppName } from '../../scripts/githubReleaseRepos';
import {
    fetchGithubReleasesWithSdk,
    populateGithubReleasesForApp,
    resolveReleaseSdkVersion,
    type GithubContentClient,
} from '../../scripts/githubReleases';
import type { OrgIndex } from '../../site/src/schema';
import {
    NCS_MATTER_EDGE_AI_WEST,
    NCS_MATTER_EDGE_AI_WEST_COMMENTED_IMPORT,
    NCS_MATTER_WEST,
    SDK_EDGE_AI_WEST,
} from '../fixtures/westManifests';

function mockClient(files: Record<string, string>): GithubContentClient {
    return {
        listReleases: async () => [],
        getFileContent: async (owner, repo, path, ref) => {
            const key = `${owner}/${repo}/${path}@${ref}`;
            return files[key];
        },
    };
}

describe('githubReleaseRepoForAppName', () => {
    it('registers single-stage and two-stage smarthome add-ons', () => {
        assert.ok(githubReleaseRepoForAppName('ncs-matter'));
        assert.ok(githubReleaseRepoForAppName('ncs-matter-edge-ai'));
    });
});

describe('resolveReleaseSdkVersion', () => {
    it('uses nrf revision for single-stage add-ons', async () => {
        const client = mockClient({
            'nrfconnect/ncs-matter/west.yml@v1.0.0': NCS_MATTER_WEST,
        });

        const sdk = await resolveReleaseSdkVersion(client, 'nrfconnect', 'ncs-matter', 'v1.0.0');
        assert.equal(sdk, 'v3.4.0');
    });

    it('follows nested west imports for Matter Edge AI', async () => {
        const client = mockClient({
            'nrfconnect/ncs-matter-edge-ai/west.yml@v0.1.0': NCS_MATTER_EDGE_AI_WEST,
            'nrfconnect/sdk-edge-ai/west.yml@v2.2.0': SDK_EDGE_AI_WEST,
        });

        const sdk = await resolveReleaseSdkVersion(
            client,
            'nrfconnect',
            'ncs-matter-edge-ai',
            'v0.1.0',
        );
        assert.equal(sdk, 'v3.4.0');
    });

    it('resolves nested SDK when import: true has an inline comment', async () => {
        const client = mockClient({
            'nrfconnect/ncs-matter-edge-ai/west.yml@v0.1.0': NCS_MATTER_EDGE_AI_WEST_COMMENTED_IMPORT,
            'nrfconnect/sdk-edge-ai/west.yml@v2.2.0': SDK_EDGE_AI_WEST,
        });

        const sdk = await resolveReleaseSdkVersion(
            client,
            'nrfconnect',
            'ncs-matter-edge-ai',
            'v0.1.0',
        );
        assert.equal(sdk, 'v3.4.0');
    });
});

describe('populateGithubReleasesForApp', () => {
    it('fills release sdk fields from west manifests', async () => {
        const client = mockClient({
            'nrfconnect/ncs-matter/west.yml@v1.0.0': NCS_MATTER_WEST,
            'nrfconnect/ncs-matter-edge-ai/west.yml@v0.2.0': NCS_MATTER_EDGE_AI_WEST,
            'nrfconnect/sdk-edge-ai/west.yml@v2.2.0': SDK_EDGE_AI_WEST,
        });

        const releases = await populateGithubReleasesForApp(client, 'nrfconnect', 'ncs-matter', [
            { tag_name: 'v1.0.0', name: 'Matter v1.0.0', published_at: '2026-01-01T00:00:00Z' },
        ]);

        assert.deepEqual(releases, [
            {
                tag: 'v1.0.0',
                name: 'Matter v1.0.0',
                date: '2026-01-01T00:00:00Z',
                sdk: 'v3.4.0',
            },
        ]);

        const edgeAiReleases = await populateGithubReleasesForApp(
            client,
            'nrfconnect',
            'ncs-matter-edge-ai',
            [{ tag_name: 'v0.2.0', published_at: '2026-02-01T00:00:00Z' }],
        );

        assert.equal(edgeAiReleases[0]?.sdk, 'v3.4.0');
    });
});

describe('fetchGithubReleasesWithSdk', () => {
    it('replaces placeholder releases with GitHub release metadata', async () => {
        const client: GithubContentClient = {
            listReleases: async () => [
                {
                    tag_name: 'v0.2.0',
                    name: 'Matter Edge AI 0.2',
                    published_at: '2026-03-01T00:00:00Z',
                },
            ],
            getFileContent: async (owner, repo, path, ref) => {
                const key = `${owner}/${repo}/${path}@${ref}`;
                const files: Record<string, string> = {
                    'nrfconnect/ncs-matter-edge-ai/west.yml@v0.2.0': NCS_MATTER_EDGE_AI_WEST,
                    'nrfconnect/sdk-edge-ai/west.yml@v2.2.0': SDK_EDGE_AI_WEST,
                };
                return files[key];
            },
        };

        const app = {
            name: 'ncs-matter-edge-ai',
            releases: [
                {
                    tag: 'placeholder',
                    name: 'Releases are automatically populated by generate-index-json script',
                    date: '1970-01-01T00:00:00Z',
                    sdk: 'placeholder',
                },
            ],
        } as OrgIndex['apps'][number];

        await fetchGithubReleasesWithSdk(
            client,
            'nrfconnect',
            'ncs-matter-edge-ai',
            'Matter Edge AI',
            app,
        );

        assert.equal(app.releases.length, 1);
        assert.equal(app.releases[0]?.tag, 'v0.2.0');
        assert.equal(app.releases[0]?.sdk, 'v3.4.0');
    });
});
