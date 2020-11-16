const { DEFAULT_TOURS_ENABLED } = require('../config/config');
const { GET_TOURS_ENABLED_CHANNEL } = require('../config/channels');
const logger = require('../logger');
const { ERROR_GENERAL } = require('../config/errors');

const getToursEnabled = (mainWindow) => async () => {
  try {
    const enabled =
      'SHOW_TOURS' in process.env
        ? process.env.SHOW_TOURS === 'true'
        : DEFAULT_TOURS_ENABLED;
    mainWindow.webContents.send(GET_TOURS_ENABLED_CHANNEL, enabled);
  } catch (e) {
    logger.error(e);
    mainWindow.webContents.send(GET_TOURS_ENABLED_CHANNEL, ERROR_GENERAL);
  }
};

module.exports = getToursEnabled;
