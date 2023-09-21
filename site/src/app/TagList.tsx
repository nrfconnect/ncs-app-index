import { PropsWithChildren } from 'react';
import { NormalisedApp } from '../schema';

interface Props {
    app: NormalisedApp;
}

function Tag(props: PropsWithChildren) {
    return <div className={'text-sm font-thin'}>{props.children}</div>;
}

function TagList({ app }: Props) {
    return (
        <>
            <Tag>{app.kind}</Tag>
            {app.tags.map((tag, i) => (
                <Tag key={i}>{tag}</Tag>
            ))}
        </>
    );
}

export default TagList;
