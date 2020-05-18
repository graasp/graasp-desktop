const { GET_CLASSROOMS_CHANNEL } = require('../config/channels');
const logger = require('../logger');
const { CLASSROOMS_COLLECTION } = require('../db');
const { ERROR_GENERAL } = require('../config/errors');

const getClassrooms = (mainWindow, db) => async () => {
  try {
    // get handle to classrooms collection
    const classrooms = db.get(CLASSROOMS_COLLECTION).value();
    mainWindow.webContents.send(GET_CLASSROOMS_CHANNEL, classrooms);
  } catch (e) {
    logger.error(e);
    mainWindow.webContents.send(GET_CLASSROOMS_CHANNEL, ERROR_GENERAL);
  }
};

module.exports = getClassrooms;
