/* Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

import Image from 'next/image';
import VSCodeQueryParams from './VSCodeQueryParams';

interface Props {
    queryParams: VSCodeQueryParams;
}

function VSCodeButton({ queryParams }: Props): JSX.Element {
    return (
        <a
            href={`vscode://nordic-semiconductor.nrf-connect-extension-pack/get-application?${queryParams.toString()}`}
            title="Open in nRF Connect for VS Code"
            className="button bg-[#0032A0] text-white"
        >
            Open in
            <Image
                src="/ncs-app-index/nrf_connect_hero.svg"
                alt="nRF Connect for VS Code Logo"
                priority
                draggable={false}
                width={25}
                height={25}
            />
        </a>
    );
}

export default VSCodeButton;
