const rimraf = require('rimraf');

const { SPACES_COLLECTION } = require('../db');
const { DELETED_SPACE_CHANNEL } = require('../config/channels');
const { VAR_FOLDER } = require('../config/config');
const { ERROR_GENERAL } = require('../config/errors');

const deleteSpace = (mainWindow, db) => async (event, { id }) => {
  try {
    db.get(SPACES_COLLECTION)
      .remove({ id })
      .write();
    rimraf.sync(`${VAR_FOLDER}/${id}`);
    mainWindow.webContents.send(DELETED_SPACE_CHANNEL);
  } catch (err) {
    mainWindow.webContents.send(DELETED_SPACE_CHANNEL, ERROR_GENERAL);
  }
};

module.exports = deleteSpace;
