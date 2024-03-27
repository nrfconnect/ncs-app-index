/* Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { AppIndex, validAppKinds, validOrgTypes, validTags } from './schema';

import { faker } from '@faker-js/faker';

faker.seed(1237);

const companyIds = faker.helpers.multiple(faker.string.uuid, { count: 10 });

function createFakeOrg(id: string): AppIndex['orgs'][string] {
    return {
        id,
        name: faker.company.name(),
        description: faker.lorem.paragraph(),
        kind: 'External',
        type: faker.helpers.arrayElement(validOrgTypes),
        urls: {
            support: faker.internet.url(),
            email: faker.internet.email(),
            twitter: faker.helpers.maybe(() => faker.internet.displayName()),
            blog: faker.helpers.maybe(() => faker.internet.url()),
        },
    };
}

function createFakeApp(): AppIndex['apps'][number] {
    const id = faker.string.uuid();

    return {
        id,
        name: faker.commerce.productName(),
        description: faker.lorem.paragraph(),
        defaultBranch: faker.git.branch(),
        forks: faker.number.int({ max: 200 }),
        isTemplate: faker.helpers.arrayElement([true, false]),
        kind: faker.helpers.arrayElement(validAppKinds),
        lastUpdate: faker.date.recent().toString(),
        license: faker.word.verb(),
        tags: faker.helpers.arrayElements(validTags),
        watchers: faker.number.int({ max: 10 }),
        stars: faker.number.int({ max: 10 }),
        manifest: faker.lorem.word(),
        owner: faker.helpers.arrayElement(companyIds),
        repo: `https://github.com/${faker.lorem.slug()}/${id}`,
        releases: faker.helpers.multiple(
            () => ({
                name: faker.system.semver(),
                date: faker.date.recent().toString(),
                tag: faker.git.branch(),
                ncs: faker.git.branch(),
            }),
            { count: { min: 1, max: 5 } },
        ),
        compatibleNcs: [faker.git.commitSha()]
    };
}

export const sampleData: AppIndex = {
    orgs: companyIds.reduce((acc, id) => ({ ...acc, [id]: createFakeOrg(id) }), {}),
    apps: faker.helpers.multiple(createFakeApp, { count: 100 }),
};
