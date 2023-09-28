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
            .map(async (f) => ({
                id: path.basename(f, '.json'),
                orgIndex: JSON.parse(await fs.readFile(path.join(indexDir, f), 'utf-8')),
            })),
    );
}
