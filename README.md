# nRF Connect SDK Add-on index

This repository includes a collection of index pages for publicly available nRF Connect SDK Add-ons, which are supplementary components that extend the [nRF Connect SDK](https://docs.nordicsemi.com/bundle/ncs-latest/page/nrf/index.html). You can access the index from the [nRF Connect for VS Code extension](https://docs.nordicsemi.com/bundle/nrf-connect-vscode/page/index.html), and browse it on [its webpage](https://nrfconnect.github.io/ncs-app-index/).

The Add-on index includes files contributed by different organizations.

----

## Contributing an Add-on

If your organization has a project that you would like to include in this repository, read the [`CONTRIBUTING`](./CONTRIBUTING.md) and [`CONTRIBUTION CHECKLIST`](./docs/ContributionChecklist.md) for more information.


----

## Development of an Add-on index

This and following sections describe how to build and run the nRF Connect SDK Add-on index in the local environment. If you wish to just publish an nRF Connect SDK Add-on, please refer to [`Contributing an Add-on`](#contributing-an-add-on).

To create an Add-on index page of your own, you need to start with cloning this repository and generating a new index JSON file. Use the information in the following sections to make sure that the JSON file is set up correctly.

### Generating index.json file

To generate an `index.json` file, complete the following steps:

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

The `index.json` is compiled from the files in the `ncs-app-index/index` directory. To add your Add-on to the index you can either [create](#adding-your-organization-to-the-index) or modify existing file of your organization in `ncs-app-index/index` directory.

### Adding your organization to the index

To add your organization to the index, create an JSON of your own. The common practice is to name that file after the contributor's organization. The file is required to be located in `ncs-app-index/index` directory and follow the [`JSON schema`](./resources/schema.json).

JSON schemas are provided to enforce the shape of the data in the index. They are located in the `resources` directory. To edit the schemas, make any changes in `site/src/schema.ts` and run `npm run generate-schemas` from the root directory.

The following represents an example of the organization's index file:

```
{
    "name": "Application maker",
    "description": "A company that makes applications.",
    "apps": [
        {
            "title": "Application #1",
            "name": "application_1",
            "description": "The first application",
            "kind": "sample",
            "tags": ["ble", "dfu"],
            "avatar": "https://link-to-avatar
            "releases": [
                {
                    "date": "2024-08-11T14:37:00Z",
                    "name": "v2.0.1",
                    "tag": "v2.0.1",
                    "sdk": "v2.8.0"
                }
            ],
            "docsUrl": "https://link-to-docs"
        }
    ]
}

```

For more information about each entry, see `resources/schema.json` file.


### Serving a local server

Once you have your `index.json` file, you can set up a local server to test it:

1. Copy `index.json` to `./site/public/`.

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

1. Check if the JSON file is available by going to [localhost:3000/ncs-app-index/index.json](http://localhost:3000/ncs-app-index/index.json), where `index.json` is the name of your JSON file.

#### Website customization

You can customize the local website in the following ways:

* By default, the site runs on port 3000, but this can be overridden by setting the `PORT` environment variable.

* Add-on data is read at build time. For development purposes, sample data can be imported from `sampleData.ts`.

### Verifying index in the extension

To verify that your add-on index is correctly picked up by the [nRF Connect for Visual Studio Code extension], set the extension to fetch the add-on index from the custom URL:

1. In Visual Studio Code, open the `settings.json` workspace settings file.

1. Add the following line to the file:
   ```
   "nrf-connect.appIndexUri": "http://localhost:3000/ncs-app-index",
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
