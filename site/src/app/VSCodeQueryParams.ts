/* Copyright (c) 2024 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { NormalisedApp } from '../schema';


class VSCodeQueryParams{
    app: string;
    branch: string;
    manifest: string;
    repo: string;

    constructor(app: NormalisedApp) {
        this.app = app.name;
        this.branch = app.defaultBranch;
        this.manifest = app.manifest ?? "";
        this.repo = app.repo;
    }

    toString(): string {
        return new URLSearchParams({
            app: this.app,
            branch: this.branch,
            manifest: this.manifest,
            repo: this.repo,
        }).toString();
    }
};

export default VSCodeQueryParams;
