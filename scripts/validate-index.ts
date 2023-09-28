/* Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

import Ajv from 'ajv';
import * as colours from 'ansi-colors';

import orgIndexSchema from '../resources/org_index_schema.json';
import { readOrgIndexFiles } from './helpers';

async function run() {
    const ajv = new Ajv();
    const files = await readOrgIndexFiles();

    for (const { id, orgIndex } of files) {
        if (!ajv.validate(orgIndexSchema, orgIndex)) {
            throw new Error(`Index file "${id}" does not match the schema.`);
        }
    }

    console.log(colours.green('All index files validated successfully.'));
}

run();
