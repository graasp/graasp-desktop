const { autoUpdater } = require('electron-updater');
const logger = require('../logger');
const {
  GET_APP_UPGRADE_CHANNEL,
  INSTALL_APP_UPGRADE_CHANNEL,
} = require('../config/channels');
const { ERROR_GENERAL } = require('../config/errors');

const getAppUpgrade = (mainWindow) => async () => {
  // app update
  autoUpdater.logger = logger;
  autoUpdater.autoDownload = false;

  autoUpdater.once('update-available', () => {
    logger.debug('update is available');
    mainWindow.webContents.send(GET_APP_UPGRADE_CHANNEL, true);
  });

  autoUpdater.once('update-not-available', () => {
    logger.debug('update is not available');
    mainWindow.webContents.send(GET_APP_UPGRADE_CHANNEL, false);
  });

  // noinspection ES6MissingAwait
  autoUpdater
    .checkForUpdates()
    .then()
    .catch((err) => {
      logger.error(err);
    });

  autoUpdater.once('error', () => {
    // send error for upgrading app case
    mainWindow.webContents.send(GET_APP_UPGRADE_CHANNEL, ERROR_GENERAL);

    // send error for downloading app case
    mainWindow.webContents.send(INSTALL_APP_UPGRADE_CHANNEL, ERROR_GENERAL);
  });
};

module.exports = getAppUpgrade;
