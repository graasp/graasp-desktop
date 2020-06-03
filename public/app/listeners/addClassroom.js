const ObjectId = require('bson-objectid');
const _ = require('lodash');
const { ADD_CLASSROOM_CHANNEL } = require('../config/channels');
const {
  ERROR_GENERAL,
  ERROR_DUPLICATE_CLASSROOM_NAME,
} = require('../config/errors');
const {
  CLASSROOMS_COLLECTION,
  SPACES_COLLECTION,
  APP_INSTANCE_RESOURCES_COLLECTION,
  ACTIONS_COLLECTION,
  USERS_COLLECTION,
} = require('../db');
const logger = require('../logger');
const { createClassroomDirectory } = require('../utilities');

const DEFAULT_CLASSROOM = {
  [SPACES_COLLECTION]: [],
  [APP_INSTANCE_RESOURCES_COLLECTION]: [],
  [ACTIONS_COLLECTION]: [],
  [USERS_COLLECTION]: [],
};

const addClassroom = (mainWindow, db) => async (event, { name, userId }) => {
  logger.debug('adding a classroom');

  try {
    // check name does not already exists for given user
    const found = db
      .get(CLASSROOMS_COLLECTION)
      .find({ name, teacherId: userId })
      .value();
    if (found) {
      mainWindow.webContents.send(
        ADD_CLASSROOM_CHANNEL,
        ERROR_DUPLICATE_CLASSROOM_NAME
      );
    }

    // create new classroom
    const id = ObjectId().str;

    // create directory where resources will be stored
    createClassroomDirectory({ id });

    const now = new Date();
    const newClassroom = {
      ..._.cloneDeep(DEFAULT_CLASSROOM),
      id,
      name,
      createdAt: now,
      updatedAt: now,
      teacherId: userId,
    };

    db.get(CLASSROOMS_COLLECTION)
      .push(newClassroom)
      .write();

    mainWindow.webContents.send(ADD_CLASSROOM_CHANNEL, newClassroom);
  } catch (err) {
    logger.error(err);
    mainWindow.webContents.send(ADD_CLASSROOM_CHANNEL, ERROR_GENERAL);
  }
};

module.exports = addClassroom;
