// eslint-disable-next-line import/no-extraneous-dependencies
const { app } = require('electron');
const isWindows = require('../utils/isWindows');

const tours = {
  VISIT_SPACE_TOUR: 'visitSpace',
  SETTINGS_TOUR: 'settings',
};

// types that we support downloading
const DOWNLOADABLE_MIME_TYPES = [
  // video
  'application/mp4',
  'application/ogg',
  'video/mp4',
  'video/ogg',
  'video/quicktime',
  'video/webm',
  // audio
  'audio/mp4',
  'audio/mpeg',
  'audio/ogg',
  'audio/webm',
  'audio/x-aac',
  'audio/x-wav',
  // image
  'image/bmp',
  'image/gif',
  'image/jpeg',
  'image/png',
  // pdf
  'application/pdf',
];

// resolve path for windows '\'
const escapeEscapeCharacter = str => {
  return isWindows() ? str.replace(/\\/g, '\\\\') : str;
};

// categories
const RESOURCE = 'Resource';
const APPLICATION = 'Application';

const VAR_FOLDER = `${escapeEscapeCharacter(app.getPath('userData'))}/var`;
const DATABASE_PATH = `${VAR_FOLDER}/db.json`;
const ICON_PATH = 'app/assets/icon.png';
const PRODUCT_NAME = 'Graasp';
const TMP_FOLDER = 'tmp';
const DEFAULT_LANG = 'en';
const DEFAULT_DEVELOPER_MODE = false;
const STUDENT_USER_MODE = 'student';
const DEFAULT_USER_MODE = STUDENT_USER_MODE;
const DEFAULT_GEOLOCATION_ENABLED = false;
const VISUAL_SYNC_MODE = 'visual';
const DEFAULT_SYNC_MODE = VISUAL_SYNC_MODE;
const DEFAULT_PROTOCOL = 'https';
const DEFAULT_LOGGING_LEVEL = 'info';
const AUTHENTICATED = 'authenticated';
const DEFAULT_AUTHENTICATION = false;
const DEFAULT_ACTION_ACCESSIBILITY = false;
const DEFAULT_ACTIONS_AS_ENABLED = true;

const buildDefaultUser = (lang = DEFAULT_LANG) => ({
  geolocation: null,
  settings: {
    lang,
    developerMode: DEFAULT_DEVELOPER_MODE,
    geolocationEnabled: DEFAULT_GEOLOCATION_ENABLED,
    syncMode: DEFAULT_SYNC_MODE,
    userMode: DEFAULT_USER_MODE,
    actionAccessibility: DEFAULT_ACTION_ACCESSIBILITY,
    actionsEnabled: DEFAULT_ACTIONS_AS_ENABLED,
  },
  favoriteSpaces: [],
  recentSpaces: [],
  tour: {
    [tours.VISIT_SPACE_TOUR]: false,
    [tours.SETTINGS_TOUR]: false,
  },
});

const ANONYMOUS_USERNAME = 'Anonymous';

const MAX_RECENT_SPACES = 5;

const VISIBILITIES = {
  PUBLIC: 'public',
  PRIVATE: 'private',
};

const DEFAULT_FORMAT = 'v1';
const ACTIONS_VERBS = {
  LOGOUT: 'logout',
};

module.exports = {
  DEFAULT_LOGGING_LEVEL,
  DEFAULT_PROTOCOL,
  DEFAULT_DEVELOPER_MODE,
  DEFAULT_GEOLOCATION_ENABLED,
  DOWNLOADABLE_MIME_TYPES,
  TMP_FOLDER,
  RESOURCE,
  APPLICATION,
  DATABASE_PATH,
  VAR_FOLDER,
  DEFAULT_LANG,
  ICON_PATH,
  PRODUCT_NAME,
  escapeEscapeCharacter,
  DEFAULT_AUTHENTICATION,
  buildDefaultUser,
  AUTHENTICATED,
  ANONYMOUS_USERNAME,
  VISUAL_SYNC_MODE,
  DEFAULT_SYNC_MODE,
  DEFAULT_USER_MODE,
  MAX_RECENT_SPACES,
  VISIBILITIES,
  DEFAULT_FORMAT,
  ACTIONS_VERBS,
};
