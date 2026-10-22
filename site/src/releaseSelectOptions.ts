/* Copyright (c) 2026 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

export const PLACEHOLDER_RELEASE_TAG = 'placeholder';

export type ReleaseSelectOption = {
    label: string;
    value: string;
};

/** Builds react-select options; placeholder tags are never selectable checkout refs. */
export function releaseTagsForDropdown(
    releases: ReadonlyArray<{ tag?: string | null }>,
    defaultBranch: string,
): ReleaseSelectOption[] {
    const additional = releases
        .map((release) => release.tag ?? '')
        .filter((tag) => tag && tag !== PLACEHOLDER_RELEASE_TAG && tag !== defaultBranch)
        .map((tag) => ({ label: tag, value: tag }));

    return [{ label: defaultBranch, value: defaultBranch }, ...additional];
}
