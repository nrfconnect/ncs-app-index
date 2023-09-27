/* Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as fs from 'fs';
import path from 'path';

import { AppIndex } from './schema';

export function getAppIndex(): AppIndex {
    // Assumes that the current dir is /path/to/ncs-app-index/site/.next/server/app,
    // which is true when running the dev server and creating production builds
    // through the npm scripts.
    const indexFilePath = path.join(__dirname, '..', '..', '..', '..', 'resources', 'index.json');
    const appIndexRaw = fs.readFileSync(indexFilePath, 'utf8');
    return JSON.parse(appIndexRaw);
}
