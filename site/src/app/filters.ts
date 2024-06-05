/* Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

import Fuse from 'fuse.js';

import { NormalisedApp } from '../schema';


function filterAppName(apps: NormalisedApp[], search: string): NormalisedApp[] {
    const fuse = new Fuse(apps, { keys: ['owner.name', 'title', 'description', 'name', 'tags'] });
    const results = fuse.search(search);
    return results.map((result) => result.item);
}

function filterNcsVersion(apps: NormalisedApp[], search: string): NormalisedApp[] {
    return apps.filter((app) => app.releases.some((release) => release?.sdk?.includes(search) ));
}

export interface Filters {
    appSearch: string;
    ncsSearch: string;
};

export const initialFilters: Filters = { appSearch: "", ncsSearch: "" };

interface TextSearchAction {
    type: 'ncsSearch' | 'appSearch';
    payload: string;
}

export type FilterAction = TextSearchAction;

export function filterReducer(filters: Filters, action: FilterAction): Filters {
    switch (action.type) {
        case 'appSearch':
            return { ...filters, appSearch: action.payload};
        case 'ncsSearch':
            return { ...filters, ncsSearch: action.payload};
    }
}

export function filterApps(apps: NormalisedApp[], filters: Filters): NormalisedApp[] {

    if (filters.appSearch !== '') {
        apps = filterAppName(apps, filters.appSearch);
    }

    if (filters.ncsSearch !== '') {
        apps = filterNcsVersion(apps, filters.ncsSearch);
    }

    return apps;
}
