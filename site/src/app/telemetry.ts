/* Copyright (c) 2025 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { ApplicationInsights } from '@microsoft/applicationinsights-web';

export interface TelemetryEvent {
    id: string;
    props?: {
        [prop: string]: string
    };
};

class Telemetry {
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

export const telemetry = new Telemetry('InstrumentationKey=ae2167fd-0823-49e0-91a4-b6ec5a598490;IngestionEndpoint=https://northeurope-2.in.applicationinsights.azure.com/;LiveEndpoint=https://northeurope.livediagnostics.monitor.azure.com/;ApplicationId=bbb09627-f57e-40d4-a59a-50c1e0243bae');
