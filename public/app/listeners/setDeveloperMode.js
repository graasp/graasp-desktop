const { SET_DEVELOPER_MODE_CHANNEL } = require('../config/channels');
const { ERROR_GENERAL } = require('../config/errors');
const logger = require('../logger');

const setDeveloperMode = (mainWindow, db) => async (event, developerMode) => {
  try {
    db.set('user.settings.developerMode', developerMode).write();
    mainWindow.webContents.send(SET_DEVELOPER_MODE_CHANNEL, developerMode);
  } catch (e) {
    logger.error(e);
    mainWindow.webContents.send(SET_DEVELOPER_MODE_CHANNEL, ERROR_GENERAL);
  }
};

module.exports = setDeveloperMode;
