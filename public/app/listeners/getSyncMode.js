const { DEFAULT_SYNC_MODES } = require('../config/config');
const { GET_SYNC_MODES_CHANNEL } = require('../config/channels');
const logger = require('../logger');
const { ERROR_GENERAL } = require('../config/errors');

const getSyncMode = (mainWindow, db) => async () => {
  try {
    const mode = db.get('user.settings.syncMode').value() || DEFAULT_SYNC_MODES;
    mainWindow.webContents.send(GET_SYNC_MODES_CHANNEL, mode);
  } catch (e) {
    logger.error(e);
    mainWindow.webContents.send(GET_SYNC_MODES_CHANNEL, ERROR_GENERAL);
  }
};

module.exports = getSyncMode;
