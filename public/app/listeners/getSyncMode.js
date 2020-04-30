const { DEFAULT_SYNC_MODE } = require('../config/config');
const { GET_SYNC_MODE_CHANNEL } = require('../config/channels');
const logger = require('../logger');
const { ERROR_GENERAL } = require('../config/errors');

const getSyncMode = (mainWindow, db) => async () => {
  try {
    const mode = db.get('user.settings.syncMode').value() || DEFAULT_SYNC_MODE;
    mainWindow.webContents.send(GET_SYNC_MODE_CHANNEL, mode);
  } catch (e) {
    logger.error(e);
    mainWindow.webContents.send(GET_SYNC_MODE_CHANNEL, ERROR_GENERAL);
  }
};

module.exports = getSyncMode;
