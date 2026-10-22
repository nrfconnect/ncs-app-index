/* Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

import { OrgIndex } from '../site/src/schema';

export interface ParsedOrgFile {
    /** GitHub user ID. */
    id: string;
    orgIndex: OrgIndex;
    file: string;
}

type ReleaseRef = { tag: string; name?: string };

/** Placeholder release entry used when GitHub releases are filled in by generate-index-json. */
export function usesPlaceholderReleases(releases: ReleaseRef[]): boolean {
    return releases.length === 1 && releases[0]?.tag === 'placeholder';
}

/** True when the release title or tag looks like a pre-release (e.g. "Preview" in the GitHub release name). */
export function isPreviewRelease(release: ReleaseRef): boolean {
    const label = `${release.name ?? ''} ${release.tag}`.toLowerCase();
    return label.includes('preview');
}

/**
 * Resolves the git ref shown as the default in the add-on index UI.
 * An explicit defaultBranch in the org index file always wins.
 * Otherwise the newest non-preview release is used (releases must be sorted newest-first).
 * If every release is a preview, the newest release tag is used.
 */
export function resolveDefaultBranch(
    defaultBranch: string | undefined,
    releases: ReleaseRef[],
): string {
    if (defaultBranch) {
        return defaultBranch;
    }

    const realReleases = releases.filter((release) => release.tag !== 'placeholder');
    if (realReleases.length === 0) {
        const fallback = releases[0]?.tag;
        return fallback && fallback !== 'placeholder' ? fallback : 'main';
    }

    const latestStable = realReleases.find((release) => !isPreviewRelease(release));
    if (latestStable) {
        return latestStable.tag;
    }

    return realReleases[0]?.tag ?? 'main';
}

export async function readOrgIndexFiles(): Promise<ParsedOrgFile[]> {
    const indexDir = path.join(__dirname, '..', 'index');
    if (!existsSync(indexDir)) {
        return [];
    }

    const indexFiles = await fs.readdir(indexDir);

    return Promise.all(
        indexFiles
            .filter((f) => f.endsWith('.json'))
            .map(async (f) => {
                const file = path.join(indexDir, f);
                return {
                    file: file,
                    id: path.basename(f, '.json'),
                    orgIndex: JSON.parse(await fs.readFile(file, 'utf-8')),
                };
            }),
    );
}
