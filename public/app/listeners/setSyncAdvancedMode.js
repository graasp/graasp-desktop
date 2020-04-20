const { SET_SYNC_ADVANCED_MODE_CHANNEL } = require('../config/channels');
const { ERROR_GENERAL } = require('../config/errors');
const logger = require('../logger');

const setSyncAdvancedMode = (mainWindow, db) => async (event, advancedMode) => {
  try {
    db.set('user.settings.syncAdvancedMode', advancedMode).write();
    mainWindow.webContents.send(SET_SYNC_ADVANCED_MODE_CHANNEL, advancedMode);
  } catch (e) {
    logger.error(e);
    mainWindow.webContents.send(SET_SYNC_ADVANCED_MODE_CHANNEL, ERROR_GENERAL);
  }
};

module.exports = setSyncAdvancedMode;
