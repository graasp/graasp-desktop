const { DEFAULT_GEOLOCATION_ENABLED } = require('../config/config');
const { GET_GEOLOCATION_ENABLED_CHANNEL } = require('../config/channels');
const { ERROR_GENERAL } = require('../config/errors');
const logger = require('../logger');

const getGeolocationEnabled = (mainWindow, db) => async () => {
  try {
    const geolocationEnabled =
      db.get('user.geolocationEnabled').value() || DEFAULT_GEOLOCATION_ENABLED;
    mainWindow.webContents.send(
      GET_GEOLOCATION_ENABLED_CHANNEL,
      geolocationEnabled
    );
  } catch (e) {
    logger.error(e);
    mainWindow.webContents.send(GET_GEOLOCATION_ENABLED_CHANNEL, ERROR_GENERAL);
  }
};

module.exports = getGeolocationEnabled;
