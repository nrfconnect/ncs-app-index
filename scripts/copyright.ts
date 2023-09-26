/* Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

import * as fs from 'fs';
import * as path from 'path';
import { globby } from 'globby';

const currentYear = new Date().getFullYear();

const HASH_COPYRIGHT_NOTICE = `# Copyright (c) ${currentYear} Nordic Semiconductor ASA
#
# SPDX-License-Identifier: BSD-3-Clause

`;

const SLASH_STAR_COPYRIGHT_NOTICE = `/* Copyright (c) ${currentYear} Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

`;

function getInsert(filePath: string): string {
    if (path.extname(filePath) === '.py') {
        return HASH_COPYRIGHT_NOTICE;
    }
    return SLASH_STAR_COPYRIGHT_NOTICE;
}

function addCopyrightNotice(filePath: string) {
    // Script modified from: https://stackoverflow.com/a/49889780/2480017
    const contents = fs.readFileSync(filePath, 'utf8');
    const insert = getInsert(filePath);

    const empty = contents.trim() === '';
    const matches = contents.slice(0, 16) === insert.slice(0, 16);
    if (empty || matches) {
        return;
    }

    console.info(`Adding copyright notice to ${filePath}`);
    fs.writeFileSync(filePath, insert + contents, { encoding: 'utf8' });
}

function hasValidCopyright(filePath: string) {
    // Script modified from: https://stackoverflow.com/a/49889780/2480017
    const contents = fs.readFileSync(filePath, 'utf8');
    const insert = getInsert(filePath);

    const empty = contents.trim() === '';
    const matches = contents.slice(0, 16) === insert.slice(0, 16);

    return empty || matches;
}

function main(args: string[]) {
    const mode = args[0];
    const allowedModes = ['apply', 'check'];
    if (!allowedModes.includes(mode)) {
        console.error(`Usage: npm run copyright <mode>

Where mode is: apply, check
`);
        return Promise.resolve(1);
    }

    const checkMode = mode === 'check';

    const globs = ['scripts/**/*.(ts|js)', 'site/**/*.(ts|tsx|js|css|scss)'];

    return globby(globs).then((files) => {
        if (checkMode) {
            const failed = files.filter((filePath) => !hasValidCopyright(filePath));

            if (failed.length !== 0) {
                console.error(`No copyright notice detected for:\n\n  ${failed.join('\n  ')}\n`);
                return 1;
            }

            console.info('Finished checking copyright notices.');
            return 0;
        } else {
            files.forEach(addCopyrightNotice);
            console.info('Finished adding copyright notices.');
            return 0;
        }
    });
}

main(process.argv.slice(2)).then(function (status) {
    process.exit(status);
});
