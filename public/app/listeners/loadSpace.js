const extract = require('extract-zip');
const { promisify } = require('util');
const fs = require('fs');
const ObjectId = require('bson-objectid');
const { VAR_FOLDER } = require('../config/config');
const { LOADED_SPACE_CHANNEL } = require('../config/channels');
const {
  ERROR_SPACE_ALREADY_AVAILABLE,
  ERROR_GENERAL,
  ERROR_ZIP_CORRUPTED,
} = require('../config/errors');
const logger = require('../logger');
const {
  performFileSystemOperation,
  isFileAvailable,
  clean,
} = require('../utilities');
const {
  SPACES_COLLECTION,
  APP_INSTANCE_RESOURCES_COLLECTION,
  ACTIONS_COLLECTION,
} = require('../db');

// use promisified fs
const fsPromises = fs.promises;

const loadSpace = (mainWindow, db) => async (event, { fileLocation }) => {
  const tmpId = ObjectId().str;

  // make temporary folder hidden
  const extractPath = `${VAR_FOLDER}/.${tmpId}`;
  try {
    await promisify(extract)(fileLocation, { dir: extractPath });

    // get basic information from manifest
    const manifestPath = `${extractPath}/manifest.json`;
    // abort if there is no manifest
    const hasManifest = await isFileAvailable(manifestPath);
    if (!hasManifest) {
      mainWindow.webContents.send(LOADED_SPACE_CHANNEL, ERROR_ZIP_CORRUPTED);
      return clean(extractPath);
    }
    const manifestString = await fsPromises.readFile(manifestPath);
    const manifest = JSON.parse(manifestString);
    const { id } = manifest;
    const spacePath = `${extractPath}/${id}.json`;

    // get handle to spaces collection
    const spaces = db.get(SPACES_COLLECTION);
    const existingSpace = spaces.find({ id }).value();

    // abort if there is already a space with that id
    if (existingSpace) {
      mainWindow.webContents.send(
        LOADED_SPACE_CHANNEL,
        ERROR_SPACE_ALREADY_AVAILABLE
      );
      return clean(extractPath);
    }

    // abort if there is no space
    const hasSpace = await isFileAvailable(spacePath);
    if (!hasSpace) {
      mainWindow.webContents.send(LOADED_SPACE_CHANNEL, ERROR_ZIP_CORRUPTED);
      return clean(extractPath);
    }

    const spaceString = await fsPromises.readFile(spacePath);
    const {
      space,
      appInstanceResources: resources = [],
      actions = [],
    } = JSON.parse(spaceString);
    const finalPath = `${VAR_FOLDER}/${id}`;

    // we need to wrap this operation to avoid errors in windows
    performFileSystemOperation(fs.renameSync)(extractPath, finalPath);

    const wasRenamed = await isFileAvailable(finalPath);

    if (!wasRenamed) {
      logger.error('unable to rename extract path');
      mainWindow.webContents.send(LOADED_SPACE_CHANNEL, ERROR_GENERAL);
      return clean(extractPath);
    }

    // write space to database
    spaces.push(space).write();

    // write resources to database
    db.get(APP_INSTANCE_RESOURCES_COLLECTION)
      .push(...resources)
      .write();

    // write actions to database
    db.get(ACTIONS_COLLECTION)
      .push(...actions)
      .write();

    return mainWindow.webContents.send(LOADED_SPACE_CHANNEL, { spaceId: id });
  } catch (err) {
    logger.error(err);
    mainWindow.webContents.send(LOADED_SPACE_CHANNEL, ERROR_GENERAL);
    return clean(extractPath);
  }
};

module.exports = loadSpace;
