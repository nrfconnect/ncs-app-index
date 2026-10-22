/* Copyright (c) 2026 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

export type GithubReleaseRepoConfig = {
    owner: string;
    repo: string;
    label: string;
    /**
     * Oldest release tag to load from GitHub. Older tags are neither fetched nor resolved,
     * and releases of that age already listed in the org index file are kept unchanged.
     */
    minReleaseTag?: string;
};

/** nrfconnect add-ons whose GitHub releases are auto-populated by generate-index-json. */
export const githubReleaseRepos: Record<string, GithubReleaseRepoConfig> = {
    'asset-tracker-template': {
        owner: 'nrfconnect',
        repo: 'Asset-Tracker-Template',
        label: 'Asset Tracker Template',
        minReleaseTag: 'v1.5.2',
    },
    'ncs-serial-modem-host-applications': {
        owner: 'nrfconnect',
        repo: 'ncs-serial-modem-host-applications',
        label: 'Serial Modem Host Applications',
        minReleaseTag: 'v0.14.1',
    },
    'quickstart-bluetooth': {
        owner: 'nrfconnect',
        repo: 'quickstart-bluetooth',
        label: 'nRF Cloud Bluetooth Quick Start',
        minReleaseTag: 'v1.1.0',
    },
    'ncs-matter': {
        owner: 'nrfconnect',
        repo: 'ncs-matter',
        label: 'Matter',
    },
};

export function githubReleaseRepoForAppName(appName: string): GithubReleaseRepoConfig | undefined {
    return githubReleaseRepos[appName];
}
