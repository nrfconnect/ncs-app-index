/* Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { getAppIndex, importDocs } from '../data';
import { NormalisedApp } from '../schema';
import Root from './Root';

export default function Page() {
    const apps = normaliseApps();
    const docs = importDocs();
    return <Root apps={apps} docs={docs} />;
}

// Run once at build time to turn the JSON data into something easier
// to work with.
function normaliseApps(): NormalisedApp[] {
    const appIndex = getAppIndex();
    const normalised: NormalisedApp[] = [];

    for (const app of appIndex.apps) {
        const owner = appIndex.orgs[app.owner];
        if (!owner) {
            console.warn(`Unknown owner "${app.owner}" in app "${app.id}"`);
            continue;
        }

        app.tags = Array.from(new Set(app.tags));
        normalised.push({ ...app, owner });
    }

    return normalised;
}
