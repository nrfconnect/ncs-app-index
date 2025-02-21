/* Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

'use client';

import { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { SearchEvent } from './telemetryEvents';

import AppList from './AppList';
import { NormalisedApp } from '../schema';
import Header from './Header';
import { filterReducer, initialFilters } from './filters';
import Dialog from './Dialog';
import InstructionsDialog from './InstructionsDialog';
import AboutDialog from './AboutDialog';
import { telemetry } from './telemetry';

interface Props {
    apps: NormalisedApp[];
}

export type AppDetails = { id: string, sha: string };

function Root({ apps }: Props) {
    const [filters, dispatchFilters] = useReducer(filterReducer, initialFilters);
    const [showingAppDetails, setShowingAppDetails] = useState<AppDetails | null>(null);
    const [showingAboutDialog, setShowingAboutDialog] = useState(false);
    const dialogRef = useRef<HTMLDialogElement>(null);

    function onDialogClose() {
        dialogRef.current?.close();
        setShowingAppDetails(null);
        setShowingAboutDialog(false);
    }

    function showAboutDialog() {
        setShowingAboutDialog(true);
    }

    useEffect(() => {
        if (showingAppDetails !== null || showingAboutDialog) {
            dialogRef.current?.showModal();
        } else {
            onDialogClose();
        }
    }, [showingAppDetails, showingAboutDialog]);

    useEffect(() => {
        dialogRef.current?.addEventListener('close', onDialogClose);
        return () => dialogRef.current?.removeEventListener('close', onDialogClose);
    });

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const app = searchParams.get("app");
        const ncs = searchParams.get("ncs");

        if (app) {
            dispatchFilters({ type: 'appSearch', payload: app });
        }

        if (ncs) {
            dispatchFilters({ type: 'ncsSearch', payload: ncs });
        }

        if (app || ncs) {
            telemetry.trackEvent(new SearchEvent(ncs ?? undefined, app ?? undefined));
        }
    }, []);

    const showingApp = useMemo(
        () => apps.find((app) => app.id === showingAppDetails?.id),
        [showingAppDetails],
    );

    return (
        <main className="text-gray-600" id="root">
            <Dialog ref={dialogRef}>
                {showingApp && <InstructionsDialog app={showingApp} close={onDialogClose} sha={showingAppDetails?.sha ?? showingApp.defaultBranch} />}
                {showingAboutDialog && <AboutDialog close={onDialogClose} />}
            </Dialog>

            <Header
                filters={filters}
                dispatchFilters={dispatchFilters}
                showAboutDialog={showAboutDialog}
            />

            <div className="md:mt-7 lg:mt-10 pb-0 lg:pb-10">
                <AppList apps={apps} filters={filters} setShowingAppDetails={setShowingAppDetails} />
            </div>
        </main>
    );
}

export default Root;
