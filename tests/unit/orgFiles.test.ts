/* Copyright (c) 2026 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isPreviewRelease, resolveDefaultBranch, usesPlaceholderReleases } from '../../scripts/orgFiles';

describe('usesPlaceholderReleases', () => {
    it('detects placeholder release entries', () => {
        assert.equal(
            usesPlaceholderReleases([{ tag: 'placeholder', name: 'pending' }]),
            true,
        );
        assert.equal(usesPlaceholderReleases([{ tag: 'v1.0.0' }]), false);
    });
});

describe('resolveDefaultBranch', () => {
    it('honors explicit defaultBranch', () => {
        assert.equal(
            resolveDefaultBranch('v1.0.0', [{ tag: 'v2.0.0' }, { tag: 'v1.0.0' }]),
            'v1.0.0',
        );
    });

    it('prefers newest stable release when defaultBranch is omitted', () => {
        const releases = [
            { tag: 'v2.0.0', name: 'Preview 2', date: '2026-02-01' },
            { tag: 'v1.0.0', name: 'Stable', date: '2026-01-01' },
        ];
        assert.equal(resolveDefaultBranch(undefined, releases), 'v1.0.0');
    });

    it('falls back to main when only placeholder releases exist', () => {
        assert.equal(
            resolveDefaultBranch(undefined, [{ tag: 'placeholder' }]),
            'main',
        );
    });
});

describe('isPreviewRelease', () => {
    it('matches preview in name or tag', () => {
        assert.equal(isPreviewRelease({ tag: 'v1.0.0', name: 'Preview build' }), true);
        assert.equal(isPreviewRelease({ tag: 'preview-1' }), true);
        assert.equal(isPreviewRelease({ tag: 'v1.0.0', name: 'Stable' }), false);
    });
});
