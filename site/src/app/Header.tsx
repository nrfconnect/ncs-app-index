/* Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

import Image from 'next/image';
import { ChangeEvent, Dispatch } from 'react';
import { FilterAction, Filters } from './filters';
import { QuestionIcon } from '@primer/octicons-react';

let contents = `static void gzll_tx_result_handler(struct gzll_tx_result *tx_result) {
    int err;
    bool result_value;
    uint32_t ack_payload_length = NRF_GZLL_CONST_MAX_PAYLOAD_LENGTH;

    if (tx_result->success) {
        if (tx_result->info.payload_received_in_ack) {
            /* Pop packet and write first byte of the payload to the GPIO port. */
            result_value = nrf_gzll_fetch_packet_from_rx_fifo(tx_result->pipe,
                                        ack_payload,
                                        &ack_payload_length);
            if (!result_value) {
                LOG_ERR("RX fifo error");
            } else if (ack_payload_length > 0) {
                err = dk_set_leds(ack_payload[0] & DK_ALL_LEDS_MSK);
                if (err) {
                    LOG_ERR("Cannot output LEDs (err: %d)", err);
                }
            }
        }
    }
}`;

interface Props {
    filters: Filters;
    dispatchFilters: Dispatch<FilterAction>;
    showAboutDialog(): void;
}

function Header(props: Props): JSX.Element {
    function handleSearch(type: FilterAction['type']) {
        return (e: ChangeEvent<HTMLInputElement>) => {
            props.dispatchFilters({ type: type, payload: e.target.value });
        };
    }

    const aboutIcon = (
        <div title="About" onClick={props.showAboutDialog}>
            <QuestionIcon
                size={32}
                className="cursor-pointer text-white text-opacity-95 drop-shadow transition-opacity hover:text-opacity-100"
            />
        </div>
    );

    return (
        <div>
            <header
                id="header"
                className="header relative flex min-h-[65px] flex-col md:min-h-[250px]"
            >
                <div className="header__watermark" aria-hidden="true">
                    {contents}
                </div>
                <a href="https://nordicsemi.no">
                    <div className="absolute left-4 z-10 hidden h-[125px] w-[125px] items-center justify-center bg-white py-[30px] pl-[20px] pr-[14px] md:flex">
                        <Image
                            src="/ncs-app-index/nordic.svg"
                            width={100}
                            height={100}
                            alt="Nordic Semiconductor Logo"
                        />
                    </div>
                </a>

                <div className="header__title-row grid w-full grid-cols-[1fr_auto_1fr] items-center gap-2 p-3 shadow-md md:shadow-none md:pt-10">
                    <span className="hidden md:block" aria-hidden="true" />
                    <h1 className="col-start-2 text-center text-xl text-white md:text-4xl">
                        nRF Connect SDK Add-ons
                    </h1>
                    <div className="col-start-3 justify-self-end md:col-start-3">{aboutIcon}</div>
                </div>

                <p className="relative z-[1] hidden px-2 text-center text-xl font-thin text-white md:block md:px-0">
                    Discover components that extend the nRF Connect SDK
                </p>

                <div className="absolute bottom-0 hidden w-full justify-center md:flex">
                    <div className="relative top-5 mx-4 flex h-14 w-full max-w-5xl lg:w-2/3">
                        <input
                            type="search"
                            placeholder="Filter applications..."
                            value={props.filters.appSearch}
                            onChange={handleSearch('appSearch')}
                            aria-label="Filter applications"
                            className="w-3/4 p-3 pl-3 outline-none drop-shadow-md lg:mx-0"
                        />
                        <input
                            type="search"
                            placeholder="nRF Connect SDK version..."
                            value={props.filters.ncsSearch}
                            onChange={handleSearch('ncsSearch')}
                            aria-label="Filter NCS version"
                            className="w-1/4 p-3 pl-3 outline-none drop-shadow-md lg:mx-0"
                        />
                    </div>
                </div>
            </header>

            {/* Mobile */}
            <div className="h-14 w-full rounded-none md:hidden">
                <input
                    type="text"
                    placeholder="Filter applications..."
                    value={props.filters.appSearch}
                    onChange={handleSearch('appSearch')}
                    className="h-full w-2/3 border-b border-r border-gray-300 pl-3"
                />
                <input
                    type="text"
                    placeholder="SDK ..."
                    value={props.filters.ncsSearch}
                    onChange={handleSearch('ncsSearch')}
                    className="h-full w-1/3 border-b border-gray-300 pl-3"
                />
            </div>
        </div>
    );
}

export default Header;
