const { DEFAULT_SYNC_ADVANCED_MODE } = require('../config/config');
const { GET_SYNC_ADVANCED_MODE_CHANNEL } = require('../config/channels');
const logger = require('../logger');
const { ERROR_GENERAL } = require('../config/errors');

const getSyncAdvancedMode = (mainWindow, db) => async () => {
  try {
    const advancedMode =
      db.get('user.settings.syncAdvancedMode').value() ||
      DEFAULT_SYNC_ADVANCED_MODE;
    mainWindow.webContents.send(GET_SYNC_ADVANCED_MODE_CHANNEL, advancedMode);
  } catch (e) {
    logger.error(e);
    mainWindow.webContents.send(GET_SYNC_ADVANCED_MODE_CHANNEL, ERROR_GENERAL);
  }
};

module.exports = getSyncAdvancedMode;
