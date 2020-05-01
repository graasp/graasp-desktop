const { SET_USER_MODE_CHANNEL } = require('../config/channels');
const { ERROR_GENERAL } = require('../config/errors');
const logger = require('../logger');

const setUserMode = (mainWindow, db) => async (event, userMode) => {
  try {
    db.set('user.settings.userMode', userMode).write();
    mainWindow.webContents.send(SET_USER_MODE_CHANNEL, userMode);
  } catch (e) {
    logger.error(e);
    mainWindow.webContents.send(SET_USER_MODE_CHANNEL, ERROR_GENERAL);
  }
};

module.exports = setUserMode;
