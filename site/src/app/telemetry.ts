/* Copyright (c) 2025 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { ApplicationInsights } from '@microsoft/applicationinsights-web';

export interface TelemetryEvent {
    id: string;
    props?: string[];
};

export class Telemetry {
    private appInsights: ApplicationInsights;

    constructor(private connectionString: string) {
        this.appInsights = new ApplicationInsights({
            config: {
                connectionString: this.connectionString,
            }
        });

        this.appInsights.loadAppInsights();
    }

    trackEvent<T extends TelemetryEvent>(e: T) {
        this.appInsights.trackEvent({name: e.id, properties: e.props});
    }
};
