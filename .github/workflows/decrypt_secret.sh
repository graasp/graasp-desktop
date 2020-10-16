#!/bin/sh

# --batch to prevent interactive command
# --yes to assume "yes" for questions

gpg --quiet --batch --yes --decrypt --passphrase="$PROVISION_PROFILE_PASSPHRASE" \
--output ./assets/embedded.provisionprofile ./assets/embedded.provisionprofile.gpg