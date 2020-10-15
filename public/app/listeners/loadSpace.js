const extract = require('extract-zip');
const _ = require('lodash');
const fs = require('fs');
const ObjectId = require('bson-objectid');
const { VAR_FOLDER } = require('../config/config');
const {
  LOADED_SPACE_CHANNEL,
  CLEAR_LOAD_SPACE_CHANNEL,
  EXTRACT_FILE_TO_LOAD_SPACE_CHANNEL,
} = require('../config/channels');
const { ERROR_GENERAL, ERROR_ZIP_CORRUPTED } = require('../config/errors');
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
const { deleteSpaceAndResources } = require('./deleteSpace');

// use promisified fs
const fsPromises = fs.promises;

// rename prevPath to newPath if prevPath exists
const renameSpaceFolder = async (prevPath, newPath) => {
  // check destination path is available
  const isNewPathAvailable = await isFileAvailable(newPath);
  if (isNewPathAvailable) {
    logger.error(
      `unable to rename temporary folder: ${newPath} already exists`
    );
    return false;
  }

  // check prev path is available
  const isPrevPathAvailable = await isFileAvailable(prevPath);
  if (!isPrevPathAvailable) {
    logger.error(`temporary folder ${prevPath} does not exist`);
    return isPrevPathAvailable;
  }

  // we need to wrap this operation to avoid errors in windows
  performFileSystemOperation(fs.renameSync)(prevPath, newPath);
  const wasRenamed = await isFileAvailable(newPath);
  if (!wasRenamed) {
    logger.error('unable to rename previous space folder');
  }

  return wasRenamed;
};

const extractFileToLoadSpace = (mainWindow) => async (
  event,
  { fileLocation }
) => {
  const tmpId = ObjectId().str;

  // make temporary folder hidden
  const extractPath = `${VAR_FOLDER}/.${tmpId}`;
  try {
    await extract(fileLocation, { dir: extractPath });

    // get basic information from manifest
    const manifestPath = `${extractPath}/manifest.json`;
    // abort if there is no manifest
    const hasManifest = await isFileAvailable(manifestPath);
    if (!hasManifest) {
      mainWindow.webContents.send(
        EXTRACT_FILE_TO_LOAD_SPACE_CHANNEL,
        ERROR_ZIP_CORRUPTED
      );
      return clean(extractPath);
    }
    const manifestString = await fsPromises.readFile(manifestPath);
    const manifest = JSON.parse(manifestString);
    const { id } = manifest;
    const spacePath = `${extractPath}/${id}.json`;

    const spaceString = await fsPromises.readFile(spacePath);
    const { space = {}, appInstanceResources = [], actions = [] } = JSON.parse(
      spaceString
    );
    const elements = { space, appInstanceResources, actions };

    return mainWindow.webContents.send(EXTRACT_FILE_TO_LOAD_SPACE_CHANNEL, {
      spaceId: id,
      extractPath,
      elements,
    });
  } catch (err) {
    logger.error(err);
    mainWindow.webContents.send(
      EXTRACT_FILE_TO_LOAD_SPACE_CHANNEL,
      ERROR_GENERAL
    );
    return clean(extractPath);
  }
};

const clearLoadSpace = (mainWindow) => async (event, { extractPath }) => {
  const isCleanSuccessful = clean(extractPath);
  mainWindow.webContents.send(CLEAR_LOAD_SPACE_CHANNEL);
  return isCleanSuccessful;
};

const loadSpace = (mainWindow, db) => async (
  event,
  {
    extractPath,
    elements: { space, actions, appInstanceResources },
    selection: {
      space: isSpaceSelected,
      appInstanceResources: isResourcesSelected,
      actions: isActionsSelected,
    },
  }
) => {
  try {
    // space should always be defined
    if (_.isEmpty(space)) {
      logger.debug('try to load undefined space');
      return mainWindow.webContents.send(LOADED_SPACE_CHANNEL, ERROR_GENERAL);
    }

    // write space to database if selected
    if (isSpaceSelected) {
      const { id } = space;
      const finalPath = `${VAR_FOLDER}/${id}`;
      const tmpPath = `${VAR_FOLDER}/.previousSpace-${id}`;

      // temporary rename previous space if exists
      if (await isFileAvailable(finalPath)) {
        const wasRenamed = await renameSpaceFolder(finalPath, tmpPath);
        if (!wasRenamed) {
          logger.error('unable to rename previous space folder');
          clean(extractPath);
          return mainWindow.webContents.send(
            LOADED_SPACE_CHANNEL,
            ERROR_GENERAL
          );
        }
      }

      // we need to wrap this operation to avoid errors in windows
      const wasRenamed = await renameSpaceFolder(extractPath, finalPath);
      if (!wasRenamed) {
        logger.error('unable to rename previous temporary new space folder');
        clean(extractPath);
        return mainWindow.webContents.send(LOADED_SPACE_CHANNEL, ERROR_GENERAL);
      }

      // remove previous space
      deleteSpaceAndResources(db, id, tmpPath);

      // add new space in database
      db.get(SPACES_COLLECTION).push(space).write();
    } else {
      // clean temp space folder
      clean(extractPath);
    }

    const userId = db.get('user.id').value();

    // write resources to database if selected
    if (isResourcesSelected) {
      if (_.isEmpty(appInstanceResources)) {
        logger.debug('try to load empty resources');
        return mainWindow.webContents.send(LOADED_SPACE_CHANNEL, ERROR_GENERAL);
      }

      const savedResources = db.get(APP_INSTANCE_RESOURCES_COLLECTION);

      const newResources = appInstanceResources
        // keep only non-duplicate resources
        .filter(({ id }) => !savedResources.find({ id }).value())
        // change user id by current user id
        .map((resource) => ({
          ...resource,
          user: userId,
        }));

      savedResources.push(...newResources).write();
    }

    // write actions to database if selected
    if (isActionsSelected) {
      if (_.isEmpty(actions)) {
        logger.debug('try to load empty actions');
        return mainWindow.webContents.send(LOADED_SPACE_CHANNEL, ERROR_GENERAL);
      }

      const savedActions = db.get(ACTIONS_COLLECTION);

      const newActions = actions
        // keep only non-duplicate actions
        .filter(({ id }) => !savedActions.find({ id }).value())
        // change user id by current user id
        .map((action) => ({ ...action, user: userId }));

      savedActions.push(...newActions).write();
    }

    return mainWindow.webContents.send(LOADED_SPACE_CHANNEL, {
      spaceId: space.id,
    });
  } catch (err) {
    logger.error(err);
    clean(extractPath);
    return mainWindow.webContents.send(LOADED_SPACE_CHANNEL, ERROR_GENERAL);
  }
};

module.exports = {
  clearLoadSpace,
  extractFileToLoadSpace,
  loadSpace,
  renameSpaceFolder,
};
