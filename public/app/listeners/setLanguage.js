const { SET_LANGUAGE_CHANNEL } = require('../config/channels');
const logger = require('../logger');
const { ERROR_GENERAL } = require('../config/errors');

const setLanguage = (mainWindow, db) => async (event, lang) => {
  try {
    db.set('user.lang', lang).write();
    mainWindow.webContents.send(SET_LANGUAGE_CHANNEL, lang);
  } catch (e) {
    logger.error(e);
    mainWindow.webContents.send(SET_LANGUAGE_CHANNEL, ERROR_GENERAL);
  }
};

module.exports = setLanguage;
