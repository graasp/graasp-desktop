const { DEFAULT_USER_MODE } = require('../config/config');
const { GET_USER_MODE_CHANNEL } = require('../config/channels');
const logger = require('../logger');
const { ERROR_GENERAL } = require('../config/errors');

const getUserMode = (mainWindow, db) => async () => {
  try {
    const userMode =
      db.get('user.settings.userMode').value() || DEFAULT_USER_MODE;
    mainWindow.webContents.send(GET_USER_MODE_CHANNEL, userMode);
  } catch (e) {
    logger.error(e);
    mainWindow.webContents.send(GET_USER_MODE_CHANNEL, ERROR_GENERAL);
  }
};

module.exports = getUserMode;
