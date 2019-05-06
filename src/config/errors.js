// this file needs to use module.exports as it is used both by react and electron
// make sure this file is identical in both src/config and public/app/config

const ERROR_ZIP_CORRUPTED = 'ERROR_ZIP_CORRUPTED';
const ERROR_JSON_CORRUPTED = 'ERROR_JSON_CORRUPTED';
const ERROR_SPACE_ALREADY_AVAILABLE = 'ERROR_SPACE_ALREADY_AVAILABLE';
const ERROR_DOWNLOADING_FILE = 'ERROR_DOWNLOADING_FILE';
const ERROR_GENERAL = 'ERROR_GENERAL';

const WHITELISTED_ERRORS = ['ResizeObserver loop limit exceeded'];

module.exports = {
  ERROR_ZIP_CORRUPTED,
  ERROR_JSON_CORRUPTED,
  ERROR_SPACE_ALREADY_AVAILABLE,
  ERROR_DOWNLOADING_FILE,
  ERROR_GENERAL,
  WHITELISTED_ERRORS,
};
