const { autoUpdater } = require('electron-updater');
const logger = require('../logger');
const { INSTALL_APP_UPGRADE_CHANNEL } = require('../config/channels');
const { ERROR_GENERAL } = require('../config/errors');

const installAppUpgrade = mainWindow => async (event, shouldUpgrade) => {
  try {
    if (shouldUpgrade) {
      autoUpdater.once('update-downloaded', () => {
        const msg = 'Update downloaded';
        logger.debug('message', { msg, hide: false, replaceAll: true });
        autoUpdater.quitAndInstall();
      });

      mainWindow.webContents.send(INSTALL_APP_UPGRADE_CHANNEL, true);

      autoUpdater.downloadUpdate().catch(err => {
        logger.error(err);
        mainWindow.webContents.send(INSTALL_APP_UPGRADE_CHANNEL, ERROR_GENERAL);
      });
    }
  } catch (err) {
    logger.error(err);
    mainWindow.webContents.send(INSTALL_APP_UPGRADE_CHANNEL, ERROR_GENERAL);
  }
};

module.exports = installAppUpgrade;
