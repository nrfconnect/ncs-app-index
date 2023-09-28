/* Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

import path from 'path';
import fs from 'fs/promises';

import type { JSONSchema } from 'json-schema-to-ts';

import * as Schemas from '../site/src/schema';

async function writeSchema(name: string, schema: JSONSchema) {
    const schemaPath = path.join(__dirname, '..', 'resources', `${name}.json`);
    const schemaJSON = JSON.stringify(schema, undefined, 4);
    await fs.writeFile(schemaPath, schemaJSON);
    console.log(`Written "${name}" schema to "${schemaPath}"`);
}

async function writeSchemas(): Promise<void[]> {
    return Promise.all([
        writeSchema('org_index_schema', {
            $schema: 'http://json-schema.org/draft-07/schema#',
            ...Schemas.orgIndexSchema,
        }),
        writeSchema('app_index_schema', {
            $schema: 'http://json-schema.org/draft-07/schema#',
            ...Schemas.appIndexSchema,
        }),
    ]);
}

writeSchemas();
