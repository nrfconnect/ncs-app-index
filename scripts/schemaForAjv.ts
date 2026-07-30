/* Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

import type { JSONSchema } from 'json-schema-to-ts';

import { appIndexSchema, orgIndexSchema } from '../site/src/schema';

const draft07Meta = {
    $schema: 'http://json-schema.org/draft-07/schema#',
} as const;

export const orgIndexSchemaForAjv = {
    ...draft07Meta,
    ...orgIndexSchema,
} as const satisfies JSONSchema;

export const appIndexSchemaForAjv = {
    ...draft07Meta,
    ...appIndexSchema,
} as const satisfies JSONSchema;
