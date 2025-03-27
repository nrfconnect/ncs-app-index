/* Copyright (c) 2025 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { NormalisedApp } from '../schema';
import { DialogTitle } from './Dialog';

interface Props {
    app: NormalisedApp;
    close: () => void;
}

const Warning = ({warningText}: {warningText: string}) => {
    return (<div className="flex flex-col gap-4">
        <h3 className="flex items-center gap-2">
            <span className="flex h-[25px] w-[25px] select-none items-center justify-center rounded-full bg-[#00A9CE] text-white">
                !
            </span>
            <span className="text-[#00A9CE]">{warningText}</span>
        </h3>
    </div>)
}

function SupportDialog({ app, close }: Props): JSX.Element {
    return (
        <div className="flex flex-col">
            <DialogTitle title={`Contact ${app.owner.name}`} onClose={close} />

            <div className="flex flex-col gap-5 p-3">
                <p className="text-base font-extralight ">
                    Use the following information to contact {app.owner.name}.
                </p>

                {app.owner.contact &&
                    <ul className="text-[#00A9CE]">
                        {app.owner.contact?.devzoneUsername && <li>Nordic Semiconductor DevZone username: {app.owner.contact?.devzoneUsername}</li>}
                        {app.owner.contact?.email && <li>e-mail: {app.owner.contact?.email}</li>}
                    </ul>
                }

                {!app.owner.contact && <Warning warningText={`${app.owner.name} did not share support information.`}/>}
            </div>
        </div>
    );
}

export default SupportDialog;
