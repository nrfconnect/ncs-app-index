# Contribution guidelines

If you or your organization has a project that you would like to include in the nRF Connect SDK Add-on index, you can do so by opening a pull request against this repository.

The pull request must include a JSON file for your organization in the `index` directory. The common practice is to name that file after the contributor's organization.

Make sure that your pull request only adds a new JSON file to the `index` directory, or amends your existing file.
Pull requests that make other changes to the repository will be rejected.

## Required information

When submitting your index file make sure it follows the current [`JSON schema`](./resources/schema.json).

It is also recommended to fill the `contact` field with support information for your organization. This will be displayed when users click the **Support** button in the Add-on's tile.

## Validation

If you use Visual Studio Code, the editor will automatically provide validation and autocompletion for the index file. If you are using another editor, you can use the JSON schema located at `resources/schema.json` to validate your file. Make sure that your file correctly follows the schema before creating your pull request, otherwise the CI pipeline will fail. Use the `validate-index` script  to make sure that the schema validates successfully:

```
npm run validate-index
```

## Publishing

Once your pull request is approved and merged, the add-on index will be rebuilt and published automatically.
