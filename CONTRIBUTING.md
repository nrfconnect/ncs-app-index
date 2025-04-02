# Contribution guidelines

If you or your organization has a project that you would like to include in the nRF Connect SDK Add-on index, you can do so by opening a pull request against this repository.

The pull request must include a JSON file for your organization in the `index` directory.
The name of the JSON file is not required to be `index.json`. The common practice is to name it after the contributor's organization.

Make sure that your pull request only adds a new JSON file to the `index` directory, or amends your existing file.
Pull requests that make other changes to the repository will be rejected.

## Required information

When submitting your index file, the following information must be filled in:

- The `repo` field pointing to your repository URL.
- The `docsUrl` field for each application in the `apps` array, pointing to the application external documentation.

It is also recommended to fill the `contact` field with support information for your organization. This will be displayed when users click the **Support** button in the Add-ons tile.

Other fields are optional, as listed in [README.md](README.md#creating-a-custom-indexjson).

## Validation

If you use Visual Studio Code, the editor will automatically provide validation and autocompletion for the index file. If you are using another editor, you can use the JSON schema located at `resources/schema.json` to validate your file. Make sure that your file correctly follows the schema before creating your pull request, otherwise the CI pipeline will fail.

## Publishing

Once your pull request is approved and merged, the add-on index will be rebuilt and published automatically.
