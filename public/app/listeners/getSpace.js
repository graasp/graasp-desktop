const { GET_SPACE_CHANNEL } = require('../config/channels');
const logger = require('../logger');
const { SPACES_COLLECTION } = require('../db');

const getSpace = (mainWindow, db) => async (event, { id }) => {
  try {
    // get space from local db
    const space = db
      .get(SPACES_COLLECTION)
      .find({ id })
      .value();
    mainWindow.webContents.send(GET_SPACE_CHANNEL, space);
  } catch (err) {
    logger.error(err);
    mainWindow.webContents.send(GET_SPACE_CHANNEL, null);
  }
};

module.exports = getSpace;
