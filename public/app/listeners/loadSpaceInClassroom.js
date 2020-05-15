const _ = require('lodash');
const { VAR_FOLDER } = require('../config/config');
const { LOAD_SPACE_IN_CLASSROOM_CHANNEL } = require('../config/channels');
const {
  ERROR_GENERAL,
  ERROR_DUPLICATE_USERNAME_IN_CLASSROOM,
  ERROR_INVALID_USERNAME,
} = require('../config/errors');
const logger = require('../logger');
const { isFileAvailable, clean } = require('../utilities');
const {
  SPACES_COLLECTION,
  APP_INSTANCE_RESOURCES_COLLECTION,
  ACTIONS_COLLECTION,
  CLASSROOMS_COLLECTION,
  USERS_COLLECTION,
} = require('../db');
const { renameSpaceFolder } = require('./loadSpace');
const { deleteSpaceAndResources } = require('./deleteSpace');
const { addUserInClassroomDatabase } = require('./addUserInClassroom');

const loadSpaceInClassroom = (mainWindow, db) => async (
  event,
  {
    extractPath,
    classroomId,
    username,
    elements: { space, actions, appInstanceResources },
    selection: {
      space: isSpaceSelected,
      appInstanceResources: isResourcesSelected,
      actions: isActionsSelected,
    },
  }
) => {
  logger.debug('loading a space in a classroom');

  try {
    const classroom = db.get(CLASSROOMS_COLLECTION).find({ id: classroomId });

    // add user if doesn't exist
    let user = classroom
      .get(USERS_COLLECTION)
      .find({ username })
      .value();
    if (!user) {
      user = addUserInClassroomDatabase(db, { username, id: classroomId });
    }

    // todo: check teacher can write in classroom

    // space should always be defined
    if (_.isEmpty(space)) {
      logger.debug('try to load undefined space');
      return mainWindow.webContents.send(
        LOAD_SPACE_IN_CLASSROOM_CHANNEL,
        ERROR_GENERAL
      );
    }

    // write space to database if selected
    if (isSpaceSelected) {
      const { id } = space;
      const finalPath = `${VAR_FOLDER}/${classroomId}/${id}`;
      const tmpPath = `${VAR_FOLDER}/${classroomId}/.previousSpace-${id}`;

      // temporary rename previous space if exists
      if (await isFileAvailable(finalPath)) {
        const wasRenamed = await renameSpaceFolder(finalPath, tmpPath);
        if (!wasRenamed) {
          logger.error('unable to rename previous space folder');
          clean(extractPath);
          return mainWindow.webContents.send(
            LOAD_SPACE_IN_CLASSROOM_CHANNEL,
            ERROR_GENERAL
          );
        }
      }

      // we need to wrap this operation to avoid errors in windows
      const wasRenamed = await renameSpaceFolder(extractPath, finalPath);
      if (!wasRenamed) {
        logger.error('unable to rename previous temporary new space folder');
        clean(extractPath);
        return mainWindow.webContents.send(
          LOAD_SPACE_IN_CLASSROOM_CHANNEL,
          ERROR_GENERAL
        );
      }

      // remove previous space
      deleteSpaceAndResources(db, id, tmpPath);

      // add new space in database
      classroom
        .get(SPACES_COLLECTION)
        .push(space)
        .write();
    } else {
      // clean temp space folder
      clean(extractPath);
    }

    const { id: userId } = user;

    // write resources to database if selected
    if (isResourcesSelected) {
      if (_.isEmpty(appInstanceResources)) {
        logger.debug('try to load empty resources');
        return mainWindow.webContents.send(
          LOAD_SPACE_IN_CLASSROOM_CHANNEL,
          ERROR_GENERAL
        );
      }

      const savedResources = classroom.get(APP_INSTANCE_RESOURCES_COLLECTION);

      // todo: replace resources

      const newResources = appInstanceResources
        // keep only non-duplicate resources
        .filter(({ id }) => !savedResources.find({ id }).value())
        // change user id with given user
        .map(action => ({ ...action, user: userId }));

      savedResources.push(...newResources).write();
    }

    // write actions to database if selected
    if (isActionsSelected) {
      if (_.isEmpty(actions)) {
        logger.debug('try to load empty actions');
        return mainWindow.webContents.send(
          LOAD_SPACE_IN_CLASSROOM_CHANNEL,
          ERROR_GENERAL
        );
      }

      const savedActions = classroom.get(ACTIONS_COLLECTION);

      // todo: replace actions

      const newActions = actions
        // keep only non-duplicate actions
        .filter(({ id }) => !savedActions.find({ id }).value())
        // change user id with given user
        .map(action => ({ ...action, user: userId }));

      savedActions.push(...newActions).write();
    }

    return mainWindow.webContents.send(LOAD_SPACE_IN_CLASSROOM_CHANNEL, {
      spaceId: space.id,
    });
  } catch (err) {
    switch (err) {
      case ERROR_DUPLICATE_USERNAME_IN_CLASSROOM:
        return mainWindow.webContents.send(
          LOAD_SPACE_IN_CLASSROOM_CHANNEL,
          ERROR_DUPLICATE_USERNAME_IN_CLASSROOM
        );
      case ERROR_INVALID_USERNAME:
        return mainWindow.webContents.send(
          LOAD_SPACE_IN_CLASSROOM_CHANNEL,
          ERROR_INVALID_USERNAME
        );
      default:
        logger.error(err);
        return mainWindow.webContents.send(
          LOAD_SPACE_IN_CLASSROOM_CHANNEL,
          ERROR_GENERAL
        );
    }
  }
};

module.exports = loadSpaceInClassroom;
