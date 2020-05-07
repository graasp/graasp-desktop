const { GET_CLASSROOM_CHANNEL } = require('../config/channels');
const logger = require('../logger');
const { CLASSROOMS_COLLECTION } = require('../db');

const getClassroom = (mainWindow, db) => async (event, { id }) => {
  try {
    // todo: check teacher can access this classroom

    // get classroom from local db
    const classroom = db
      .get(CLASSROOMS_COLLECTION)
      .find({ id })
      .value();
    mainWindow.webContents.send(GET_CLASSROOM_CHANNEL, classroom);
  } catch (err) {
    logger.error(err);
    mainWindow.webContents.send(GET_CLASSROOM_CHANNEL, null);
  }
};

module.exports = getClassroom;
