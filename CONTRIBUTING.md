# Contribution guidelines

If you or your organization has a project that you'd like to include in the nRF Connect SDK App Index, you can do so by opening a pull request against this repository.

The pull request must include a JSON file named after your GitHub account in the `index` directory (for example, `index/nrfconnect.json`).

Make sure that your pull request only adds a new JSON file to the `index` directory, or amends your existing file.
Pull requests that make other changes to the repository will be rejected.

## JSON file requirements

The JSON file must include the following information:

* Information about your account or organization (`name` and `description`).
* Inside the `apps` array, an entry for each app you want to be shown in the index:

  * `name` must must match the application's GitHub repository in your account.
  * `title` is the human-readable name of the repository.
  * `description` is the short description of the application.
  * `manifest` is the alternative name of the west manifest. Defaults to `west.yml`.
  * `kind` is the type of the application
  * `tags` are the tags that will be used to categorize the application.
  * `license` is the license type name.
  * `apps` is the global pattern to find directories containing applications.

Most of the information provided in these entries will be displayed on the application index page.
For more information about each entry, see `appMetadataSchema` in the `resources/schema.json` file.

## Validation

If you use Visual Studio Code, the editor will automatically provide validation and autocompletion for the index file. If you are using another editor, you can use the JSON schema located at `resources/schema.json` to validate your file. Make sure that your file correctly follows the schema before creating your pull request, otherwise the CI pipeline will fail.

## Publishing

Once your pull request is approved and merged, the app index will be rebuilt and republished automatically.
