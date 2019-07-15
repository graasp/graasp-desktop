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
const TMP_FOLDER = 'tmp';
const DEFAULT_LANG = 'en';
const DEFAULT_DEVELOPER_MODE = false;
const DEFAULT_AUTHENTICATED = false;

module.exports = {
  DEFAULT_DEVELOPER_MODE,
  DOWNLOADABLE_MIME_TYPES,
  TMP_FOLDER,
  RESOURCE,
  APPLICATION,
  DATABASE_PATH,
  VAR_FOLDER,
  DEFAULT_LANG,
  DEFAULT_AUTHENTICATED,
};
