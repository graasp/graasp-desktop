const { GET_USER_FOLDER_CHANNEL } = require('../config/channels');
const { VAR_FOLDER } = require('../config/config');
const { ERROR_GENERAL } = require('../config/errors');
const logger = require('../logger');

const getUserFolder = (mainWindow) => async () => {
  try {
    mainWindow.webContents.send(GET_USER_FOLDER_CHANNEL, VAR_FOLDER);
  } catch (e) {
    logger.error(e);
    mainWindow.webContents.send(GET_USER_FOLDER_CHANNEL, ERROR_GENERAL);
  }
};

module.exports = getUserFolder;
