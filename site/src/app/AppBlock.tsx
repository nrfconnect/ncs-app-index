/* Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

import formatRelative from 'date-fns/formatRelative';
import classNames from 'classnames';
import Markdown from 'react-markdown';
import {
    EyeIcon,
    LawIcon,
    LinkExternalIcon,
    MailIcon,
    RepoForkedIcon,
    RepoIcon,
    RepoTemplateIcon,
    StarIcon,
    TerminalIcon,
    VerifiedIcon,
} from '@primer/octicons-react';

import { NormalisedApp, Organization } from '../schema';
import VSCodeButton from './VSCodeButton';
import TagList from './TagList';

interface Props {
    app: NormalisedApp;
    setShowingAppId: (id: string) => void;
}

function Avatar({ app }: { app: NormalisedApp }) {
    if (app.owner.type === 'Organization') {
        return <img src={app.owner.avatar} className="h-12 w-12" />;
    }

    return app.isTemplate ? <RepoTemplateIcon size={48} /> : <RepoIcon size={48} />;
}

function AppBlock({ app, setShowingAppId }: Props): JSX.Element {
    return (
        <li className="flex w-full max-w-5xl flex-col gap-3 border border-gray-300 bg-white p-3 lg:w-2/3">
            <div className="flex gap-3">
                <Avatar app={app} />

                <div className="flex flex-grow flex-col gap-2 md:gap-0">
                    <div className="flex flex-wrap items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="flex gap-3 md:block">
                                <h1 className="text-xl text-gray-600">{app.title ?? app.name}</h1>
                            </div>
                            <a href={app.repo} target="_blank" title="Visit Website">
                                <LinkExternalIcon className="hoverable-icon" size={20} />
                            </a>
                        </div>

                        <div className="hidden items-center gap-2 md:flex">
                            <TagList app={app} />
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        <h2 className="text-md text-gray-600" title={app.owner.kind}>
                            <a href={app.owner.urls.support}>{app.owner.name}</a>
                        </h2>

                        {app.owner.kind !== 'External' && (
                            <VerifiedIcon
                                className={classNames({
                                    'text-[#00A9CE]': app.owner.kind === 'Nordic Semiconductor',
                                })}
                            />
                        )}

                        {app.owner.urls.email && (
                            <a href={`mailto:${app.owner.urls.email}`}>
                                <MailIcon className={classNames('hoverable-icon')} />
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
                    Instructions <TerminalIcon size={20} />
                </button>
            </div>
            <div className="flex w-full justify-between gap-3 text-xs text-gray-600">
                <div className="flex items-center gap-1" title={`${app.stars} stars`}>
                    <StarIcon /> {app.stars}
                </div>
                <div className="flex items-center gap-1" title={`${app.watchers} watching`}>
                    <EyeIcon /> {app.watchers}
                </div>
                <div className="flex items-center gap-1" title={`${app.forks} forks`}>
                    <RepoForkedIcon /> {app.forks}
                </div>
                {app.license && (
                    <div className="flex items-center gap-1">
                        <LawIcon /> {app.license}
                    </div>
                )}
                <div className="flex-1 text-right font-thin italic">
                    Last updated {formatRelative(new Date(app.lastUpdate), new Date())}
                </div>
            </div>
        </li>
    );
}

export default AppBlock;
