/* Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { PropsWithChildren } from 'react';
import { DialogTitle } from './Dialog';

const H1 = ({ children }: PropsWithChildren) => <h1 className="mb-2 text-2xl">{children}</h1>;
const H2 = ({ children }: PropsWithChildren) => <h2 className="mb-2 text-xl">{children}</h2>;
const P = ({ children }: PropsWithChildren) => <p className="mb-2 leading-relaxed">{children}</p>;

export default function AboutDialog(props: { close: () => void }): JSX.Element {
    return (
        <div className="flex flex-col">
            <div>
                <DialogTitle title="About the App Index" onClose={props.close} />
            </div>

            <div className="p-3">
                <P>
                    This is an index of applications, samples, and projects for the nRF Connect SDK.
                </P>

                <div>
                    <H2>Using the Applications</H2>
                    <P>
                        The easiest way to get started is to use{' '}
                        <a
                            className="text-blue-800"
                            href="https://docs.nordicsemi.com/bundle/nrf-connect-vscode/page/index.html"
                        >
                            nRF Connect for VS Code
                        </a>
                        . If you have VS Code installed, clicking this button will automatically
                        create a new version of the application inside VS Code.
                    </P>

                    <P>
                        If you prefer to set up the project yourself, you can follow the
                        instructions provided in the "Instructions" button for each application.
                    </P>
                </div>

                <div>
                    <H2>Contributing</H2>
                    <P>
                        If you've developed an application or sample, you can apply to have it
                        listed in this index. Read the{' '}
                        <a
                            className="text-blue-800"
                            href="https://github.com/nrfconnect/ncs-app-index/blob/main/CONTRIBUTING.md"
                        >
                            contribution guidelines
                        </a>{' '}
                        for details.
                    </P>
                </div>
            </div>
        </div>
    );
}
