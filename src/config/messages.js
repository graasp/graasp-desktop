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

// todo: remove
const ERROR_GETTING_GEOLOCATION =
  'There was an error getting your current location';
const ERROR_GETTING_SPACES_NEARBY =
  'There was an error getting the spaces nearby';

const ERROR_GETTING_USER_FOLDER =
  'There was an error getting your user folder.';
const ERROR_GETTING_LANGUAGE = 'There was an error getting the language.';
const ERROR_SETTING_LANGUAGE = 'There was an error setting the language.';
const INVALID_SPACE_ID = 'Invalid space ID.';
const INVALID_SPACE_ID_OR_URL = 'Invalid space ID or URL.';
const ERROR_GETTING_DEVELOPER_MODE =
  'There was an error getting the developer mode';
const ERROR_SETTING_DEVELOPER_MODE =
  'There was an error setting the developer mode';

// todo: remove
const ERROR_GETTING_GEOLOCATION_ENABLED =
  'There was an error getting the geolocation enabled';
const ERROR_SETTING_GEOLOCATION_ENABLED =
  'There was an error setting the geolocation enabled';

const ERROR_GETTING_DATABASE = 'There was an error getting the database.';
const ERROR_SETTING_DATABASE = 'There was an error updating the database.';
const SUCCESS_SYNCING_MESSAGE = 'Space was successfully synced';
const ERROR_SYNCING_MESSAGE = 'There was an error syncing the space.';
const ERROR_CLEARING_USER_INPUT_MESSAGE =
  'There was an error clearing the user input.';
const SUCCESS_CLEARING_USER_INPUT_MESSAGE =
  'User input was successfully cleared.';
const CONNECTION_MESSAGE_HEADER = 'Connection Status';
const CONNECTION_OFFLINE_MESSAGE = 'You are offline.';
const CONNECTION_ONLINE_MESSAGE = 'You are online.';
const ERROR_SIGNING_IN = 'There was an error signing in.';
const ERROR_SIGNING_OUT = 'There was an error signing out.';
const ERROR_GETTING_AUTHENTICATED = 'There was an error during authentication.';
const ERROR_GETTING_SYNC_MODE =
  'There was an error getting the sync mode for Space Synchronization';
const ERROR_SETTING_SYNC_MODE =
  'There was an error setting the sync mode for Space Synchronization';
const ERROR_GETTING_USER_MODE = 'There was an error getting the user mode';
const ERROR_SETTING_USER_MODE = 'There was an error setting the user mode';
const ERROR_SETTING_SPACE_AS_FAVORITE =
  'There was an error setting space as favorite';
const ERROR_SETTING_SPACE_AS_RECENT =
  'There was an error setting space as recent space';
const ERROR_STUDENT_LOAD_OUT_OF_DATE_SPACE_MESSAGE =
  'The space contained in this file is out of date. Ask your teacher for more information.';
const ERROR_STUDENT_FORBIDDEN_MESSAGE = 'Students cannot access this page';
const ERROR_ADDING_CLASSROOM_MESSAGE =
  'There was an error adding the classroom';
const ERROR_DUPLICATE_CLASSROOM_NAME_MESSAGE =
  'This classroom name already exists';
const SUCCESS_ADDING_CLASSROOM_MESSAGE =
  'The classroom was successfully created';
const SUCCESS_DELETING_CLASSROOM_MESSAGE =
  'The classroom was successfully deleted';
const ERROR_DELETING_CLASSROOM_MESSAGE =
  'There was an error deleting this classroom';
const ERROR_EDITING_CLASSROOM_MESSAGE =
  'There was an error editing this classroom';
const SUCCESS_EDITING_CLASSROOM_MESSAGE =
  'The classroom was successfully edited';
const ERROR_GETTING_CLASSROOM_MESSAGE =
  'There was an error getting the classroom';
const ERROR_ACCESS_DENIED_CLASSROOM_MESSAGE = `This user does not have access to this classroom`;
const ERROR_DUPLICATE_USERNAME_IN_CLASSROOM_MESSAGE =
  'This username already exists in this classroom';
const ERROR_ADDING_USER_IN_CLASSROOM_MESSAGE =
  'There was an error adding a new user in this classroom';
const ERROR_DELETING_USER_IN_CLASSROOM_MESSAGE =
  'There was an error deleting a user in this classroom';
const ERROR_EDITING_USER_IN_CLASSROOM_MESSAGE =
  'There was an error editing a user in this classroom';
const SUCCESS_EDITING_USER_IN_CLASSROOM_MESSAGE =
  'The user was successfully edited';
const SUCCESS_DELETING_USERS_IN_CLASSROOM_MESSAGE =
  'The user was successfully deleted';
const ERROR_NO_USER_TO_DELETE_MESSAGE = 'There is no user to delete';
const ERROR_GETTING_SPACE_IN_CLASSROOM_MESSAGE =
  'There was an error getting the space in this classroom';
const ERROR_INVALID_USERNAME_MESSAGE = 'This username is invalid';
const ERROR_SETTING_ACTION_ACCESSIBILITY =
  'There was an error setting the action accessibility';
const ERROR_SETTING_ACTIONS_AS_ENABLED = 'There was an error enabling actions';
const ERROR_POSTING_FILE_MESSAGE = 'There was an error uploading the file';
const ERROR_DELETING_FILE_MESSAGE = 'There was an error deleting the file';
const PROMPT_DELETE_SPACE_MESSAGE =
  'Are you sure you want to delete this space?';
const PROMPT_CLEAR_USER_INPUT_MESSAGE =
  'Are you sure you want to clear all of the user input in this space?';
const ERROR_CANT_LAUNCH_TOUR = `There was an error showing the tour`;
const ERROR_INSTALLING_APP_UPGRADE_MESSAGE =
  'An unexpected error occured while downloading or installing the upgrade.';
const UPDATE_AVAILABLE_MESSAGE =
  'A new version of Graasp Desktop is available. Do you want to quit the application and install it now?';
const ERROR_SETTING_FONT_SIZE = 'There was an error setting the font size';
const ERROR_GETTING_FONT_SIZE = 'There was an error getting the font size';

module.exports = {
  ERROR_GETTING_DEVELOPER_MODE,
  ERROR_SETTING_DEVELOPER_MODE,
  ERROR_GETTING_GEOLOCATION_ENABLED,
  ERROR_SETTING_GEOLOCATION_ENABLED,
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
  INVALID_SPACE_ID_OR_URL,
  ERROR_GETTING_DATABASE,
  ERROR_SETTING_DATABASE,
  SUCCESS_SYNCING_MESSAGE,
  ERROR_SYNCING_MESSAGE,
  ERROR_CLEARING_USER_INPUT_MESSAGE,
  SUCCESS_CLEARING_USER_INPUT_MESSAGE,
  CONNECTION_MESSAGE_HEADER,
  CONNECTION_OFFLINE_MESSAGE,
  CONNECTION_ONLINE_MESSAGE,
  ERROR_SIGNING_IN,
  ERROR_SIGNING_OUT,
  ERROR_GETTING_AUTHENTICATED,
  ERROR_GETTING_SYNC_MODE,
  ERROR_SETTING_SYNC_MODE,
  ERROR_GETTING_USER_MODE,
  ERROR_SETTING_USER_MODE,
  ERROR_SETTING_SPACE_AS_FAVORITE,
  ERROR_SETTING_SPACE_AS_RECENT,
  ERROR_STUDENT_LOAD_OUT_OF_DATE_SPACE_MESSAGE,
  ERROR_STUDENT_FORBIDDEN_MESSAGE,
  ERROR_ADDING_CLASSROOM_MESSAGE,
  ERROR_DUPLICATE_CLASSROOM_NAME_MESSAGE,
  SUCCESS_ADDING_CLASSROOM_MESSAGE,
  SUCCESS_DELETING_CLASSROOM_MESSAGE,
  ERROR_DELETING_CLASSROOM_MESSAGE,
  ERROR_EDITING_CLASSROOM_MESSAGE,
  SUCCESS_EDITING_CLASSROOM_MESSAGE,
  ERROR_GETTING_CLASSROOM_MESSAGE,
  ERROR_ACCESS_DENIED_CLASSROOM_MESSAGE,
  ERROR_DUPLICATE_USERNAME_IN_CLASSROOM_MESSAGE,
  ERROR_ADDING_USER_IN_CLASSROOM_MESSAGE,
  ERROR_DELETING_USER_IN_CLASSROOM_MESSAGE,
  ERROR_EDITING_USER_IN_CLASSROOM_MESSAGE,
  SUCCESS_DELETING_USERS_IN_CLASSROOM_MESSAGE,
  SUCCESS_EDITING_USER_IN_CLASSROOM_MESSAGE,
  ERROR_NO_USER_TO_DELETE_MESSAGE,
  ERROR_GETTING_SPACE_IN_CLASSROOM_MESSAGE,
  ERROR_INVALID_USERNAME_MESSAGE,
  ERROR_SETTING_ACTION_ACCESSIBILITY,
  ERROR_SETTING_ACTIONS_AS_ENABLED,
  ERROR_POSTING_FILE_MESSAGE,
  ERROR_DELETING_FILE_MESSAGE,
  PROMPT_DELETE_SPACE_MESSAGE,
  PROMPT_CLEAR_USER_INPUT_MESSAGE,
  ERROR_CANT_LAUNCH_TOUR,
  ERROR_INSTALLING_APP_UPGRADE_MESSAGE,
  UPDATE_AVAILABLE_MESSAGE,
  ERROR_SETTING_FONT_SIZE,
  ERROR_GETTING_FONT_SIZE,
};
