import type { Metadata } from 'next';

import './app.css';

export const metadata: Metadata = {
    title: 'nRF Connect SDK App Index',
    description: 'A live index of applications and samples available for the nRF Connect SDK.',
    authors: [{ name: 'Nordic Semiconductor', url: 'https://nordicsemi.com' }],
    themeColor: '#00A9CE',
    appleWebApp: { capable: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className="overflow-hidden bg-gray-50">{children}</body>
        </html>
    );
}
