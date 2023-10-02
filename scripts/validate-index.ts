/* Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

import Ajv, { ErrorObject } from 'ajv';
import colours from 'ansi-colors';

import orgIndexSchema from '../resources/schema.json';
import { readOrgIndexFiles } from './orgFiles';

function reportError(file: string, error: ErrorObject) {
    const start = `Property ${error.instancePath}`.trim();
    const message = `${start} ${error.message}`;

    if ('GITHUB_RUN_ID' in process.env) {
        console.log(`::error file={${file}},title={Invalid index file}::${message}`);
    } else {
        console.error(colours.red(`Error in ${file}: ${message}`));
    }
}

async function run() {
    const ajv = new Ajv();
    const files = await readOrgIndexFiles();

    const validate = ajv.compile(orgIndexSchema);

    let isError = false;

    for (const { orgIndex, file } of files) {
        const isValid = validate(orgIndex);
        if (!isValid) {
            validate.errors?.forEach((error) => reportError(file, error));
            isError = true;
        }
    }

    if (!isError) {
        console.log(colours.green('All index files validated successfully.'));
        process.exit(0);
    } else {
        process.exit(1);
    }
}

run();
