/* Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { useState } from 'react';
import { CheckIcon } from '@heroicons/react/20/solid';

interface Props {
    text: string;
}

function CodeBlock(props: Props): JSX.Element {
    const [isTextCopied, setIsTextCopied] = useState(false);

    function copyText() {
        navigator.clipboard?.writeText(props.text);
        setIsTextCopied(true);
    }

    return (
        <div className="flex flex-col gap-2">
            <code className="grow flex-wrap overflow-x-auto whitespace-pre border border-gray-200 bg-gray-50 p-2 font-mono text-xs">
                {props.text}
            </code>

            <button className="w-fit text-xs font-thin outline-none" onClick={copyText}>
                {isTextCopied ? (
                    <div className="flex items-center gap-1 text-green-800">
                        <span>Copied</span>
                        <CheckIcon className="" width={10} height={10} />
                    </div>
                ) : (
                    <span>Copy to clipboard</span>
                )}
            </button>
        </div>
    );
}

export default CodeBlock;
