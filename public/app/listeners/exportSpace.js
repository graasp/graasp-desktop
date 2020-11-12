// eslint-disable-next-line import/no-extraneous-dependencies
const { app } = require('electron');
const archiver = require('archiver');
const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const logger = require('../logger');

const {
  VAR_FOLDER,
  VISIBILITIES,
  APPLICATION,
  APPS_FOLDER,
} = require('../config/config');
const { ERROR_GENERAL } = require('../config/errors');
const {
  SPACES_COLLECTION,
  APP_INSTANCE_RESOURCES_COLLECTION,
  ACTIONS_COLLECTION,
} = require('../db');
const { EXPORTED_SPACE_CHANNEL } = require('../config/channels');

// use promisified fs
const fsPromises = fs.promises;

// validate conditions when fetching resources and actions for a given space
const validateConditions = (
  { user, spaceId, visibility },
  id,
  userId,
  isStudent
) => {
  const spaceCondition = spaceId === id;
  // teachers can fetch every user's data
  // students can only fetch their own data
  const studentCondition = !isStudent || user === userId;
  // public data are always fetched
  const visiblityCondition = visibility === VISIBILITIES.PUBLIC;

  return spaceCondition && (studentCondition || visiblityCondition);
};

const prepareArchive = async (
  archive,
  db,
  { space, spaceId, selection, userId }
) => {
  const {
    space: isSpaceSelected,
    actions: isActionsSelected,
    resources: isResourcesSelected,
  } = selection;

  // deep copy
  const spaceToExport = _.cloneDeep(space);

  const isStudent = db.get('user.settings.studentMode').value();

  // export the user's resources, private and public
  const resources = isResourcesSelected
    ? db
        .get(APP_INSTANCE_RESOURCES_COLLECTION)
        .filter((resource) =>
          validateConditions(resource, spaceId, userId, isStudent)
        )
        .value()
    : [];

  const actions = isActionsSelected
    ? db
        .get(ACTIONS_COLLECTION)
        .filter((action) =>
          validateConditions(action, spaceId, userId, isStudent)
        )
        .value()
    : [];

  // copy prepackaged apps in space
  if (isSpaceSelected) {
    // get prepackaged apps
    const isPrepackagedApp = (item) =>
      item?.category === APPLICATION && item?.asset?.startsWith(APPS_FOLDER);

    // eslint-disable-next-line no-restricted-syntax
    for (const [phaseIdx, phase] of spaceToExport.phases.entries()) {
      const { items = [] } = phase;
      // eslint-disable-next-line no-restricted-syntax
      for (const [itemIdx, item] of items.entries()) {
        console.log(isPrepackagedApp(item));
        if (isPrepackagedApp(item)) {
          const { asset, name } = item;
          const assetFolder = path.dirname(asset);
          const mainFilename = path.basename(asset);

          // archive prepackaged app
          archive.directory(assetFolder, name);

          // change asset in json
          // eslint-disable-next-line no-param-reassign
          spaceToExport.phases[phaseIdx].items[itemIdx].asset = path.join(
            spaceId,
            name,
            mainFilename
          );
        }
      }
    }
  }

  // write space and manifest to json file inside space folder
  const data = {
    space: spaceToExport,
    [APP_INSTANCE_RESOURCES_COLLECTION]: resources,
    [ACTIONS_COLLECTION]: actions,
  };
  // stringify space
  const spaceString = JSON.stringify(data);
  const spaceDirectory = `${VAR_FOLDER}/${spaceId}`;
  const spacePath = `${spaceDirectory}/${spaceId}.json`;

  // create manifest
  const manifest = {
    id: spaceId,
    version: app.getVersion(),
    createdAt: new Date().toISOString(),
  };
  const manifestString = JSON.stringify(manifest);
  const manifestPath = `${spaceDirectory}/manifest.json`;

  await fsPromises.writeFile(spacePath, spaceString);
  await fsPromises.writeFile(manifestPath, manifestString);
  archive.directory(spaceDirectory, false);
};

// we export the space and the current user's resources and actions
// In the future we can add options so that the behaviour can be slightly modified
const exportSpace = (mainWindow, db) => async (
  event,
  { archivePath, id, userId, selection }
) => {
  try {
    const { space: isSpaceSelected } = selection;
    // get space from local database
    const space = isSpaceSelected
      ? db.get(SPACES_COLLECTION).find({ id }).value()
      : {};

    // abort if space does not exist
    if (!space) {
      mainWindow.webContents.send(EXPORTED_SPACE_CHANNEL, ERROR_GENERAL);
    } else {
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

      archive.on('warning', (err) => {
        if (err.code === 'ENOENT') {
          logger.error(err);
        }
      });
      archive.on('error', () => {
        mainWindow.webContents.send(EXPORTED_SPACE_CHANNEL, ERROR_GENERAL);
      });
      archive.pipe(output);

      await prepareArchive(archive, db, {
        space,
        spaceId: id,
        userId,
        selection,
      });

      archive.finalize();
    }
  } catch (err) {
    logger.error(err);
    mainWindow.webContents.send(EXPORTED_SPACE_CHANNEL, ERROR_GENERAL);
  }
};

module.exports = exportSpace;
