/* Copyright (c) 2026 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { releaseTagsForDropdown } from '../../site/src/releaseSelectOptions';

describe('releaseTagsForDropdown', () => {
    it('omits placeholder when GitHub release fetch did not run', () => {
        assert.deepEqual(
            releaseTagsForDropdown(
                [{ tag: 'placeholder' }],
                'main',
            ),
            [{ label: 'main', value: 'main' }],
        );
    });

    it('dedupes default branch and lists other release tags', () => {
        assert.deepEqual(
            releaseTagsForDropdown(
                [
                    { tag: 'v2.0.0' },
                    { tag: 'v1.0.0' },
                ],
                'v2.0.0',
            ),
            [
                { label: 'v2.0.0', value: 'v2.0.0' },
                { label: 'v1.0.0', value: 'v1.0.0' },
            ],
        );
    });
});
