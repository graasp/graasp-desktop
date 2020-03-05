const { SIGN_OUT_CHANNEL } = require('../config/channels');
const { ERROR_GENERAL } = require('../config/errors');
const logger = require('../logger');

const signOut = mainWindow => async () => {
  try {
    // clear cookies
    // session.defaultSession.clearStorageData(
    //   { options: { storages: ['cookies'] } },
    //   () => {}
    //   );

    mainWindow.webContents.send(SIGN_OUT_CHANNEL);
  } catch (e) {
    logger.error(e);
    mainWindow.webContents.send(SIGN_OUT_CHANNEL, ERROR_GENERAL);
  }
};

module.exports = signOut;
