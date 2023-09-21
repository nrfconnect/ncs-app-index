import { sampleData } from '../sampleData';
import { NormalisedApp } from '../schema';
import Root from './Root';

export default function Page() {
    const apps = normaliseApps();
    return <Root apps={apps} />;
}

// Run once at build time to turn the JSON data into something easier
// to work with.
function normaliseApps(): NormalisedApp[] {
    const normalised: NormalisedApp[] = [];

    for (const app of sampleData.apps) {
        const owner = sampleData.orgs[app.owner];
        if (!owner) {
            console.warn(`Unknown owner "${app.owner}" in app "${app.id}"`);
            continue;
        }

        app.tags = Array.from(new Set(app.tags));
        normalised.push({ ...app, owner });
    }

    return normalised;
}
