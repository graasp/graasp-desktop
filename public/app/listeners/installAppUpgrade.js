const { autoUpdater } = require('electron-updater');
const logger = require('../logger');
const { INSTALL_APP_UPGRADE_CHANNEL } = require('../config/channels');

const installAppUpgrade = mainwindow => async (event, shouldUpgrade) => {
  try {
    if (shouldUpgrade) {
      autoUpdater.once('update-downloaded', () => {
        const msg = 'Update downloaded';
        logger.debug('message', { msg, hide: false, replaceAll: true });
        autoUpdater.quitAndInstall();
      });

      mainwindow.webContents.send(INSTALL_APP_UPGRADE_CHANNEL, true);

      autoUpdater.downloadUpdate().catch(err => {
        logger.error(err);
        mainwindow.webContents.send(INSTALL_APP_UPGRADE_CHANNEL, false);
      });
    }
  } catch (err) {
    logger.error(err);
    mainwindow.webContents.send(INSTALL_APP_UPGRADE_CHANNEL, false);
  }
};

module.exports = installAppUpgrade;
