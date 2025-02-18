/* Copyright (c) 2025 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */


import { TelemetryEvent } from "./telemetry";

export class NCSAddonsEvent implements TelemetryEvent {
    idPrefix: string = 'ncs-addons';
    id: string;

    constructor(id: string) {
        this.id = `${this.idPrefix}/${id}`; 
    }
};
