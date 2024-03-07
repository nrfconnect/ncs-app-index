# nRF Connect SDK App Index

An index of applications built for the nRF Connect SDK.

----

## Contributing

If you or your organization has a project that you'd like to include in the nRF Connect SDK App Index, you can open a pull request against this repository. Read the [`CONTRIBUTING`](./CONTRIBUTING.md) file for more information.

----

## Development

To generate a new `index.json` file and use it on a custom version of the App Indes page, complete the following steps:

1. Generate the `index.json` file:

   a. Open a command terminal in the `ncs-app-index` root directory.

   b. Install the required dependencies:
      ```
      npm install
      ```

   c. Generate `index.json`:
      ```
      npm run generate-index-json
      ```
      The `index.json` is created in the `resources` directory.

   d. Copy `index.json` to `./site/public/`.

1. Serve the website locally:

   a. Go to the `site` directory.

   b. Install the required dependencies:
      ```
      npm install
      ```

   c. Build the website locally:
      ```
      npm run build
      ```
      This will create a static build in the `/site/out` directory.

   d. Start the website locally:
      ```
      npm run dev
      ```

1. Check if the site works:

   a. Access the site in the browser by going to `localhost:4000/ncs-app-index`.

   b. Check if the `index.json` is available by going to `localhost:4000/ncs-app-index/index.json`.

1. Set the [nRF Connect for Visual Studio Code extension](https://nrfconnect.github.io/vscode-nrf-connect/reference/ui_sidebar_welcome.html#create-a-new-application) to fetch the application index from the custom URL:

   a. In Visual Studio Code, open the `settings.json` workspace settings file.

   b. Add the following line to the file:
      ```
      "nrf-connect.appIndexUri": "http://localhost:4000/",
      ```

### Website customization

This repository includes a static website that displays the contributed applications in a searchable frontend. It's developed using the [Next.js](https://nextjs.org/) React framework, and uses [Tailwind](https://tailwindcss.com/) for styling.

To launch a live development server, run `npm run dev` inside the `site` directory. By default, the site runs on port 3000, but this can be overridden by setting the `PORT` environment variable.

Application data is read at build time. For development purposes, sample data can be imported from `sampleData.ts`.

### Schemas

JSON schemas are provided to enforce the shape of the data in the index. They are located in the `resources` directory. To edit the schemas, make any changes in `site/src/schema.ts` and run `npm run generate-schemas` from the root directory.
