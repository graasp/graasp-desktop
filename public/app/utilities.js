const mkdirp = require('mkdirp');
const mime = require('mime-types');
const md5 = require('md5');
const fs = require('fs');
const logger = require('./logger');
const {
  DOWNLOADABLE_MIME_TYPES,
  APPLICATION,
  RESOURCE,
  VAR_FOLDER,
  TMP_FOLDER,
} = require('./config/config');

const isFileAvailable = filePath =>
  new Promise(resolve =>
    fs.access(filePath, fs.constants.F_OK, err => resolve(!err))
  );

const getExtension = ({ url, mimeType }) => {
  // default to mime type
  if (mimeType) {
    return mime.extension(mimeType);
  }
  return url.match(/[^\\]*\.(\w+)$/)[1];
};

const isDownloadable = resource => {
  const { category, mimeType, url } = resource;
  // can only download resources with url from where to download them
  if (!url) {
    return false;
  }
  switch (category) {
    case RESOURCE:
      return DOWNLOADABLE_MIME_TYPES.includes(mimeType);
    case APPLICATION:
      // todo: add offline application flag
      return true;
    default:
      return false;
  }
};

const generateHash = resource => {
  const { hash, url } = resource;
  if (hash) {
    return hash;
  }
  // todo: hash should always come from backend
  // assume that if hash of url is the same, it's the same file
  // however, this will prevent the resource from being updated
  return md5(url);
};

// create space directory
const createSpaceDirectory = ({ id, tmp }) => {
  try {
    const rootPath = tmp ? `${VAR_FOLDER}/${TMP_FOLDER}` : VAR_FOLDER;
    const p = `${rootPath}/${id}`;
    mkdirp.sync(p);
    return p;
  } catch (err) {
    logger.error(err);
    return false;
  }
};

module.exports = {
  getExtension,
  isDownloadable,
  generateHash,
  createSpaceDirectory,
  isFileAvailable,
};
