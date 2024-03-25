/* Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

'use client';

import { useEffect, useMemo, useReducer, useRef, useState } from 'react';

import AppList from './AppList';
import { NormalisedApp } from '../schema';
import Header from './Header';
import { filterReducer, initialFilters } from './filters';
import Dialog from './Dialog';
import InstructionsDialog from './InstructionsDialog';
import AboutDialog from './AboutDialog';

interface Props {
    apps: NormalisedApp[];
}

function Root(props: Props) {
    const [filters, dispatchFilters] = useReducer(filterReducer, initialFilters);
    const [showingAppId, setShowingAppId] = useState<string | null>(null);
    const [showingAboutDialog, setShowingAboutDialog] = useState(false);

    const dialogRef = useRef<HTMLDialogElement>(null);

    function onDialogClose() {
        dialogRef.current?.close();
        setShowingAppId(null);
        setShowingAboutDialog(false);
    }

    function showAboutDialog() {
        setShowingAboutDialog(true);
    }

    useEffect(() => {
        if (showingAppId !== null || showingAboutDialog) {
            dialogRef.current?.showModal();
        } else {
            onDialogClose();
        }
    }, [showingAppId, showingAboutDialog]);

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
    }, []);

    const showingApp = useMemo(
        () => props.apps.find((app) => app.id === showingAppId),
        [showingAppId],
    );

    return (
        <main className="text-gray-600" id="root">
            <Dialog ref={dialogRef}>
                {showingApp && <InstructionsDialog app={showingApp} close={onDialogClose} />}
                {showingAboutDialog && <AboutDialog close={onDialogClose} />}
            </Dialog>

            <Header
                filters={filters}
                dispatchFilters={dispatchFilters}
                showAboutDialog={showAboutDialog}
            />

            <div className="md:mt-7 lg:mt-10 pb-0 lg:pb-10">
                <AppList apps={props.apps} filters={filters} setShowingAppId={setShowingAppId} />
            </div>
        </main>
    );
}

export default Root;
