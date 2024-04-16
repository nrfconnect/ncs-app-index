# Contribution guidelines

If you or your organization has a project that you'd like to include in the nRF Connect SDK Add-on index, you can do so by opening a pull request against this repository.

The pull request must include a JSON file named after your GitHub account in the `index` directory (for example, `index/nrfconnect.json`).

Make sure that your pull request only adds a new JSON file to the `index` directory, or amends your existing file.
Pull requests that make other changes to the repository will be rejected.

## Validation

If you use Visual Studio Code, the editor will automatically provide validation and autocompletion for the index file. If you are using another editor, you can use the JSON schema located at `resources/schema.json` to validate your file. Make sure that your file correctly follows the schema before creating your pull request, otherwise the CI pipeline will fail.

## Publishing

Once your pull request is approved and merged, the add-on index will be rebuilt and published automatically.
