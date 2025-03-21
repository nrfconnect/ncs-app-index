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

export class ShowAppGuideEvent extends NCSAddonsEvent {
    constructor(app: string, revision: string, org: string) {
        super('showAppGuide');
        this.props = { app: app, revision: revision, org: org };
    }
};

export class OpenDocsEvent extends NCSAddonsEvent {
    constructor(app: string, org: string) {
        super('openDocsEvent');
        this.props = { app: app, org: org };
    }
};

export class ShowSupportInfoEvent extends NCSAddonsEvent {
    constructor(app: string, revision: string, org: string) {
        super('showSupportInfo');
        this.props = { app: app, revision: revision, org: org };
    }
};
