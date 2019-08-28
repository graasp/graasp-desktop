const { DEFAULT_LANG } = require('../config/config');
const { GET_LANGUAGE_CHANNEL } = require('../config/channels');
const { ERROR_GENERAL } = require('../config/errors');
const logger = require('../logger');

const getLanguage = (mainWindow, db) => async () => {
  try {
    const lang = db.get('user.lang').value() || DEFAULT_LANG;
    mainWindow.webContents.send(GET_LANGUAGE_CHANNEL, lang);
  } catch (e) {
    logger.error(e);
    mainWindow.webContents.send(GET_LANGUAGE_CHANNEL, ERROR_GENERAL);
  }
};

module.exports = getLanguage;
