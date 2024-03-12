# nRF Connect SDK App Index

An index of applications built for the nRF Connect SDK.

----

## Contributing

If you or your organization has a project that you'd like to include in the nRF Connect SDK App Index, you can open a pull request against this repository. Read the [`CONTRIBUTING`](./CONTRIBUTING.md) file for more information.

----

## Development

To develop an application index of your own, you need to generate a new, custom `index.json` file and [contribute](./CONTRIBUTING.md) it to this repository (using a different name). Use the information in the following sections to make sure that the file is set up correctly.

### Generating index.json

To generate an `index.json` template file:

1. Open a command terminal in the `ncs-app-index` root directory.

1. Install the required dependencies:
   ```
   npm install
   ```

1. Generate `index.json`:
   ```
   npm run generate-index-json
   ```
   The `index.json` is created in the `resources` directory.

1. Copy `index.json` to `./site/public/`.

### Creating a custom index.json

To create an `index.json` of your own, you can either [generate a template](#generating-indexjson) or create a custom file from scratch.
Your custom JSON file must include the following information:

* Information about your account or organization (`name` and `description`).
* Inside the `apps` array, an entry for each app you want to be shown in the index:

  * `name` must match the application's GitHub repository in your account.
  * `title` is the human-readable name of the repository.
  * `description` is the short description of the application.
  * `manifest` is the alternative name of the west manifest. Defaults to `west.yml`.
  * `kind` is the type of application
  * `tags` are the tags that will be used to categorize the application.
  * `license` is the license type name.
  * `apps` is the global pattern to find directories containing applications.

Most of the information provided in these entries will be displayed on the application index page.
For more information about each entry, see `appMetadataSchema` in the `resources/schema.json` file.

#### Schemas

JSON schemas are provided to enforce the shape of the data in the index. They are located in the `resources` directory. To edit the schemas, make any changes in `site/src/schema.ts` and run `npm run generate-schemas` from the root directory.

### Serving a local server

Once you have your `index.json` file, you can set up a local server to test it:

1. Go to the `site` directory.

1. Install the required dependencies:
   ```
   npm install
   ```

1. Build the website locally:
   ```
   npm run build
   ```
   This will create a static build in the `/site/out` directory.

### Verifying website locally

This repository includes a static website that displays the contributed applications in a searchable frontend. It's developed using the [Next.js](https://nextjs.org/) React framework, and uses [Tailwind](https://tailwindcss.com/) for styling.

To verify your application index website locally:

1. Start the website locally:
   ```
   npm run dev
   ```

1. Access the site in the browser by going to [localhost:3000/ncs-app-index](http://localhost:3000/ncs-app-index).

1. Check if the `index.json` is available by going to [localhost:3000/ncs-app-index/index.json](http://localhost:3000/ncs-app-index/index.json).

#### Website customization

You can customize the local website in the following ways:

* By default, the site runs on port 3000, but this can be overridden by setting the `PORT` environment variable.

* Application data is read at build time. For development purposes, sample data can be imported from `sampleData.ts`.

### Verifying index in the extension

To verify that your application index is correctly picked up by the [nRF Connect for Visual Studio Code extension], set the extension to fetch the application index from the custom URL:

1. In Visual Studio Code, open the `settings.json` workspace settings file.

1. Add the following line to the file:
   ```
   "nrf-connect.appIndexUri": "http://localhost:3000/",
   ```

1. Save your changes.

1. In the extension's **Welcome View**, select [**Create a new application** > **Browse application index**](https://nrfconnect.github.io/vscode-nrf-connect/reference/ui_sidebar_welcome.html#create-a-new-application).

Your custom `nrf-connect.appIndexUri` will be used to list the applications in the index.
