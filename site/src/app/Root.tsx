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

    const showingApp = useMemo(
        () => props.apps.find((app) => app.id === showingAppId),
        [showingAppId],
    );

    return (
        <main className="flex h-full flex-col gap-4 text-gray-600 md:gap-10" id="root">
            <Dialog ref={dialogRef}>
                {showingApp && <InstructionsDialog app={showingApp} close={onDialogClose} />}
                {showingAboutDialog && <AboutDialog close={onDialogClose} />}
            </Dialog>
            <Header
                filters={filters}
                dispatchFilters={dispatchFilters}
                showAboutDialog={showAboutDialog}
            />
            <AppList apps={props.apps} filters={filters} setShowingAppId={setShowingAppId} />
            {/* <p className="text-center text-gray-400 font-thin my-4">
                Copyright &copy; {new Date().getFullYear()} Nordic Semiconductor
            </p> */}
        </main>
    );
}

export default Root;
