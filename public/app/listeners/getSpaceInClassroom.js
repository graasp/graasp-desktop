const { GET_SPACE_IN_CLASSROOM_CHANNEL } = require('../config/channels');
const logger = require('../logger');
const { SPACES_COLLECTION, CLASSROOMS_COLLECTION } = require('../db');

const getSpaceInClassroom = (mainWindow, db) => async (
  event,
  { id, classroomId }
) => {
  try {
    // get space in classroom from local db
    const space = db
      .get(CLASSROOMS_COLLECTION)
      .find({ id: classroomId })
      .get(SPACES_COLLECTION)
      .find({ id })
      .value();
    mainWindow.webContents.send(GET_SPACE_IN_CLASSROOM_CHANNEL, space);
  } catch (err) {
    logger.error(err);
    mainWindow.webContents.send(GET_SPACE_IN_CLASSROOM_CHANNEL, null);
  }
};

module.exports = getSpaceInClassroom;
