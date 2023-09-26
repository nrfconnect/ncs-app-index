import Image from 'next/image';
import { NormalisedApp } from '../schema';

interface Props {
    app: NormalisedApp;
}

function VSCodeButton({ app }: Props): JSX.Element {
    const params = new URLSearchParams({
        app: app.name,
        branch: app.defaultBranch,
        manifest: app.manifest ?? '',
    });

    return (
        <a
            href={`vscode://nordic-semiconductor.nrf-connect-extension-pack/get-application?${params.toString()}`}
            title="Open in nRF Connect for VS Code"
            className="button bg-[#0032A0] text-white"
        >
            Open in
            <Image
                src="/nrf_connect_hero.svg"
                alt="nRF Connect for VS Code Logo"
                priority
                draggable={false}
                width={25}
                height={25}
            />
        </a>
    );
}

export default VSCodeButton;
