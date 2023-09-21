import { XMarkIcon } from '@heroicons/react/20/solid';
import { ForwardedRef, HTMLProps, PropsWithChildren, forwardRef } from 'react';

function Dialog(
    props: PropsWithChildren<HTMLProps<HTMLDialogElement>>,
    ref: ForwardedRef<HTMLDialogElement>,
) {
    const { children, ...rest } = props;

    return (
        <dialog
            className="w-full overflow-y-auto outline-none drop-shadow-md backdrop:bg-gray-800/50 md:w-3/5 md:max-w-3xl"
            ref={ref}
            {...rest}
        >
            {children}
        </dialog>
    );
}

export function DialogTitle(props: { title: string; onClose: () => void }) {
    return (
        <div className="flex items-center justify-between border-b border-gray-300 bg-gray-50 p-3 ">
            <h1 className="text-xl text-gray-700">{props.title}</h1>
            <XMarkIcon width={25} height={25} className="cursor-pointer" onClick={props.onClose} />
        </div>
    );
}

export default forwardRef(Dialog);
