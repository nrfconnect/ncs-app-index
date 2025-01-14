/* Copyright (c) 2025 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { useState } from "react";
import { DocsType } from "../data"
import Markdown from "react-markdown";

type Props = {
    docs: DocsType;
};

type OnChosenFunc = (chosen: string) => void;

function DocsMenu({ docs, chosen, onChosen }: Props & { chosen: string | undefined, onChosen: OnChosenFunc }) {
    return (
        <div className="markdown-item padding-0">
            <ul className="flex flex-row">
                {
                    Object.keys(docs).map((title) => {
                        return (
                        <li className={title === chosen ? 'font-bold' : ''}>
                            <button className='button' onClick={() => onChosen(title) }>
                                {title}
                            </button>
                        </li>
                        )
                    })
                }
            </ul>
        </div>
    )
}

function Docs({ docs }: Props): JSX.Element {

    const [chosenDocs, setChosenDocs] = useState(Object.keys(docs)[0]);

    return (<div>
        <div className="markdown-container">
            <DocsMenu docs={docs} chosen={chosenDocs} onChosen={setChosenDocs}/>
            <Markdown className={'markdown-item'}>{docs[chosenDocs]}</Markdown>
        </div>
    </div>)
}


export {type Props, Docs};
