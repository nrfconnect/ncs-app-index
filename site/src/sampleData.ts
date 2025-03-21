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
        contact: {
            devzoneUsername: faker.internet.email(),
        },
    };
}

function createFakeApp(): AppIndex['apps'][number] {
    const id = faker.string.uuid();

    return {
        id,
        name: faker.commerce.productName(),
        repoUrl: faker.internet.url(),
        docsUrl: faker.internet.url(),
        description: faker.lorem.paragraph(),
        defaultBranch: faker.git.branch(),
        kind: faker.helpers.arrayElement(validAppKinds),
        lastUpdate: faker.date.recent().toString(),
        license: faker.word.verb(),
        tags: faker.helpers.arrayElements(validTags),
        manifest: faker.lorem.word(),
        owner: faker.helpers.arrayElement(companyIds),
        repo: `https://github.com/${faker.lorem.slug()}/${id}`,
        releases: faker.helpers.multiple(
            () => ({
                name: faker.system.semver(),
                date: faker.date.recent().toString(),
                tag: faker.git.branch(),
                sdk: faker.system.semver()
            }),
            { count: { min: 1, max: 5 } },
        ),
    };
}

export const sampleData: AppIndex = {
    orgs: companyIds.reduce((acc, id) => ({ ...acc, [id]: createFakeOrg(id) }), {}),
    apps: faker.helpers.multiple(createFakeApp, { count: 100 }),
};
