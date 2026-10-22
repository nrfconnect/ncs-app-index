/* Copyright (c) 2026 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

export function normalizeReleaseTag(tag: string): string {
    return tag.trim().replace(/^tags\//i, '');
}

/** Numeric segments from a leading `v1.2.3` prefix; null when not comparable. */
export function releaseTagSortKey(tag: string): number[] | null {
    const match = normalizeReleaseTag(tag).match(/^v?(\d+(?:\.\d+)*)/i);
    if (!match?.[1]) {
        return null;
    }
    return match[1].split('.').map((part) => Number.parseInt(part, 10));
}

/** `-1` if `a` < `b`, `0` if equal, `1` if `a` > `b`, `null` if either tag is not comparable. */
export function compareReleaseTags(a: string, b: string): number | null {
    const keyA = releaseTagSortKey(a);
    const keyB = releaseTagSortKey(b);
    if (!keyA || !keyB) {
        return null;
    }

    const length = Math.max(keyA.length, keyB.length);
    for (let i = 0; i < length; i += 1) {
        const partA = keyA[i] ?? 0;
        const partB = keyB[i] ?? 0;
        if (partA < partB) {
            return -1;
        }
        if (partA > partB) {
            return 1;
        }
    }
    return 0;
}

export function isReleaseTagComparableToMin(tag: string, minReleaseTag: string): boolean {
    return compareReleaseTags(tag, minReleaseTag) !== null;
}

export function isReleaseTagBelow(tag: string, minReleaseTag: string): boolean {
    const order = compareReleaseTags(tag, minReleaseTag);
    return order !== null && order < 0;
}

export function isReleaseTagAtOrAbove(tag: string, minReleaseTag: string): boolean {
    const order = compareReleaseTags(tag, minReleaseTag);
    return order !== null && order >= 0;
}

/**
 * Tags without a leading semver (e.g. `preview-foo`) are not ordered against minReleaseTag.
 * They are kept from the index and still fetched from GitHub so previews are not dropped.
 */
export function shouldIncludeReleaseDespiteMinTag(tag: string, minReleaseTag: string): boolean {
    return !isReleaseTagComparableToMin(tag, minReleaseTag);
}

export function shouldFetchGithubReleaseWithMinTag(tag: string, minReleaseTag: string): boolean {
    return isReleaseTagAtOrAbove(tag, minReleaseTag) || shouldIncludeReleaseDespiteMinTag(tag, minReleaseTag);
}

export function shouldPreserveIndexReleaseWithMinTag(tag: string, minReleaseTag: string): boolean {
    return isReleaseTagBelow(tag, minReleaseTag) || shouldIncludeReleaseDespiteMinTag(tag, minReleaseTag);
}
