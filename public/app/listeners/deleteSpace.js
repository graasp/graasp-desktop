const rimraf = require('rimraf');

const {
  SPACES_COLLECTION,
  ACTIONS_COLLECTION,
  APP_INSTANCE_RESOURCES_COLLECTION,
} = require('../db');
const { DELETED_SPACE_CHANNEL } = require('../config/channels');
const { VAR_FOLDER } = require('../config/config');
const { ERROR_GENERAL } = require('../config/errors');
const logger = require('../logger');

const deleteSpace = (mainWindow, db) => async (event, { id }) => {
  logger.debug('deleting space');

  try {
    db.get(SPACES_COLLECTION)
      .remove({ id })
      .write();

    // remove related resources
    db.get(APP_INSTANCE_RESOURCES_COLLECTION)
      .remove({ spaceId: id })
      .write();

    // remove related actions
    db.get(ACTIONS_COLLECTION)
      .remove({ spaceId: id })
      .write();

    rimraf.sync(`${VAR_FOLDER}/${id}`);
    mainWindow.webContents.send(DELETED_SPACE_CHANNEL);
  } catch (err) {
    logger.error(err);
    mainWindow.webContents.send(DELETED_SPACE_CHANNEL, ERROR_GENERAL);
  }
};

module.exports = deleteSpace;
