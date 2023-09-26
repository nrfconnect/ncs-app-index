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
export type AppIndex = FromSchema<
    typeof appIndexSchema,
    { references: [typeof orgSchema, typeof appSchema, typeof appKindSchema, typeof appTagSchema] }
>;

export type Application = AppIndex['apps'][number];

export type Organization = AppIndex['orgs'][string];

// Move the organisation into the app object instead of just a pointer.
export type NormalisedApp = Omit<Application, 'owner'> & { owner: Organization };

/**
 * Provided by each GitHub organization or user that contributes
 * applications to the index.
 */
export type OrgIndex = FromSchema<
    typeof orgIndexSchema,
    { references: [typeof appKindSchema, typeof appTagSchema, typeof appMetadataSchema] }
>;

export const SchemaIds = (() => {
    const id = <T extends string>(name: T) =>
        `http://nordicsemi.no/app_index/schemas/${name}.json` as const;

    return {
        AppKind: id('app_kind'),
        AppTag: id('app_tag'),
        AppMetadata: id('app_metadata'),
        OrgIndex: id('org_index'),
        Organization: id('org'),
        Application: id('app'),
        AppIndex: id('app_index'),
    } as const;
})();

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
] as const;

export const appKindSchema = {
    $id: SchemaIds.AppKind,
    oneOf: appKinds,
} as const satisfies JSONSchema;

export const appTagSchema = {
    $id: SchemaIds.AppTag,
    enum: validTags,
} as const satisfies JSONSchema;

export const appMetadataSchema = {
    $id: SchemaIds.AppMetadata,
    type: 'object',
    properties: {
        name: {
            type: 'string',
            description: 'The name of the application.',
        },
        description: {
            type: 'string',
            description: 'Text describing the application. Inferred from the repo if missing.',
        },
        manifest: {
            type: 'string',
            default: 'west.yml',
            description: 'T',
        },
        kind: {
            $ref: SchemaIds.AppKind,
            description: 'The type of the app repo.',
        },
        tags: {
            type: 'array',
            items: { $ref: SchemaIds.AppTag },
            description: 'An array of tags describing the application.',
        },
    },
    additionalProperties: false,
    required: ['name', 'kind', 'tags'],
} as const satisfies JSONSchema;

export const orgIndexSchema = {
    $id: SchemaIds.OrgIndex,
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
            items: { $ref: SchemaIds.AppMetadata },
            description: 'A list of applications contributed by the organization.',
        },
    },
    required: ['name', 'description', 'apps'],
    additionalProperties: false,
} as const satisfies JSONSchema;

export const validOrgKinds = ['User', 'Organization'] as const;

export const orgSchema = {
    $id: SchemaIds.Organization,
    type: 'object',
    properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        description: { type: 'string' },
        type: { type: 'string', enum: validOrgKinds },
        isPartner: { type: 'boolean' },
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
    required: ['id', 'name', 'description', 'type', 'isPartner', 'urls'],
    additionalProperties: false,
} as const satisfies JSONSchema;

export const appSchema = {
    $id: SchemaIds.Application,
    type: 'object',
    properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        description: { type: 'string' },
        license: { type: 'string' },
        repo: { type: 'string' },
        isTemplate: { type: 'boolean' },
        owner: { type: 'string', description: 'The ID of the owner organization.' },
        manifest: { type: 'string' },
        kind: { $ref: SchemaIds.AppKind },
        tags: { type: 'array', items: { $ref: SchemaIds.AppTag } },
        releases: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    tag: { type: 'string' },
                    name: { type: 'string' },
                    date: { type: 'string', format: 'date' },
                },
                required: ['tag', 'name', 'date'],
                additionalProperties: false,
            },
            minItems: 1,
        },
        watchers: { type: 'integer' },
        forks: { type: 'integer' },
        defaultBranch: { type: 'string' },
        lastUpdate: { type: 'string', format: 'date-time' },
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
        'forks',
        'defaultBranch',
        'lastUpdate',
        'repo',
    ],
    additionalProperties: false,
} as const satisfies JSONSchema;

export const appIndexSchema = {
    $id: SchemaIds.AppIndex,
    type: 'object',
    properties: {
        orgs: {
            type: 'object',
            additionalProperties: {
                $ref: SchemaIds.Organization,
            },
        },
        apps: {
            type: 'array',
            items: { $ref: SchemaIds.Application },
        },
    },
    required: ['orgs', 'apps'],
    additionalProperties: false,
} as const satisfies JSONSchema;
