// this file needs to use module.exports as it is used both by react and electron

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

module.exports = {
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
};
