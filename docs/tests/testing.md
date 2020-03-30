# Test Documentation

## Technologies

End-to-end tests are integrated to Graasp Desktop using :

- [**Spectron**](https://github.com/electron-userland/spectron) launches Graasp Desktop and run tests inside it.
  - Spectron is built on [Webdriver.io](https://webdriver.io/docs/api.html) but doesn't seem to provide same api. We can however use calls such as `element()`, `click()`, `getText()` or `getHTML()`
- [**Mocha**](https://mochajs.org/) is the test framework which can run on Node.js and in the browser.
  - In order for Mocha to interpret ES6, tests are compiled with **Babel 7** before execution.
- [**Chai**](https://www.chaijs.com/) is a BDD / TDD assertion library, mainly used to test visual features of the application.

## File Structure

```
+-- assets
+-- ...
+-- src
+-- test
|   +-- fixtures
|   |   +-- spaces
|   |
|   +-- spaces
|   |   |-- deleteSpace.test.js
|   |   |-- exportSpace.test.js
|   |   |-- ...
|   |
|   +-- tmp
|   |
|   |-- constants.js
|   |-- application.js
|   |
|   |-- menu.test.js

```

- **`tests/fixtures`**: contains any data for tests. A subfolder `spaces` contains space-related data and files.
- **`tests/tmp`:** contains user downloaded resources (mainly exported spaces .zip files)
- **`tests/application.js`:** contains utility function to set up, start and stop an Electron application using Spectron.
- **`tests/constants.js`:** contains constants, such as filepaths or time pause.
- Tests should be categorize as much as possible to keep the folder clean (eg. spaces, settings, etc..)

## Data used for Tests

Tests are essentially based on spaces. These functionalities require to access spaces from different sources:

- _Visit a Space_: the space needs to exist on the online platform to be retrieved
- _Load a Space_: this requires a .zip file containing the JSON definition of the space
- _Explore and Check a Space's content_: The space needs to be correctly defined, and tests use a pre-saved JSON as data truth to check a space has correctly loaded and displays its items properly.

When you test an online space against test data, make sure local data are correct and mirror any change of the online space.

Any space data (JSON data, .zip file, etc) are saved in `test/fixtures/spaces`.

## Write tests

**Data existance:** Since the application launched by spectron doesn't save any data, each time an application is started, it is based on a fresh and default database.

**The Application is running:** Before interacting with elements, the application should be started. This application can take parameters in order to mock some functionalities in the application. (ie `electron.dialog`).

**The Application should be shut down:** After a test or a serie of tests, the application should be stop before opening a new one.

**The element can be easily selected:** To select an element, avoid using tags only. Instead, add classes or id to the element, by adding it in the `src/config/selectors.js` file. If you need to rely on built-in id (such as space or item id) use data attribute such as `data-id`.

**Mocha waits for done():** For a test to be successful, the test needs to call the function `done()` once it went through every task. This is handled if you write your test inside `mochaAsync()` of `test/utils.js`.

### Timeout

Each file has a global timeout, to avoid tests to run indefinitely.

We can also set a timeout for each specific test.

Spectron can interact with elements only if these exist and are visible. Since the app may take time to load some functionalities, don't hesitate to pause the test process (with `client.pause()`) to wait for some elements to load and be visible. Some common cases:

- Toastr can hide elements, so we need to wait them to fade out before clicking on elements
- Downloading a space might take time, so it is necessary to wait some time before interacting with the space's items.
