# nRF Connect SDK App Index

An index of applications built for the nRF Connect SDK.

## App Index

The app index is a JSON file containing organizations and their applications, generated from the contents of the `index` folder. Each JSON file in the folder should be named after the organization's GitHub username (e.g. `nrfconnect.json`), and contain metadata about the organization and it's applications according to the schema in `resources/org_index_schema.json`.

To build the index file, run `npm run generate-index-json` from the root directory.

## Website

This repository includes a static website that displays the contributed applications in a searchable frontend. It's developed using the [Next.js](https://nextjs.org/) React framework, and uses [Tailwind](https://tailwindcss.com/) for styling.

### Development

To launch a live server development server, run `npm run dev` inside the `site` directory. By default, the site runs on port 4000, but this can be overridden by setting the `PORT` environment variable.

Application data is read at build time. For development purposes, sample data can be imported from `sampleData.ts`.

### Building

To build the website, run the following commands:

1. In the root directory, run `npm install`
2. In the `site` directory, run `npm run build`

This will create an optimised static build in the `/site/out` directory.

## Schemas

JSON schemas are provided to enforce the shape of the data in the index. They are located in the `resources` directory. To edit the schemas, make any changes in `site/src/schema.ts` and run `npm run generate-schemas` from the root directory.
