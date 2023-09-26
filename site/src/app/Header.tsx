/* Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

import Image from 'next/image';
import { ChangeEvent, Dispatch, useMemo } from 'react';
import { FilterAction, Filters } from './filters';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/solid';
import classNames from 'classnames';
import debounce from 'lodash/debounce';

let contents = `static void gzll_tx_result_handler(struct gzll_tx_result *tx_result)a {
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
                LOG_ERR(&quot;RX fifo error&quot;);
            } else if (ack_payload_length > 0) {
                err = dk_set_leds(ack_payload[0] & DK_ALL_LEDS_MSK);
                if (err) {
                    LOG_ERR(&quot;Cannot output LEDs (err: %d)&quot;, err);
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
    function handleTextSearchChange(e: ChangeEvent<HTMLInputElement>) {
        props.dispatchFilters({ type: 'textSearch', payload: e.target.value });
    }

    const aboutIcon = (
        <QuestionMarkCircleIcon
            title="About"
            onClick={props.showAboutDialog}
            width={32}
            height={32}
            className="cursor-pointer text-white text-opacity-95 drop-shadow transition-opacity hover:text-opacity-100"
        />
    );

    return (
        <div>
            <header
                id="header"
                className={classNames('expanded-header header flex h-[65px] md:min-h-[250px]')}
                data-content={contents}
            >
                {/* Mobile */}

                <div className="flex w-full items-center p-3 shadow-md md:hidden">
                    <h1 className="flex-grow text-center text-xl text-white">
                        nRF Connect SDK App Index
                    </h1>
                    {aboutIcon}
                </div>

                {/* Desktop */}

                <a href="https://nordicsemi.no">
                    <div className="absolute left-4 z-10 hidden h-[125px] w-[125px] items-center justify-center bg-white py-[30px] pl-[20px] pr-[14px] md:flex">
                        <Image
                            src="/nordic.svg"
                            width={100}
                            height={100}
                            alt="Nordic Semiconductor Logo"
                        />
                    </div>
                </a>

                <div className="relative hidden w-full flex-col justify-center gap-8 md:flex">
                    <div className="absolute right-4 top-4">{aboutIcon}</div>

                    <div className="flex flex-col items-center gap-2 px-2 md:px-0">
                        <h1 className="text-center text-4xl text-white drop-shadow">
                            nRF Connect SDK App Index
                        </h1>
                        <p className="text-center text-xl font-thin text-white drop-shadow-sm">
                            Discover applications and samples built for the nRF Connect SDK
                        </p>
                    </div>

                    <div className="absolute bottom-0 flex w-full justify-center">
                        <input
                            type="text"
                            placeholder="Filter applications..."
                            value={props.filters.textSearch}
                            onChange={handleTextSearchChange}
                            className="relative top-5 mx-4 h-14 w-full max-w-5xl p-3 pl-3 drop-shadow-md lg:mx-0 lg:w-2/3"
                        />
                    </div>
                </div>
            </header>

            <input
                type="text"
                placeholder="Filter applications..."
                value={props.filters.textSearch}
                onChange={handleTextSearchChange}
                className="h-14 w-full rounded-none border-b border-gray-300 pl-3 md:hidden"
            />
        </div>
    );
}

export default Header;
