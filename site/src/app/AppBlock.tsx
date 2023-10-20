/* Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

import formatRelative from 'date-fns/formatRelative';
import classNames from 'classnames';

import {
    StarIcon,
    EnvelopeIcon,
    CommandLineIcon,
    ArrowTopRightOnSquareIcon,
} from '@heroicons/react/20/solid';

import { NormalisedApp } from '../schema';
import VSCodeButton from './VSCodeButton';
import TagList from './TagList';

interface Props {
    app: NormalisedApp;
    setShowingAppId: (id: string) => void;
}

function AppBlock({ app, setShowingAppId }: Props): JSX.Element {
    const smallIconClass = 'w-5 h-5 md:w-3 md:h-3';

    return (
        <li className="flex w-full max-w-5xl flex-col gap-3 border border-gray-300 bg-white p-3 lg:w-2/3">
            <div className="flex flex-col">
                <div className="flex flex-wrap items-center justify-between">
                    <div className="flex items-center gap-2">
                        <h1 className="text-xl text-gray-600">{app.title ?? app.name}</h1>
                        <a href={app.repo} target="_blank" title="Visit Website">
                            <ArrowTopRightOnSquareIcon
                                className="hoverable-icon"
                                width={20}
                                height={20}
                            />
                        </a>
                    </div>

                    <div className="hidden items-center gap-2 md:flex">
                        {app.owner.isPartner && (
                            <StarIcon
                                title="Official Partner"
                                className={classNames(smallIconClass, 'text-[#00A9CE]')}
                            />
                        )}
                        <TagList app={app} />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <h2 className="text-md text-gray-600">
                        <a href={app.owner.urls.support}>{app.owner.name}</a>
                    </h2>

                    {app.owner.urls.email && (
                        <a href={`mailto:${app.owner.urls.email}`}>
                            <EnvelopeIcon
                                title="Send Email"
                                className={classNames(smallIconClass, 'hoverable-icon')}
                            />
                        </a>
                    )}
                </div>
            </div>

            <div className="flex flex-wrap gap-x-2 gap-y-0 md:hidden">
                <TagList app={app} />
            </div>

            <p className="text-sm">{app.description}</p>

            <div className="flex flex-wrap items-center gap-2">
                <VSCodeButton app={app} />

                <button
                    className="button bg-[#768692] text-white"
                    onClick={() => setShowingAppId(app.id)}
                >
                    Instructions <CommandLineIcon width={20} height={20} />
                </button>
            </div>

            <p className="float-right text-xs font-thin italic text-gray-600">
                Last updated {formatRelative(new Date(app.lastUpdate), new Date())}
            </p>
        </li>
    );
}

export default AppBlock;
