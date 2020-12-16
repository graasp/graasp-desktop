const {
  USERS_COLLECTION,
  CLASSROOMS_COLLECTION,
  ACTIONS_COLLECTION,
  APP_INSTANCE_RESOURCES_COLLECTION,
} = require('../db');
const { DELETE_USERS_IN_CLASSROOM_CHANNEL } = require('../config/channels');
const { ERROR_GENERAL, ERROR_NO_USER_TO_DELETE } = require('../config/errors');

const logger = require('../logger');

const deleteUsersInClassroom = (mainWindow, db) => async (
  event,
  { users = [], classroomId }
) => {
  logger.debug('deleting a user in a classroom');

  if (!users.length) {
    logger.error('no user to delete');
    return mainWindow.webContents.send(
      DELETE_USERS_IN_CLASSROOM_CHANNEL,
      ERROR_NO_USER_TO_DELETE
    );
  }

  try {
    const classroom = db.get(CLASSROOMS_COLLECTION).find({ id: classroomId });
    const usersInClassroom = classroom.get(USERS_COLLECTION);

    users.forEach(({ id }) => {
      usersInClassroom.remove({ id }).write();

      // remove related actions
      classroom.get(ACTIONS_COLLECTION).remove({ user: id }).write();

      // remove related appInstanceResources
      classroom
        .get(APP_INSTANCE_RESOURCES_COLLECTION)
        .remove({ user: id })
        .write();
    });

    return mainWindow.webContents.send(DELETE_USERS_IN_CLASSROOM_CHANNEL);
  } catch (err) {
    logger.error(err);
    return mainWindow.webContents.send(
      DELETE_USERS_IN_CLASSROOM_CHANNEL,
      ERROR_GENERAL
    );
  }
};

module.exports = deleteUsersInClassroom;
