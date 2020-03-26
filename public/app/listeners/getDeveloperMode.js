const { DEFAULT_DEVELOPER_MODE } = require('../config/config');
const { GET_DEVELOPER_MODE_CHANNEL } = require('../config/channels');
const logger = require('../logger');
const { ERROR_GENERAL } = require('../config/errors');

const getDeveloperMode = (mainWindow, db) => async () => {
  try {
    const developerMode =
      db.get('user.developerMode').value() || DEFAULT_DEVELOPER_MODE;
    mainWindow.webContents.send(GET_DEVELOPER_MODE_CHANNEL, developerMode);
  } catch (e) {
    logger.error(e);
    mainWindow.webContents.send(GET_DEVELOPER_MODE_CHANNEL, ERROR_GENERAL);
  }
};

module.exports = getDeveloperMode;
