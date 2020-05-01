const { SET_SYNC_MODE_CHANNEL } = require('../config/channels');
const { ERROR_GENERAL } = require('../config/errors');
const logger = require('../logger');

const setSyncMode = (mainWindow, db) => async (event, mode) => {
  try {
    db.set('user.settings.syncMode', mode).write();
    mainWindow.webContents.send(SET_SYNC_MODE_CHANNEL, mode);
  } catch (e) {
    logger.error(e);
    mainWindow.webContents.send(SET_SYNC_MODE_CHANNEL, ERROR_GENERAL);
  }
};

module.exports = setSyncMode;
