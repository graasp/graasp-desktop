const fs = require('fs');
const logger = require('../logger');
const { DELETE_FILE_CHANNEL } = require('../config/channels');
const { ERROR_GENERAL } = require('../config/errors');

const deleteFile = mainWindow => (event, payload = {}) => {
  try {
    const {
      data: { uri },
    } = payload;

    if (uri) {
      const filepath = uri.substr('file://'.length);
      fs.unlinkSync(filepath);
      logger.debug(`${uri} was deleted`);
    } else {
      logger.error('no uri specified');
    }

    mainWindow.webContents.send(DELETE_FILE_CHANNEL, payload);
  } catch (e) {
    console.error(e);
    mainWindow.webContents.send(DELETE_FILE_CHANNEL, ERROR_GENERAL);
  }
};

module.exports = deleteFile;
