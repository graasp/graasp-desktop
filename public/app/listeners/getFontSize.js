const { GET_FONT_SIZE_CHANNEL } = require('../config/channels');
const { ERROR_GENERAL } = require('../config/errors');
const logger = require('../logger');

const getFontSize = (mainWindow, db) => async () => {
  try {
    const fontSize = db.get('user.settings.fontSize').value();
    mainWindow.webContents.send(GET_FONT_SIZE_CHANNEL, fontSize);
  } catch (e) {
    logger.error(e);
    mainWindow.webContents.send(GET_FONT_SIZE_CHANNEL, ERROR_GENERAL);
  }
};

module.exports = getFontSize;
