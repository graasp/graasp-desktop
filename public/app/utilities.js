const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const path = require('path');
const { promisify } = require('util');
const mime = require('mime-types');
const md5 = require('md5');
const fs = require('fs');
const logger = require('./logger');
const isWindows = require('./utils/isWindows');
const {
  DOWNLOADABLE_MIME_TYPES,
  APPLICATION,
  RESOURCE,
  VAR_FOLDER,
  TMP_FOLDER,
} = require('./config/config');

// use promisified fs
const fsPromises = fs.promises;

const isFileAvailable = filePath =>
  new Promise(resolve =>
    fs.access(filePath, fs.constants.F_OK, err => resolve(!err))
  );

const getExtension = ({ url, mimeType }) => {
  logger.debug('getting extension');
  // default to mime type
  if (mimeType) {
    return mime.extension(mimeType);
  }
  logger.debug(`url is: ${url}`);
  logger.debug(`mime type is: ${mimeType}`);
  const matchExtension = url.match(/[^\\]*\.(\w+)$/);
  logger.debug('result of getting extension from url is:', matchExtension);
  if (matchExtension && matchExtension.length) {
    // extension is in index 1
    const extension = matchExtension[1];
    logger.debug(`extension is: ${extension}`);
    return extension;
  }
  return null;
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

// create classroom directory
const createClassroomDirectory = ({ id, tmp }) => {
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

// wraps file system operation so that it can be retried
// many times for windows operating systems
const performFileSystemOperation = functionToWrap => (...args) => {
  let tryOperation = true;
  // windows operations require silly amounts of retries
  // because it will not release handles promptly (#159)
  const retries = isWindows() ? 100 : 1;
  let i = 0;
  do {
    let threw = true;
    try {
      functionToWrap(...args);
      threw = false;
    } finally {
      i += 1;
      if (i >= retries || !threw) {
        tryOperation = false;
        // eslint-disable-next-line no-unsafe-finally
        break;
      } else {
        logger.error(`failed operation ${functionToWrap.name} on try ${i}`);
        // eslint-disable-next-line no-continue, no-unsafe-finally
        continue;
      }
    }
  } while (tryOperation);
};

// waits until directory is accessed before removing it
// and thus allowing windows to release the file handle
const clean = async dir => {
  try {
    await fsPromises.access(dir);
  } catch (err) {
    // does not exist so all good
    return true;
  }
  return promisify(rimraf)(dir);
};

/**
 * Ensure directories for given filepath exist
 */
function ensureDirectoryExistence(filePath) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  return fs.mkdirSync(dirname);
}

module.exports = {
  clean,
  ensureDirectoryExistence,
  performFileSystemOperation,
  getExtension,
  isDownloadable,
  generateHash,
  createSpaceDirectory,
  isFileAvailable,
  createClassroomDirectory,
};
