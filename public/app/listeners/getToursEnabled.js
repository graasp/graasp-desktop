const { DEFAULT_TOURS_ENABLED, SHOW_TOURS } = require('../config/config');
const { GET_TOURS_ENABLED_CHANNEL } = require('../config/channels');
const logger = require('../logger');
const { ERROR_GENERAL } = require('../config/errors');

const getToursEnabled = (mainWindow) => async () => {
  try {
    const enabled = process.env[SHOW_TOURS]
      ? process.env[SHOW_TOURS] === 'true'
      : DEFAULT_TOURS_ENABLED;
    mainWindow.webContents.send(GET_TOURS_ENABLED_CHANNEL, enabled);
  } catch (e) {
    logger.error(e);
    mainWindow.webContents.send(GET_TOURS_ENABLED_CHANNEL, ERROR_GENERAL);
  }
};

module.exports = getToursEnabled;
