const extract = require('extract-zip');
const rimraf = require('rimraf');
const fs = require('fs');
const { VAR_FOLDER, TMP_FOLDER } = require('../config/config');
const { LOADED_SPACE_CHANNEL } = require('../config/channels');
const {
  ERROR_SPACE_ALREADY_AVAILABLE,
  ERROR_GENERAL,
  ERROR_ZIP_CORRUPTED,
} = require('../config/errors');
const logger = require('../logger');
const { isFileAvailable } = require('../utilities');
const { SPACES_COLLECTION } = require('../db');

// use promisified fs
const fsPromises = fs.promises;

const loadSpace = (mainWindow, db) => async (event, { fileLocation }) => {
  const extractPath = `${VAR_FOLDER}/${TMP_FOLDER}`;
  try {
    extract(fileLocation, { dir: extractPath }, async extractError => {
      if (extractError) {
        logger.error(extractError);
        return mainWindow.webContents.send(LOADED_SPACE_CHANNEL, ERROR_GENERAL);
      }
      // get basic information from manifest
      const manifestPath = `${extractPath}/manifest.json`;
      // abort if there is no manifest
      const hasManifest = await isFileAvailable(manifestPath);
      if (!hasManifest) {
        rimraf.sync(extractPath);
        return mainWindow.webContents.send(
          LOADED_SPACE_CHANNEL,
          ERROR_ZIP_CORRUPTED
        );
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
        rimraf.sync(extractPath);
        return mainWindow.webContents.send(
          LOADED_SPACE_CHANNEL,
          ERROR_SPACE_ALREADY_AVAILABLE
        );
      }

      // abort if there is no space
      const hasSpace = await isFileAvailable(spacePath);
      if (!hasSpace) {
        rimraf.sync(extractPath);
        return mainWindow.webContents.send(
          LOADED_SPACE_CHANNEL,
          ERROR_ZIP_CORRUPTED
        );
      }

      const spaceString = await fsPromises.readFile(spacePath);
      const space = JSON.parse(spaceString);
      const finalPath = `${VAR_FOLDER}/${id}`;
      await fsPromises.rename(extractPath, finalPath);

      // write to database
      spaces.push(space).write();

      return mainWindow.webContents.send(LOADED_SPACE_CHANNEL);
    });
  } catch (err) {
    logger.error(err);
    mainWindow.webContents.send(LOADED_SPACE_CHANNEL, ERROR_GENERAL);
    rimraf.sync(extractPath);
  }
};

module.exports = loadSpace;
