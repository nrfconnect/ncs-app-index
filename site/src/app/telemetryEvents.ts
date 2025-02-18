/* Copyright (c) 2025 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */


import { TelemetryEvent } from "./telemetry";

export class NCSAddonsEvent implements TelemetryEvent {
    idPrefix: string = 'ncs-addons';
    id: string;
    props = {};

    constructor(id: string) {
        this.id = `${this.idPrefix}/${id}`; 
    }
};

export class SearchEvent extends NCSAddonsEvent {
    constructor(ncs?: string, app?: string) {
        super('search');
        this.props = { app: app, ncs: ncs };
    }
};
