// eslint-disable-next-line import/no-extraneous-dependencies
const { app } = require('electron');

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

// categories
const RESOURCE = 'Resource';
const APPLICATION = 'Application';

const VAR_FOLDER = `${app.getPath('userData')}/var`;
const DATABASE_PATH = `${VAR_FOLDER}/db.json`;
const ICON_PATH = `${app.getAppPath()}/assets/icon.png`;
const PRODUCT_NAME = 'Graasp';
const TMP_FOLDER = 'tmp';
const DEFAULT_LANG = 'en';
const DEFAULT_DEVELOPER_MODE = false;
const DEFAULT_GEOLOCATION_ENABLED = false;

module.exports = {
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
};
