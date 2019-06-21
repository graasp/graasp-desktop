const { GET_SPACES_CHANNEL } = require('../config/channels');
const logger = require('../logger');
const { SPACES_COLLECTION } = require('../db');

const getSpaces = (mainWindow, db) => async () => {
  try {
    // get handle to spaces collection
    const spaces = db.get(SPACES_COLLECTION).value();
    mainWindow.webContents.send(GET_SPACES_CHANNEL, spaces);
  } catch (e) {
    logger.error(e);
  }
};

module.exports = getSpaces;
