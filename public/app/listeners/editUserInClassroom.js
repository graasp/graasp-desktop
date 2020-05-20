const { EDIT_USER_IN_CLASSROOM_CHANNEL } = require('../config/channels');
const { ERROR_GENERAL } = require('../config/errors');
const { CLASSROOMS_COLLECTION, USERS_COLLECTION } = require('../db');
const logger = require('../logger');

const editUserInClassroom = (mainWindow, db) => async (
  event,
  { username, userId, classroomId }
) => {
  logger.debug('editing user in classroom');

  try {
    const user = db
      .get(CLASSROOMS_COLLECTION)
      .find({ id: classroomId })
      .get(USERS_COLLECTION)
      .find({ id: userId });

    // check user exists
    const found = user.value();
    if (!found) {
      mainWindow.webContents.send(
        EDIT_USER_IN_CLASSROOM_CHANNEL,
        ERROR_GENERAL
      );
    }

    // update data
    const now = new Date();
    user.assign({ username, lastUpdatedAt: now }).write();

    mainWindow.webContents.send(EDIT_USER_IN_CLASSROOM_CHANNEL);
  } catch (err) {
    logger.error(err);
    mainWindow.webContents.send(EDIT_USER_IN_CLASSROOM_CHANNEL, ERROR_GENERAL);
  }
};

module.exports = editUserInClassroom;
