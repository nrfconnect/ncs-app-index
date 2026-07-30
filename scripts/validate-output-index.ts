/* Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

import Ajv, { ErrorObject } from 'ajv';
import addFormats from 'ajv-formats';
import colours from 'ansi-colors';
import fs from 'fs/promises';
import path from 'path';

import { appIndexSchemaForAjv } from './schemaForAjv';

function reportError(error: ErrorObject) {
    const start = `Property ${error.instancePath}`.trim();
    const message = `${start} ${error.message}`;

    if ('GITHUB_RUN_ID' in process.env) {
        console.log(`::error file={resources/index.json},title={Invalid output index}::${message}`);
    } else {
        console.error(colours.red(`Error in resources/index.json: ${message}`));
    }
}

async function run() {
    const indexPath = path.join(__dirname, '..', 'resources', 'index.json');
    const indexJSON = JSON.parse(await fs.readFile(indexPath, 'utf-8'));

    const ajv = new Ajv();
    addFormats(ajv);
    const validate = ajv.compile(appIndexSchemaForAjv);
    const isValid = validate(indexJSON);

    if (!isValid) {
        validate.errors?.forEach(reportError);
        process.exit(1);
    }

    console.log(colours.green('Generated index.json validated successfully.'));
}

run();
