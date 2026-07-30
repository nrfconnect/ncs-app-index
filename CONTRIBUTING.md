# Contribution guidelines

If you or your organization has a project that you would like to include in the nRF Connect SDK Add-on index, you can do so by opening a pull request against this repository.

The pull request must include a JSON file for your organization in the `index` directory. The common practice is to name that file after the contributor's organization.

Make sure that your pull request only adds a new JSON file to the `index` directory, or amends your existing file.
Pull requests that make other changes to the repository will be rejected.

## Required information

When submitting your index file make sure it follows the schema in [`site/src/schema.ts`](./site/src/schema.ts) (`orgIndexSchema` for contributor index files, `validTags` for allowed tag values).

It is also recommended to fill the `contact` field with support information for your organization. This will be displayed when users click the **Support** button in the Add-on's tile.

It is also possible to display a workflow status badge of an add-on. It works in a similar manner as a badges displayed on the README pages on Github. Use the `testStatus` field to provide
the badge's URL for your add-on. Learn more about generating the [badges urls](https://docs.github.com/en/actions/monitoring-and-troubleshooting-workflows/monitoring-workflows/adding-a-workflow-status-badge#using-the-workflow-file-name).

## Validation

The schema lives in [`site/src/schema.ts`](./site/src/schema.ts). Before opening a pull request, validate your index file — otherwise CI will fail.

### Visual Studio Code

If you open this repository as a workspace in VS Code, the editor can validate and autocomplete `index/*.json` using a local JSON schema at `resources/schema.json`. That file is gitignored and must be generated first:

- Run **`npm install`** (runs `generate-schemas` via `postinstall`), or
- Run **`npm run generate-schemas`** if dependencies are already installed or after editing `site/src/schema.ts`.

Without one of those commands, VS Code will not have a schema to validate against.

### Command-line validation

Run this from the repository root before creating your pull request:

```
npm run validate-index
```

This checks all `index/*.json` files against [`site/src/schema.ts`](./site/src/schema.ts) — the same validation CI runs.

## Publishing

Once your pull request is approved and merged, the add-on index will be rebuilt and published automatically.
