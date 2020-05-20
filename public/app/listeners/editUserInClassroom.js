const { EDIT_USER_IN_CLASSROOM_CHANNEL } = require('../config/channels');
const { ERROR_GENERAL } = require('../config/errors');
const {
  CLASSROOMS_COLLECTION,
  USERS_COLLECTION,
  ACTIONS_COLLECTION,
  APP_INSTANCE_RESOURCES_COLLECTION,
} = require('../db');
const logger = require('../logger');

// @param deleteSelection : map key-value with space id as key to whether the space data should be deleted
const editUserInClassroom = (mainWindow, db) => async (
  event,
  { username, userId, classroomId, deleteSelection }
) => {
  logger.debug('editing user in classroom');

  try {
    const classroom = db.get(CLASSROOMS_COLLECTION).find({ id: classroomId });

    const user = classroom.get(USERS_COLLECTION).find({ id: userId });

    // check user exists
    const found = user.value();
    if (!found) {
      mainWindow.webContents.send(
        EDIT_USER_IN_CLASSROOM_CHANNEL,
        ERROR_GENERAL
      );
    }

    // delete space data related to user if selected
    const actions = classroom.get(ACTIONS_COLLECTION);
    const resources = classroom.get(APP_INSTANCE_RESOURCES_COLLECTION);
    Object.entries(deleteSelection).forEach(([spaceId, selected]) => {
      if (selected) {
        actions.remove({ spaceId, user: userId }).write();
        resources.remove({ spaceId, user: userId }).write();
      }
    });

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
