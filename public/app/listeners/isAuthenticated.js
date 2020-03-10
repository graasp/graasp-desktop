const { IS_AUTHENTICATED_CHANNEL } = require('../config/channels');
const logger = require('../logger');
const { ERROR_GENERAL } = require('../config/errors');
const { DEFAULT_AUTHENTICATION } = require('../config/config');

const isAuthenticated = (mainWindow, db) => async () => {
  try {
    const authenticated =
      db.get('user.authenticated').value() || DEFAULT_AUTHENTICATION;
    mainWindow.webContents.send(IS_AUTHENTICATED_CHANNEL, authenticated);
  } catch (e) {
    logger.error(e);
    mainWindow.webContents.send(IS_AUTHENTICATED_CHANNEL, ERROR_GENERAL);
  }
};

module.exports = isAuthenticated;
