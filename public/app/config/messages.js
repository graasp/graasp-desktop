// this file needs to use module.exports as it is used both by react and
// electron make sure this file is identical in both src/config/messages.js
// and public/app/config/messages.js

const ERROR_DOWNLOADING_MESSAGE = 'There was a problem downloading your files';
const ERROR_LOADING_MESSAGE = 'There was a problem loading your space';
const ERROR_EXPORTING_MESSAGE = 'There was a problem exporting this space';
const SUCCESS_EXPORTING_MESSAGE = 'Space was exported successfully';
const ERROR_DELETING_MESSAGE = 'There was a problem deleting this space';
const SUCCESS_DELETING_MESSAGE = 'Space was deleted successfully';
const ERROR_ZIP_CORRUPTED_MESSAGE =
  'The archive provided is not formatted properly';
const ERROR_JSON_CORRUPTED_MESSAGE = "Space's JSON file is corrupted";
const ERROR_SPACE_ALREADY_AVAILABLE_MESSAGE =
  'A space with the same id is already available';
const SUCCESS_SPACE_LOADED_MESSAGE = 'Space was loaded successfully';
const UNEXPECTED_ERROR_MESSAGE = 'An unexpected error has occurred';
const ERROR_GETTING_SPACE_MESSAGE = 'There was an error getting that space.';
const OFFLINE_ERROR_MESSAGE = 'This functionality requires online connectivity';
const ERROR_MESSAGE_HEADER = 'Error';
const ERROR_SAVING_SPACE_MESSAGE = 'There was an error saving the space';
const SUCCESS_SAVING_MESSAGE = 'Space was saved successfully';
const SUCCESS_MESSAGE_HEADER = 'Success';
const ERROR_GETTING_GEOLOCATION =
  'There was an error getting your current location';
const ERROR_GETTING_SPACES_NEARBY =
  'There was an error getting the spaces nearby';
const ERROR_GETTING_USER_FOLDER =
  'There was an error getting your user folder.';
const ERROR_GETTING_LANGUAGE = 'There was an error getting the language.';
const ERROR_SETTING_LANGUAGE = 'There was an error setting the language.';
const INVALID_SPACE_ID = 'Invalid space ID.';
const ERROR_GETTING_DEVELOPER_MODE =
  'There was an error getting the developer mode';
const ERROR_SETTING_DEVELOPER_MODE =
  'There was an error setting the developer mode';
const ERROR_GETTING_DATABASE = 'There was an error getting the database.';
const ERROR_SETTING_DATABASE = 'There was an error updating the database.';
const SUCCESS_SYNCING_MESSAGE = 'Space was successfully synced';
const ERROR_SYNCING_MESSAGE = 'There was an error syncing the space.';

module.exports = {
  ERROR_GETTING_DEVELOPER_MODE,
  ERROR_SETTING_DEVELOPER_MODE,
  ERROR_GETTING_LANGUAGE,
  ERROR_SETTING_LANGUAGE,
  ERROR_DOWNLOADING_MESSAGE,
  ERROR_MESSAGE_HEADER,
  ERROR_SAVING_SPACE_MESSAGE,
  SUCCESS_SAVING_MESSAGE,
  SUCCESS_MESSAGE_HEADER,
  ERROR_GETTING_SPACE_MESSAGE,
  ERROR_EXPORTING_MESSAGE,
  SUCCESS_EXPORTING_MESSAGE,
  ERROR_DELETING_MESSAGE,
  SUCCESS_DELETING_MESSAGE,
  ERROR_ZIP_CORRUPTED_MESSAGE,
  ERROR_JSON_CORRUPTED_MESSAGE,
  ERROR_SPACE_ALREADY_AVAILABLE_MESSAGE,
  SUCCESS_SPACE_LOADED_MESSAGE,
  UNEXPECTED_ERROR_MESSAGE,
  OFFLINE_ERROR_MESSAGE,
  ERROR_LOADING_MESSAGE,
  ERROR_GETTING_GEOLOCATION,
  ERROR_GETTING_SPACES_NEARBY,
  ERROR_GETTING_USER_FOLDER,
  INVALID_SPACE_ID,
  ERROR_GETTING_DATABASE,
  ERROR_SETTING_DATABASE,
  SUCCESS_SYNCING_MESSAGE,
  ERROR_SYNCING_MESSAGE,
};
