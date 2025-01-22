# nRF Connect SDK Add-on index

This repository includes a collection of index pages for publicly available nRF Connect SDK Add-ons, which are supplementary components that extend the [nRF Connect SDK](https://docs.nordicsemi.com/bundle/ncs-latest/page/nrf/index.html). You can access the index from the [nRF Connect for VS Code extension](https://docs.nordicsemi.com/bundle/nrf-connect-vscode/page/index.html), and browse it on [its webpage](https://nrfconnect.github.io/ncs-app-index/).
----

## Contributing

If you or your organization has a project that you'd like to include in this repository, open a pull request against it. Read the [`CONTRIBUTING`](./CONTRIBUTING.md) file for more information.

----

## Development

To create an add-on index page of your own, you need to generate a new, custom `index.json` file and [contribute it](./CONTRIBUTING.md) to this repository (using a different name). Use the information in the following sections to make sure that the JSON file is set up correctly.

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
   The `index.json` file is created in the `resources` directory.

1. Copy `index.json` to `./site/public/`.

### Creating a custom index.json

To create an `index.json` of your own, you can either [generate a template](#generating-indexjson) or create a custom file from scratch.
Your custom JSON file must include the following information:

| Property | Requirement | Description |
| -------- | ------------ | ----------- |
| name | Required | The name of the application repo. Should be the repo-name in the GitHub URL: https://github.com/org/repo-name.|
| kind | Required | The type of the app repo.|
| tags | Required | An array of tags describing the application.|
| releases | Required | The collection of project`s releases.|
| title | Optional | Human readable name of the repo to be shown in the UI. Defaults to the name property.|
| description | Optional | Text describing the application. Inferred from the repo if missing.|
| manifest | Optional | Alternative filename for the west manifest. Defaults to west.yml.|
| license | Optional | The name of the application license, e.g. "Apache 2.0". Inferred from the repo if missing.|
| apps | Optional | Glob pattern to find directories containing applications.Applications need a *.conf file and a CMakeLists.txt file at their root. The glob expressions are used to match directories, so no file pattern is necessary.By default, the VS Code extension will assume that there's just a single application sitting at the root of the repo.|
| defaultBranch | Optional | The default git branch that the repository is checked out. Inferred from the repo if missing.|
| docsUrl | Optional | The URL of the add-on's documentation|
| restricted | Optional | Mark the restricted access to any of the dependencies.|

Most of the information provided in these entries will be displayed on the add-on index page.
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

This repository includes a static website that displays the contributed add-ons in a searchable frontend. It's developed using the [Next.js](https://nextjs.org/) React framework, and uses [Tailwind](https://tailwindcss.com/) for styling.

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

* Add-on data is read at build time. For development purposes, sample data can be imported from `sampleData.ts`.

### Verifying index in the extension

To verify that your add-on index is correctly picked up by the [nRF Connect for Visual Studio Code extension], set the extension to fetch the add-on index from the custom URL:

1. In Visual Studio Code, open the `settings.json` workspace settings file.

1. Add the following line to the file:
   ```
   "nrf-connect.appIndexUri": "http://localhost:3000/",
   ```

1. Save your changes.

1. In the extension's **Welcome View**, select [**Create a new application** > **Browse application index**](https://nrfconnect.github.io/vscode-nrf-connect/reference/ui_sidebar_welcome.html#create-a-new-application).

Your custom `nrf-connect.appIndexUri` will be used to list the add-ons in the index.

## Query parameters

The add-on index exposes several query parameters for filtering its contents.

| Parameter |  Type  |                                    Description                                    |      Example       |
| --------- | ------ | --------------------------------------------------------------------------------- | ------------------ |
| app       | string | Show add-ons that include the **app** in their name, title, description, or tags. | `?app=air+quality` |
| ncs       | string | Show add-ons that are compatible with a given nRF Connect SDK version.            | `?ncs=v2.5.0`      |
