/* Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

import formatRelative from 'date-fns/formatRelative';
import classNames from 'classnames';
import Markdown from 'react-markdown';

import {
    EnvelopeIcon,
    CommandLineIcon,
    ArrowTopRightOnSquareIcon,
    CheckBadgeIcon,
    ScaleIcon,
} from '@heroicons/react/20/solid';

import { NormalisedApp } from '../schema';
import VSCodeButton from './VSCodeButton';
import TagList from './TagList';

interface Props {
    app: NormalisedApp;
    setShowingAppId: (id: string) => void;
}

function AppBlock({ app, setShowingAppId }: Props): JSX.Element {
    const smallIconClass = 'w-5 h-5 md:w-4 md:h-4';

    return (
        <li className="flex w-full max-w-5xl flex-col gap-3 border border-gray-300 bg-white p-3 lg:w-2/3">
            <div className="flex gap-3">
                <img src={app.owner.avatar} className="hidden h-12 w-12 md:block" />

                <div className="flex flex-grow flex-col gap-2 md:gap-0">
                    <div className="flex flex-wrap items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="flex gap-3 md:block">
                                <img src={app.owner.avatar} className="h-12 w-12 md:hidden" />
                                <h1 className="text-xl text-gray-600">{app.title ?? app.name}</h1>
                            </div>
                            <a href={app.repo} target="_blank" title="Visit Website">
                                <ArrowTopRightOnSquareIcon
                                    className="hoverable-icon"
                                    width={20}
                                    height={20}
                                />
                            </a>
                        </div>

                        <div className="hidden items-center gap-2 md:flex">
                            <TagList app={app} />
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        <h2 className="text-md text-gray-600">
                            <a href={app.owner.urls.support}>{app.owner.name}</a>
                        </h2>

                        {app.owner.kind !== 'External' && (
                            <CheckBadgeIcon
                                title={app.owner.kind}
                                className={classNames(smallIconClass, {
                                    'text-[#00A9CE]': app.owner.kind === 'Nordic Semiconductor',
                                })}
                            />
                        )}

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
            </div>

            <div className="flex flex-wrap gap-x-2 gap-y-0 md:hidden">
                <TagList app={app} />
            </div>

            <Markdown disallowedElements={['img']} className="description">
                {app.description}
            </Markdown>

            <div className="flex flex-wrap items-center gap-2">
                <VSCodeButton app={app} />

                <button
                    className="button bg-[#768692] text-white"
                    onClick={() => setShowingAppId(app.id)}
                >
                    Instructions <CommandLineIcon width={20} height={20} />
                </button>
            </div>
            <div className="flex justify-between gap-4 text-xs text-gray-600">
                <span className="flex gap-1">
                    {app.license && (
                        <>
                            <ScaleIcon className={smallIconClass} /> {app.license}
                        </>
                    )}
                </span>
                <span className="float-right font-thin italic">
                    Last updated {formatRelative(new Date(app.lastUpdate), new Date())}
                </span>
            </div>
        </li>
    );
}

export default AppBlock;
