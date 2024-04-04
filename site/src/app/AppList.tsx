/* Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { NormalisedApp } from '../schema';
import AppBlock from './AppBlock';
import { Filters, filterApps } from './filters';
import { AppDetails } from './Root';

interface Props {
    apps: NormalisedApp[];
    filters: Filters;
    setShowingAppDetails: (showingAppDetails: AppDetails) => void;
}

function AppList({ apps, filters, setShowingAppDetails }: Props): JSX.Element {
    const filteredApps = filterApps(apps, filters);

    return (
        <div className="flex w-full flex-col items-center justify-between gap-3 p-3 lg:p-0">
            {filteredApps.map((app) => (
                <AppBlock key={app.id} app={app} setShowingAppDetails={setShowingAppDetails} />
            ))}

            {!filteredApps.length && (
                <p className="mt-10 flex-grow text-center text-xl text-gray-500">
                    No results found.
                </p>
            )}
        </div>
    );
}

export default AppList;
