const { CLEARED_USER_INPUT_CHANNEL } = require('../config/channels');
const { ERROR_GENERAL } = require('../config/errors');
const {
  SPACES_COLLECTION,
  APP_INSTANCE_RESOURCES_COLLECTION,
} = require('../db');
const logger = require('../logger');

const clearUserInput = (mainWindow, db) => async (
  event,
  { spaceId, userId }
) => {
  try {
    logger.debug(`clearing user input for space ${spaceId} of user ${userId}`);

    db.get(APP_INSTANCE_RESOURCES_COLLECTION)
      .remove({ visibility: 'private', spaceId, user: userId })
      .write();

    // we need to return the value of the mutated
    // space object to the frontend
    // get handle to the space
    const spaceHandle = db.get(SPACES_COLLECTION).find({ id: spaceId });
    const space = spaceHandle.value();

    mainWindow.webContents.send(CLEARED_USER_INPUT_CHANNEL, space);
  } catch (err) {
    mainWindow.webContents.send(CLEARED_USER_INPUT_CHANNEL, ERROR_GENERAL);
  }
};

module.exports = clearUserInput;
