/* Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

import type { Metadata } from 'next';

import './app.css';

export const metadata: Metadata = {
    title: 'nRF Connect SDK Add-ons',
    description: 'Index of supplementary components available for the nRF Connect SDK.',
    authors: [{ name: 'Nordic Semiconductor', url: 'https://nordicsemi.com' }],
    themeColor: '#00A9CE',
    appleWebApp: { capable: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className="overflow-x-hidden bg-gray-50">{children}</body>
        </html>
    );
}
