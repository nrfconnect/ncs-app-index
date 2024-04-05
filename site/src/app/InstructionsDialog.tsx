/* Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { PropsWithChildren } from 'react';
import { NormalisedApp } from '../schema';
import CodeBlock from './CodeBlock';
import { DialogTitle } from './Dialog';

interface Props {
    app: NormalisedApp;
    sha: string;
    close: () => void;
}

const StepTitle = ({ index, children }: PropsWithChildren<{ index: number }>) => (
    <h3 className="flex items-center gap-2">
        <span className="flex h-[25px] w-[25px] select-none items-center justify-center rounded-full bg-[#00A9CE] text-white">
            {index}
        </span>
        <span className="text-[#00A9CE]">{children}</span>
    </h3>
);

const Step = ({ children }: PropsWithChildren) => (
    <div className="flex flex-col gap-4">{children}</div>
);

function InstructionsDialog({ app, sha, close }: Props): JSX.Element {
    return (
        <div className="flex flex-col">
            <DialogTitle title={`Get Started with ${app.name}`} onClose={close} />

            <div className="flex flex-col gap-5 p-3">
                <p className="text-base font-extralight ">
                    If you prefer to use the terminal, you can get started with this {app.kind} by
                    running the following commands:
                </p>

                <Step>
                    <StepTitle index={1}>Create a new west workspace</StepTitle>

                    <CodeBlock
                        text={`west init -m "${app.repo}" --mr ${
                            sha ?? '<latest tag>'
                        }`}
                    />
                </Step>

                <Step>
                    <StepTitle index={2}>Clone the project's repositories</StepTitle>
                    <CodeBlock text="west update" />
                </Step>
            </div>
        </div>
    );
}

export default InstructionsDialog;
