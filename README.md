<p align="center">
  <a href="https://graasp.eu">
    <img alt="Graasp" src="https://avatars3.githubusercontent.com/u/43075056" width="300" />
  </a>
</p>

<h1 align="center">Graasp Desktop</h1>

<p align="center">
  Cross-platform desktop client for the Graasp ecosystem.
</p>

<p align="center">
  <a href="https://app.codeship.com/projects/315997">
    <img
      alt="CodeShip"
      src="https://app.codeship.com/projects/e0ef44e0-cff2-0136-9889-2aa8b2e23b88/status?branch=master"
    />
  </a>
  <a href="https://www.codacy.com/app/graasp/graasp-desktop">
    <img
      alt="Codacy Badge"
      src="https://api.codacy.com/project/badge/Grade/b46362710a304906bb6ce858408e59a2"
    />
  </a>
  <a href="https://conventionalcommits.org">
    <img
      alt="Conventional Commits"
      src="https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg"
    />
  </a>
  <a href="https://github.com/prettier/prettier">
    <img
      alt="Prettier"
      src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg"
    />
  </a>
  <a href="https://github.com/graasp/graasp-desktop/blob/master/LICENSE">
    <img
      alt="License"
      src="https://img.shields.io/badge/license-AGPLv3.0-blue.svg"
    />
  </a>
</p>

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

## Logs

Following the `electron-log` defaults, logs are written to the following locations:

- Linux: `~/.config/{app name}/logs/{process type}.log`
- macOS: `~/Library/Logs/{app name}/{process type}.log`
- Windows: `%USERPROFILE%\AppData\Roaming\{app name}\logs\{process type}.log`

## Deploy and Publish

### Requirements

- You should try to update all dependencies, particularly any dependencies related to `electron` and `electron-builder` as this dependency will create the executable files for every OS.
- Make sure your `.env` and `.env.test` files contain the correct values. Use your own github token `GH_TOKEN` in order to release the new version with your github account. If you are using the Github Actions, make sure the sensitive data are reported to Github's `Secrets` and are input in the corresponding workflow.
- **Sign Apple executable files**: In order to sign the application and publish it on the mac store, you will need a corresponding **Developer ID** certificate installed on your apple computer. You need to be part of the apple developer team on the [Apple Developers Website](https://developer.apple.com/) as well as use the certificate containing the private key. [Here](https://help.apple.com/xcode/mac/current/#/dev154b28f09) you can find some indications to help you install this certificate. Once added to _Xcode_ (the should also be available in _My Certificates_ in Keychain), this certificate will be automatically be used during the creation of the executable files. You will also need the `assets/embedded.provisionprofile` file.
  This command will tell you if your app was correctly signed: `codesign --display --verbose=2 dist/mac/Graasp.app`

**Note**: MacOS can compile the desktop application for every other platforms. Windows OS can only compile Windows executable files.

### Github Actions Release

The whole process is handled in Github Actions, which is triggered for each push in a tag release. The next section will go through the steps for setting up this workflow, while the following sections will describe how to deploy and publish manually.

The workflow publishing the release on github is located at `.github/workflows/release.yml`. This workflow uses an [electron-builder action](https://github.com/samuelmeuli/action-electron-builder) which generates a release draft. Each platform (Windows, MacOS and Linux) generates its own executable to be added to the corresponding release.

The workflow takes as environment variable:

- the Application Developer ID certificate (to sign mac executables)
- the certificate password
- the provision profile passphrase
- other necessary environment variables such endpoints, google api key, etc...

#### Environment Variables

Github Actions uses environment variables as `secrets`. These are set in `Settings → Secrets`, and then reported in the workflow under `env` with the following syntax:

```
- name: your step's name
        run: commands
        env:
          YOUR_ENV_VARIABLE_NAME: ${{secrets.YOUR_SECRET_NAME}}
```

#### Mac Signing

1. Export the necessary certificates as one file (eg `certs.p12`). This will ask for a password.
2. Run `base64 -i certs.p12 -o encoded.txt`
3. In your project's GitHub repository, go to `Settings → Secrets` and add the following two variables:

- `MAC_CERTS`: Your encoded certificates, i.e. the content of the encoded.txt file you created before
- `MAC_CERTS_PASSWORD`: The password you set when exporting the certificates

4. The `embedded.provisionprofile` needs to be encrypted with gpg. Run `gpg -c embedded.provisionprofile`. Enter a password to validate the encryption.
5. A new `embedded.provisionprofile.gpg` should have been created. This file should be pushed in the repo in `assets`.
6. The password used to encrypt the file should be added to `secrets` as `PROVISION_PROFILE_PASSPHRASE`

### Manual Release Steps

1. Run `yarn dist`. This command will first build the repository and compile it into multiple executable files. All the configuration is set in `package.json`.

2. Run `yarn release`. This command will prepare the new release tag and push it on github.

3. Sign in on Github and go to the **Tags** page. Here your release will be waiting for your approval. The release should contain every compiled files for Windows, Mac and Linux platforms (these might be only visible when the user is signed in). As `CHANGELOG.md` was automatically filled in with the release's changes, copy and paste the corresponding changes in the release's description. You can approve the release.
