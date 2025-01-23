/* Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

import type { FromSchema, JSONSchema } from 'json-schema-to-ts';

/**
 * A list of applications registered by organizations, along with
 * information about the organization. Served as a static schema file
 * on the GitHub page.
 */
export type AppIndex = FromSchema<typeof appIndexSchema>;

export type Application = AppIndex['apps'][number];

export type Organization = AppIndex['orgs'][string];

// Move the organisation into the app object instead of just a pointer.
export type NormalisedApp = Omit<Application, 'owner'> & { owner: Organization };

/**
 * Provided by each GitHub organization or user that contributes
 * applications to the index.
 */
export type OrgIndex = FromSchema<typeof orgIndexSchema>;

const appKinds = [
    { const: 'template', description: 'A starting point for new apps' },
    { const: 'sample', description: 'A demonstration of a concept.' },
    { const: 'project', description: 'A fully-fledged project users can run on their devices.' },
] as const;

export const validAppKinds = appKinds.map((kind) => kind.const);

export const validTags = [
    'bluetooth',
    'zigbee',
    'lte',
    'dfu',
    'thread',
    'matter',
    'bt-mesh',
    'sidewalk',
    'lora-basics-modem',
    'CSS',
    'FSK',
    'ble',
    'blecon',
    'connectivity'
] as const;

export const appKindSchema = {
    description: 'The type of the app repo.',
    oneOf: appKinds,
} as const satisfies JSONSchema;

export const appTagSchema = {
    enum: validTags,
} as const satisfies JSONSchema;

export const appMetadataSchema = {
    type: 'object',
    properties: {
        name: {
            type: 'string',
            description:
                'The name of the application repo. Should be the repo-name in the GitHub URL: https://github.com/org/repo-name.',
        },
        title: {
            type: 'string',
            description:
                'Human readable name of the repo to be shown in the UI. Defaults to the name property.',
        },
        description: {
            type: 'string',
            description: 'Text describing the application. Inferred from the repo if missing.',
        },
        manifest: {
            type: 'string',
            default: 'west.yml',
            description: 'Alternative filename for the west manifest. Defaults to west.yml.',
        },
        kind: appKindSchema,
        tags: {
            type: 'array',
            items: appTagSchema,
            description: 'An array of tags describing the application.',
        },
        license: {
            type: 'string',
            description:
                'The name of the application license, e.g. "Apache 2.0". Inferred from the repo if missing.',
        },
        apps: {
            type: 'string',
            description: [
                'Glob pattern to find directories containing applications.',
                'Applications need a *.conf file and a CMakeLists.txt file at their root. The glob expressions are used to match directories, so no file pattern is necessary.',
                "By default, the VS Code extension will assume that there's just a single application sitting at the root of the repo.",
            ].join('\n\n'),
        },
        releases: {
            type: 'array',
            description: 'The collection of project`s releases.',
            items: {
                type: 'object',
                properties: {
                    tag: { type: 'string', description: 'Git tag of the released version.' },
                    name: { type: 'string', description: 'The title of the release.' },
                    date: { type: 'string', format: 'date-time', description: 'The date of publishing the release.' },
                    sdk: { type: 'string', description: 'The nRF Connect SDK version the release is compatible with.' },
                },
                required: ['tag', 'name', 'date', 'sdk'],
                additionalProperties: false,
            },
            minItems: 1,
        },
        defaultBranch: {
            type: 'string',
            description: 'The default git branch that the repository is checked out. Inferred from the repo if missing.'
        },
        docsUrl: {
            type: 'string',
            description: `The URL of the add-on's documentation`
        },
        restricted: {
            type: 'object',
            properties: {
                detailsUrl: {
                    type: 'string',
                    description: 'The URL of the documentation that explains how to grant access.',
                },
            },
            description: 'Mark the restricted access to any of the dependencies.',
            required: ['detailsUrl'],
        }
    },
    additionalProperties: false,
    required: ['name', 'kind', 'tags', 'releases'],
} as const satisfies JSONSchema;

export const orgIndexSchema = {
    type: 'object',
    properties: {
        name: {
            type: 'string',
            description: 'The name of the organization.',
        },
        description: {
            type: 'string',
            description: 'A short sentence describing the organization.',
        },
        apps: {
            type: 'array',
            items: appMetadataSchema,
            description: 'A list of applications contributed by the organization.',
        },
    },
    required: ['name', 'description', 'apps'],
    additionalProperties: false,
} as const satisfies JSONSchema;

export const validOrgTypes = ['User', 'Organization'] as const;
export const validOrgKinds = ['Nordic Semiconductor', 'Official Partner', 'External'] as const;

export const orgSchema = {
    type: 'object',
    properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        description: { type: 'string' },
        type: { type: 'string', enum: validOrgTypes },
        kind: { type: 'string', enum: validOrgKinds },
        location: { type: 'string' },
        avatar: { type: 'string', format: 'uri' },
        urls: {
            type: 'object',
            properties: {
                support: { type: 'string', format: 'uri' },
                email: { type: 'string', format: 'uri' },
                blog: { type: 'string', format: 'uri' },
                twitter: { type: 'string', format: 'uri' },
            },
            required: ['support'],
            additionalProperties: false,
        },
    },
    required: ['id', 'name', 'description', 'type', 'kind', 'urls'],
    additionalProperties: false,
} as const satisfies JSONSchema;

export const appSchema = {
    type: 'object',
    properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        title: { type: 'string' },
        description: { type: 'string' },
        license: { type: 'string' },
        repo: { type: 'string' },
        isTemplate: { type: 'boolean' },
        owner: { type: 'string', description: 'The ID of the owner organization.' },
        manifest: { type: 'string' },
        kind: appKindSchema,
        tags: { type: 'array', items: appTagSchema },
        releases: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    tag: { type: 'string' },
                    name: { type: 'string' },
                    date: { type: 'string', format: 'date-time' },
                    sdk: { type: 'string' },
                },
                required: ['tag', 'name', 'date', 'sdk'],
                additionalProperties: false,
            },
            minItems: 1,
        },
        watchers: { type: 'integer' },
        stars: { type: 'integer' },
        forks: { type: 'integer' },
        defaultBranch: { type: 'string' },
        lastUpdate: { type: 'string', format: 'date-time' },
        apps: { type: 'string' },
        docsUrl: { type: 'string' },
        restricted: {
            type: 'object',
            description: 'Mark the restricted access to any of the dependencies.',
            properties: {
                detailsUrl: {
                    type: 'string',
                    description: 'The URL of the documentation that explains how to grant access.',
                },
            },
            required: ['detailsUrl'],
        }
    },
    required: [
        'id',
        'name',
        'description',
        'isTemplate',
        'owner',
        'kind',
        'tags',
        'releases',
        'watchers',
        'stars',
        'forks',
        'defaultBranch',
        'lastUpdate',
        'repo'
    ],
    additionalProperties: false,
} as const satisfies JSONSchema;

export const appIndexSchema = {
    type: 'object',
    properties: {
        orgs: {
            type: 'object',
            additionalProperties: orgSchema,
        },
        apps: {
            type: 'array',
            items: appSchema,
        },
    },
    required: ['orgs', 'apps'],
    additionalProperties: false,
} as const satisfies JSONSchema;
