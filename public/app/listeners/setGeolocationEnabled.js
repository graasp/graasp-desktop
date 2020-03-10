const { SET_GEOLOCATION_ENABLED_CHANNEL } = require('../config/channels');
const { ERROR_GENERAL } = require('../config/errors');
const logger = require('../logger');

const setGeolocationEnabled = (mainWindow, db) => async (
  event,
  geolocationEnabled
) => {
  try {
    db.set('user.settings.geolocationEnabled', geolocationEnabled).write();
    mainWindow.webContents.send(
      SET_GEOLOCATION_ENABLED_CHANNEL,
      geolocationEnabled
    );
  } catch (e) {
    logger.error(e);
    mainWindow.webContents.send(SET_GEOLOCATION_ENABLED_CHANNEL, ERROR_GENERAL);
  }
};

module.exports = setGeolocationEnabled;
