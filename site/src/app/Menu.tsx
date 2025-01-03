/* Copyright (c) 2025 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { ChangeEvent, Dispatch, useState } from 'react';
import { BookIcon, AppsIcon } from '@primer/octicons-react';

type MenuStateType = 'apps' | 'docs';

interface Props {
    onStateChanged: (state: MenuStateType) => void;
};

function MenuItem(props: { state: MenuStateType }): JSX.Element {
    return props.state === 'apps' ? 
        (<><BookIcon size={24}/>Display Docs</>)
        :
        (<><AppsIcon size={24}/>Display Apps</>)
}

function Menu(props: Props): JSX.Element {

    const [state, setState] = useState<MenuStateType>('apps');

    const onClick = () => {
        let newState: MenuStateType = state === 'apps' ? 'docs' : 'apps';
        setState(newState);
        props.onStateChanged(newState);
    };

    return (<>
        <button className='menu-button' onClick={() => onClick()} >
            <MenuItem state={state} />
        </button>
    </>)
}

export { type Props, type MenuStateType, Menu };
