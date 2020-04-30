// eslint-disable-next-line import/no-extraneous-dependencies
const { app } = require('electron');
const archiver = require('archiver');
const fs = require('fs');
const logger = require('../logger');

const { VAR_FOLDER } = require('../config/config');
const { ERROR_GENERAL } = require('../config/errors');
const {
  SPACES_COLLECTION,
  APP_INSTANCE_RESOURCES_COLLECTION,
  ACTIONS_COLLECTION,
} = require('../db');
const { EXPORTED_SPACE_CHANNEL } = require('../config/channels');

// use promisified fs
const fsPromises = fs.promises;

// we export the space and the current user's resources and actions
// In the future we can add options so that the behaviour can be slightly modified
const exportSpace = (mainWindow, db) => async (
  event,
  {
    archivePath,
    id,
    userId,
    selection: {
      space: isSpaceSelected,
      actions: isActionsSelected,
      resources: isResourcesSelected,
    },
  }
) => {
  try {
    // get space from local database
    const space = isSpaceSelected
      ? db
          .get(SPACES_COLLECTION)
          .find({ id })
          .value()
      : {};

    // build conditions when fetching resources and actions
    // teachers can fetch every user's data
    // students can only fetch their own data
    const isStudent = db.get('user.settings.studentMode').value();
    const conditions = { spaceId: id };
    if (isStudent) {
      conditions.user = userId;
    }

    // export the user's resources, private and public
    const resources = isResourcesSelected
      ? db
          .get(APP_INSTANCE_RESOURCES_COLLECTION)
          .filter(conditions)
          .value()
      : [];

    const actions = isActionsSelected
      ? db
          .get(ACTIONS_COLLECTION)
          .filter(conditions)
          .value()
      : [];

    // abort if space does not exist
    if (!space) {
      mainWindow.webContents.send(EXPORTED_SPACE_CHANNEL, ERROR_GENERAL);
    } else {
      const data = {
        space,
        [APP_INSTANCE_RESOURCES_COLLECTION]: resources,
        [ACTIONS_COLLECTION]: actions,
      };
      // stringify space
      const spaceString = JSON.stringify(data);
      const spaceDirectory = `${VAR_FOLDER}/${id}`;
      const spacePath = `${spaceDirectory}/${id}.json`;

      // create manifest
      const manifest = {
        id,
        version: app.getVersion(),
        createdAt: new Date().toISOString(),
      };
      const manifestString = JSON.stringify(manifest);
      const manifestPath = `${spaceDirectory}/manifest.json`;

      // write space and manifest to json file inside space folder
      await fsPromises.writeFile(spacePath, spaceString);
      await fsPromises.writeFile(manifestPath, manifestString);

      // prepare output file for zip
      const output = fs.createWriteStream(archivePath);
      output.on('close', () => {
        mainWindow.webContents.send(EXPORTED_SPACE_CHANNEL);
      });
      output.on('end', () => {
        mainWindow.webContents.send(EXPORTED_SPACE_CHANNEL, ERROR_GENERAL);
      });

      // archive space folder into zip
      const archive = archiver('zip', {
        zlib: { level: 9 },
      });
      archive.on('warning', err => {
        if (err.code === 'ENOENT') {
          logger.error(err);
        }
      });
      archive.on('error', () => {
        mainWindow.webContents.send(EXPORTED_SPACE_CHANNEL, ERROR_GENERAL);
      });
      archive.pipe(output);
      archive.directory(spaceDirectory, false);
      archive.finalize();
    }
  } catch (err) {
    logger.error(err);
    mainWindow.webContents.send(EXPORTED_SPACE_CHANNEL, ERROR_GENERAL);
  }
};

module.exports = exportSpace;
