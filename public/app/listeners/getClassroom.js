const { GET_CLASSROOM_CHANNEL } = require('../config/channels');
const logger = require('../logger');
const { CLASSROOMS_COLLECTION } = require('../db');
const { ERROR_ACCESS_DENIED_CLASSROOM } = require('../config/errors');

const getClassroom = (mainWindow, db) => async (event, { id, userId }) => {
  try {
    // get classroom from local db
    const classroom = db
      .get(CLASSROOMS_COLLECTION)
      .find({ id })
      .value();

    // check teacher can access this classroom
    if (classroom.teacherId !== userId) {
      logger.error('this user does not have access to this classroom');
      return mainWindow.webContents.send(
        GET_CLASSROOM_CHANNEL,
        ERROR_ACCESS_DENIED_CLASSROOM
      );
    }

    return mainWindow.webContents.send(GET_CLASSROOM_CHANNEL, classroom);
  } catch (err) {
    logger.error(err);
    return mainWindow.webContents.send(GET_CLASSROOM_CHANNEL, null);
  }
};

module.exports = getClassroom;
