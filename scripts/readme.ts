/* Copyright (c) 2025 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

/**
 * This script creates a markdown table based on the index schema the contributors need to follow.
 * It outputs the table to the console.
 */

import { appMetadataSchema as appSchema } from "../site/src/schema";
import { JSONSchema } from "json-schema-to-ts";

function generatePropertiesDescription(schema: JSONSchema, requiredOnly: boolean = false): Array<{name: string, description: string}> {
    const required = Object.entries(schema).find((k) => k[0] === 'required')?.[1];
    if (!required && requiredOnly) {
        return []
    }

    const props = Object.entries(schema).find((k) => k[0] === 'properties')?.[1];
    const desc: Array<{name: string, description: string}> = [];

    Object.keys(props).forEach((prop) => {
        const isRequired = required.includes(prop);

        if ((requiredOnly && isRequired) || (!requiredOnly && !isRequired)) {
            desc.push({ name: prop, description: props[prop]?.description.replaceAll('\n', '') });
        }
    });

    return desc;
}

function generateMarkdown(schema: JSONSchema): string {
    const mandatory = generatePropertiesDescription(schema, true);
    const optional = generatePropertiesDescription(schema);
    const header = ['| Property | Requirement | Description |',
                    '| -------- | ------------ | ----------- |'
    ].join('\n');

    const content =
        [...mandatory.map((property) => {return `| ${property.name} | Required | ${property.description}|`}),
         ...optional.map((property) => {return `| ${property.name} | Optional | ${property.description}|`})];

    return [header, ...content].join('\n');
}

console.log(generateMarkdown(appSchema));
