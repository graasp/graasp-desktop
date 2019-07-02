<p align="center">
  <a href="https://babeljs.io/">
    <img alt="Graasp" src="https://avatars3.githubusercontent.com/u/43075056" width="300">
  </a>
</p>

<h1 align="center">Graasp Desktop</h1>

<p align="center">
  Cross-platform desktop client for the Graasp ecosystem.
</p>

[![CodeShip](https://app.codeship.com/projects/e0ef44e0-cff2-0136-9889-2aa8b2e23b88/status?branch=master)](https://app.codeship.com/projects/315997)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/b46362710a304906bb6ce858408e59a2)](https://www.codacy.com/app/graasp/graasp-desktop)

## Official Distributions

You can get the latest official distribution from our [GitHub release channel](https://github.com/graasp/graasp-desktop/releases).

## Getting Started

To run Graasp Desktop locally you need to have [Node](https://nodejs.org) and
[NPM](https://www.npmjs.com) installed in your operating system. We strongly recommend that you
also have [Yarn](https://yarnpkg.com/). All of the commands that you will see here use `yarn`,
but they have an `npm` equivalent.

Download or clone the repository to your local machine, preferably using [Git](https://git-scm.com).

### Installation

Inside the project directory, run `yarn` to install the project dependencies.

You will also need to create a file called `.env.local` with the following contents.

```dotenv
GH_TOKEN=
REACT_APP_GRAASP_API_HOST=https://api.graasp.eu
REACT_APP_GRAASP_HOST=https://graasp.eu
REACT_APP_GOOGLE_ANALYTICS_ID=
REACT_APP_SENTRY_DSN=
SENTRY_DSN=
GOOGLE_API_KEY=
BROWSER=none
```

The `GH_TOKEN` environment variable is only used for releasing new versions of the Graasp Desktop
application. For advanced used, if you want to create your own distribution, you can add your
`GH_TOKEN` here and use `electron-builder` to manage releases on GitHub.

The `REACT_APP_GRAASP_API_HOST` variable signals which Graasp API to use, while
`REACT_APP_GRAASP_HOST` determines where to locate Graasp. The values above use the production
versions.

Use the `REACT_APP_GOOGLE_ANALYTICS_ID` environment variable to track Google Analytics and
`` to track errors using Sentry.

In order to use the location services for nearby spaces, you will need a `GOOGLE_API_KEY`, which
you can get [here](https://developers.google.com/maps/documentation/geolocation/get-api-key).

The `BROWSER=none` assignment simply tells Electron not to use a browser to load, but instead to
use the native OS windows.

When you first run or build the application, a file called `env.json` will be created under the
`public/` folder. If you update your `.env.local` and `.env` file with values for the variables
below, the contents of this file will also update the next time you run or build. This process is
handled by `scripts/setup.js`.

```json
{
  "SENTRY_DSN": "",
  "GOOGLE_API_KEY": ""
}
```

### Running Locally

To run Graasp Desktop locally, run `yarn start`. This will launch an Electron window and the
Electron process in terminal.

## Contributing

We welcome contributions!

## Installing Dependencies

Make sure you have `node` and `yarn` installed on your local machine.

Run `yarn` from the project directory root to install all dependencies.

## Committing

We follow the standards put forth by [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0-beta.2/).

```
<type>[optional scope]: <description>

[optional body]

[optional footer]
```

Example:

```
fix: minor typos in code

see the issue for details on the typos fixed

fixes #12
```
