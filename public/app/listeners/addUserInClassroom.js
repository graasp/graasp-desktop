const { USERS_COLLECTION, CLASSROOMS_COLLECTION } = require('../db');
const { ADD_USER_IN_CLASSROOM_CHANNEL } = require('../config/channels');
const { createNewUser } = require('./signIn');
const {
  ERROR_DUPLICATE_USERNAME_IN_CLASSROOM,
  ERROR_INVALID_USERNAME,
  ERROR_GENERAL,
} = require('../config/errors');

const logger = require('../logger');

const addUserInClassroomDatabase = (db, { username, id }) => {
  // check username validity
  if (!username || !username.length) {
    throw new Error(ERROR_INVALID_USERNAME);
  }

  const users = db
    .get(CLASSROOMS_COLLECTION)
    .find({ id })
    .get(USERS_COLLECTION);

  const now = new Date();

  // check in db if username exists
  const found = users.find({ username }).value();

  if (found) {
    throw new Error(ERROR_DUPLICATE_USERNAME_IN_CLASSROOM);
  }

  const user = createNewUser(username, now);
  users.push(user).write();
  return user;
};

const addUserInClassroom = (mainWindow, db) => async (
  event,
  { username, classroomId: id }
) => {
  logger.debug('adding a user in a classroom');

  try {
    const user = addUserInClassroomDatabase(db, { username, id });

    return mainWindow.webContents.send(ADD_USER_IN_CLASSROOM_CHANNEL, user);
  } catch (err) {
    switch (err) {
      case ERROR_DUPLICATE_USERNAME_IN_CLASSROOM:
        return mainWindow.webContents.send(
          ADD_USER_IN_CLASSROOM_CHANNEL,
          ERROR_DUPLICATE_USERNAME_IN_CLASSROOM
        );
      case ERROR_INVALID_USERNAME:
        return mainWindow.webContents.send(
          ADD_USER_IN_CLASSROOM_CHANNEL,
          ERROR_INVALID_USERNAME
        );
      default:
        logger.error(err);
        return mainWindow.webContents.send(
          ADD_USER_IN_CLASSROOM_CHANNEL,
          ERROR_GENERAL
        );
    }
  }
};

module.exports = { addUserInClassroom, addUserInClassroomDatabase };
