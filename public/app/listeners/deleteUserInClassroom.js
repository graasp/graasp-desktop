const { USERS_COLLECTION, CLASSROOMS_COLLECTION } = require('../db');
const { DELETE_USER_IN_CLASSROOM_CHANNEL } = require('../config/channels');
const { ERROR_GENERAL } = require('../config/errors');

const logger = require('../logger');

const deleteUserInClassroom = (mainWindow, db) => async (
  event,
  { userId, classroomId }
) => {
  logger.debug('deleting a user in a classroom');

  try {
    db.get(CLASSROOMS_COLLECTION)
      .find({ id: classroomId })
      .get(USERS_COLLECTION)
      .remove({ id: userId })
      .write();

    return mainWindow.webContents.send(DELETE_USER_IN_CLASSROOM_CHANNEL);
  } catch (err) {
    logger.error(err);
    return mainWindow.webContents.send(
      DELETE_USER_IN_CLASSROOM_CHANNEL,
      ERROR_GENERAL
    );
  }
};

module.exports = deleteUserInClassroom;
