/* Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

import path from 'path';
import fs from 'fs/promises';

import type { JSONSchema } from 'json-schema-to-ts';

import * as Schemas from '../site/src/schema';

async function writeSchema(name: string, schema: JSONSchema) {
    const resourcesDir = path.join(__dirname, '..', 'resources');
    const schemaPath = path.join(resourcesDir, `${name}.json`);
    const schemaJSON = JSON.stringify(schema, undefined, 4);
    await fs.mkdir(resourcesDir, { recursive: true });
    await fs.writeFile(schemaPath, schemaJSON);
    console.log(`Written "${name}" schema to "${schemaPath}"`);
}

async function writeSchemas(): Promise<void[]> {
    return Promise.all([
        writeSchema('schema', {
            $schema: 'http://json-schema.org/draft-07/schema#',
            ...Schemas.orgIndexSchema,
        }),
        writeSchema('output_schema', {
            $schema: 'http://json-schema.org/draft-07/schema#',
            ...Schemas.appIndexSchema,
        }),
    ]);
}

writeSchemas();
