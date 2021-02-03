const { SET_FONT_SIZE_CHANNEL } = require('../config/channels');
const { ERROR_GENERAL } = require('../config/errors');
const logger = require('../logger');

const setFontSize = (mainWindow, db) => async (event, fontSize) => {
  try {
    db.set('user.settings.fontSize', fontSize).write();
    mainWindow.webContents.send(SET_FONT_SIZE_CHANNEL, fontSize);
  } catch (e) {
    logger.error(e);
    mainWindow.webContents.send(SET_FONT_SIZE_CHANNEL, ERROR_GENERAL);
  }
};

module.exports = setFontSize;
