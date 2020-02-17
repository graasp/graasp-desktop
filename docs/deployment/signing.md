# Signing

## Certificates

In order to build and deploy the macOS version of the application (`dist:mac`), you will
need to have the appropriate Apple Developer certificates available on your Keychain Access.
These usually include the following:

- 3rd Party Mac Developer Application
- 3rd Party Mac Developer Installer
- Developer ID Application

For developers of the official release, these will be made available to you, if necessary.

## Provision Profile

You will also need to include your [provision profile](http://bit.ly/38yt7mg)
in order to code sign the app. Include this under `/assets` as `embedded.provisionprofile`.
This file should be ignored, so make sure to use the same name or edit the `.gitignore`
file accordingly.

## Permissions

### macOS

The first time you build the app on macOS, the signing process will ask you for permissions
to access the keychain. You can go ahead and allow access (twice).
