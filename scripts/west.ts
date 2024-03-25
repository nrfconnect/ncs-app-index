/* Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { exec } from 'child_process';
import fs from 'fs/promises';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function exists(path: string): Promise<boolean> {
    try {
        await fs.access(path);
        return true;
    } catch {
        return false;
    }
}

class WestEnv {

    constructor(private repoUrl: string, private revision: string, private appPath: string) {}

    async init(): Promise<void> {
        try {
            const dirExists = await exists(this.appPath);
            if (!dirExists) {
                await fs.mkdir(this.appPath, { recursive: true });
            }
            await execAsync(
                `cd ${this.appPath} && west init -m ${this.repoUrl} --mr ${this.revision} && west update`
            )
        } catch(err) {
            Promise.reject(`west init failed with err: ${err}`);
        }
    }

    async checkout(revision: string): Promise<void> {

        const {stdout} = await execAsync(`cd ${this.appPath} && west config manifest.path`);
        const manifestRepoPath = `${this.appPath}/${stdout.trim()}`;

        await execAsync(`cd ${manifestRepoPath} && git checkout ${revision} && west update`)

        this.revision = revision;
    }

    get manifestRev(): string {
        return this.revision;
    }

    async getModuleRev(module: string): Promise<string | undefined> {

        let {stdout} = await execAsync(
            `cd ${this.appPath} && west list --all --format "{name};{revision}" | grep "${module};"`
        );

        return stdout.split(";")[1]?.trim();
    }
}

export default WestEnv;
