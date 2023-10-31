/* Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

import Fuse from 'fuse.js';

import { NormalisedApp } from '../schema';

export interface Filters {
    textSearch: string;
}

export const initialFilters: Filters = {
    textSearch: '',
};

interface TextSearchAction {
    type: 'textSearch';
    payload: string;
}

export type FilterAction = TextSearchAction;

export function filterReducer(state: Filters, action: FilterAction): Filters {
    switch (action.type) {
        case 'textSearch':
            return { ...state, textSearch: action.payload };
    }
}

export function filterApps(apps: NormalisedApp[], filters: Filters): NormalisedApp[] {
    if (!filters.textSearch) {
        return apps;
    }

    filters = normaliseFilters(filters);
    const fuse = new Fuse(apps, { keys: ['owner.name', 'title', 'description', 'name', 'tags'] });
    const results = fuse.search(filters.textSearch);
    return results.map((result) => result.item);
}

function normaliseFilters(filters: Filters): Filters {
    return { ...filters, textSearch: filters.textSearch.toLowerCase() };
}
