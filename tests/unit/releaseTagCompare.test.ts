/* Copyright (c) 2026 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
    compareReleaseTags,
    normalizeReleaseTag,
    releaseTagSortKey,
    isReleaseTagAtOrAbove,
    isReleaseTagBelow,
    shouldFetchGithubReleaseWithMinTag,
    shouldPreserveIndexReleaseWithMinTag,
} from '../../scripts/releaseTagCompare';

describe('normalizeReleaseTag / releaseTagSortKey', () => {
    it('strips whitespace and a tags/ prefix', () => {
        assert.equal(normalizeReleaseTag(' tags/v1.2.0 '), 'v1.2.0');
    });

    it('extracts numeric segments, with or without a v prefix', () => {
        assert.deepEqual(releaseTagSortKey('v1.10.0'), [1, 10, 0]);
        assert.deepEqual(releaseTagSortKey('2.0'), [2, 0]);
        assert.equal(releaseTagSortKey('preview-v1.0.0'), null);
        assert.equal(releaseTagSortKey('placeholder'), null);
    });
});

describe('compareReleaseTags', () => {
    it('orders semver-style release tags', () => {
        assert.equal(compareReleaseTags('v1.0.0', 'v1.1.0'), -1);
        assert.equal(compareReleaseTags('v1.5.0', 'v1.4.9'), 1);
        assert.equal(compareReleaseTags('v0.17.1', 'v0.17.0'), 1);
    });

    it('compares numerically, not lexicographically', () => {
        assert.equal(compareReleaseTags('v1.10.0', 'v1.9.0'), 1);
    });

    it('treats missing segments as zero', () => {
        assert.equal(compareReleaseTags('v1.1', 'v1.1.0'), 0);
        assert.equal(compareReleaseTags('v1.1', 'v1.1.1'), -1);
    });

    it('returns null when either tag is not comparable', () => {
        assert.equal(compareReleaseTags('preview-foo', 'v1.0.0'), null);
        assert.equal(compareReleaseTags('v1.0.0', 'placeholder'), null);
    });
});

describe('minReleaseTag helpers', () => {
    it('classifies tags relative to a minimum', () => {
        assert.equal(isReleaseTagBelow('v1.0.1', 'v1.1.0'), true);
        assert.equal(isReleaseTagAtOrAbove('v1.1.0', 'v1.1.0'), true);
        assert.equal(isReleaseTagAtOrAbove('v1.2.0', 'v1.1.0'), true);
        assert.equal(isReleaseTagAtOrAbove('v1.0.1', 'v1.1.0'), false);
        assert.equal(isReleaseTagBelow('v1.1.0', 'v1.1.0'), false);
    });

    it('fetches tags at or above the minimum and preserves those below', () => {
        assert.equal(shouldFetchGithubReleaseWithMinTag('v1.1.0', 'v1.1.0'), true);
        assert.equal(shouldPreserveIndexReleaseWithMinTag('v1.1.0', 'v1.1.0'), false);
        assert.equal(shouldPreserveIndexReleaseWithMinTag('v1.0.1', 'v1.1.0'), true);
        assert.equal(shouldFetchGithubReleaseWithMinTag('v1.0.0-rc3', 'v1.1.0'), false);
    });

    it('keeps non-semver preview-style tags when minReleaseTag is set', () => {
        assert.equal(shouldFetchGithubReleaseWithMinTag('preview-v3.4.0', 'v1.1.0'), true);
        assert.equal(shouldPreserveIndexReleaseWithMinTag('preview-v3.4.0', 'v1.1.0'), true);
        assert.equal(shouldFetchGithubReleaseWithMinTag('v1.0.0', 'v1.1.0'), false);
    });

    it('uses the numeric prefix for mixed tags like v3.4.0-preview1', () => {
        assert.equal(isReleaseTagAtOrAbove('v3.4.0-preview1', 'v3.4.0'), true);
        assert.equal(isReleaseTagBelow('v3.3.0-preview2', 'v3.4.0'), true);
    });
});
