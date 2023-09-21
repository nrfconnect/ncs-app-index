import { NormalisedApp } from '../schema';
import AppBlock from './AppBlock';
import { Filters, filterApps } from './filters';

interface Props {
    apps: NormalisedApp[];
    filters: Filters;
    setShowingAppId: (id: string) => void;
}

function AppList({ apps, filters, setShowingAppId }: Props): JSX.Element {
    const filteredApps = filterApps(apps, filters);

    return (
        <ul className="mx-4 mb-4 flex h-full flex-col items-center justify-between gap-3 overflow-y-scroll md:mb-0 md:gap-5 md:p-0 lg:mx-0">
            {filteredApps.map((app) => (
                <AppBlock key={app.id} app={app} setShowingAppId={setShowingAppId} />
            ))}

            {!filteredApps.length && (
                <p className="mt-10 flex-grow text-center text-xl text-gray-500">
                    No results found.
                </p>
            )}

            <li className="text-center font-thin text-gray-400 md:mb-5">
                Copyright &copy; {new Date().getFullYear()} Nordic Semiconductor
            </li>
        </ul>
    );
}

export default AppList;
