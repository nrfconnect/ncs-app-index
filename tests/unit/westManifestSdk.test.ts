/* Copyright (c) 2026 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
    extractNcsSdkRevisionFromWestManifest,
    listImportedWestManifestRefs,
    normalizeWestRevision,
    resolveNcsSdkRevisionFromWestManifest,
} from '../../scripts/westManifestSdk';
import {
    NCS_MATTER_EDGE_AI_WEST,
    NCS_MATTER_EDGE_AI_WEST_COMMENTED_IMPORT,
    NCS_MATTER_WEST,
    NCS_MATTER_WEST_COMMENT_AFTER_PROJECTS,
    NCS_MATTER_WEST_WITH_COMMENTS,
    NCS_MATTER_WEST_WITH_DEFAULTS,
    SDK_EDGE_AI_WEST,
} from '../fixtures/westManifests';

describe('normalizeWestRevision', () => {
    it('strips tags/ prefix and quotes', () => {
        assert.equal(normalizeWestRevision(`'tags/v3.4.0'`), 'v3.4.0');
    });
});

describe('extractNcsSdkRevisionFromWestManifest', () => {
    it('reads nrf revision from a single-stage add-on manifest', () => {
        assert.equal(extractNcsSdkRevisionFromWestManifest(NCS_MATTER_WEST), 'v3.4.0');
    });

    it('ignores YAML comments between projects and inline revision comments', () => {
        assert.equal(extractNcsSdkRevisionFromWestManifest(NCS_MATTER_WEST_WITH_COMMENTS), 'v3.4.0');
    });

    it('parses projects after a column-zero comment following projects:', () => {
        assert.equal(extractNcsSdkRevisionFromWestManifest(NCS_MATTER_WEST_COMMENT_AFTER_PROJECTS), 'v3.4.0');
    });

    it('ignores revision keys under a trailing defaults section', () => {
        assert.equal(extractNcsSdkRevisionFromWestManifest(NCS_MATTER_WEST_WITH_DEFAULTS), 'v3.4.0');
    });

    it('returns undefined when nrf is only in an imported manifest', () => {
        assert.equal(extractNcsSdkRevisionFromWestManifest(NCS_MATTER_EDGE_AI_WEST), undefined);
    });
});

describe('listImportedWestManifestRefs', () => {
    it('resolves GitHub coordinates for url-based imports', () => {
        assert.deepEqual(listImportedWestManifestRefs(NCS_MATTER_EDGE_AI_WEST), [
            { owner: 'nrfconnect', repo: 'sdk-edge-ai', revision: 'v2.2.0' },
        ]);
    });
});

describe('resolveNcsSdkRevisionFromWestManifest', () => {
    it('follows import: true for two-stage add-ons', async () => {
        const manifests = new Map<string, string>([
            ['nrfconnect/sdk-edge-ai@v2.2.0', SDK_EDGE_AI_WEST],
        ]);

        const sdk = await resolveNcsSdkRevisionFromWestManifest(NCS_MATTER_EDGE_AI_WEST, async (ref) => {
            return manifests.get(`${ref.owner}/${ref.repo}@${ref.revision}`);
        });

        assert.equal(sdk, 'v3.4.0');
    });

    it('follows import when the flag has an inline YAML comment', async () => {
        const manifests = new Map<string, string>([
            ['nrfconnect/sdk-edge-ai@v2.2.0', SDK_EDGE_AI_WEST],
        ]);

        const sdk = await resolveNcsSdkRevisionFromWestManifest(
            NCS_MATTER_EDGE_AI_WEST_COMMENTED_IMPORT,
            async (ref) => manifests.get(`${ref.owner}/${ref.repo}@${ref.revision}`),
        );

        assert.equal(sdk, 'v3.4.0');
    });

    it('resolves single-stage manifests without fetching nested repos', async () => {
        let fetchCount = 0;
        const sdk = await resolveNcsSdkRevisionFromWestManifest(NCS_MATTER_WEST, async () => {
            fetchCount += 1;
            return undefined;
        });

        assert.equal(sdk, 'v3.4.0');
        assert.equal(fetchCount, 0);
    });
});
