const ObjectId = require('bson-objectid');
const { POST_ACTION_CHANNEL } = require('../config/channels');
const logger = require('../logger');
const { DEFAULT_FORMAT } = require('../config/config');

const postAction = (mainWindow, db) => (event, payload = {}) => {
  try {
    const {
      userId,
      appInstanceId,
      spaceId,
      subSpaceId,
      format = DEFAULT_FORMAT,
      verb,
      data,
      geolocation, // todo: remove
      visibility = 'private',
    } = payload;

    // prepare the timestamp
    const now = new Date();

    // prepare the action that we will create
    const actionToWrite = {
      ...(spaceId ? { spaceId } : {}),
      ...(subSpaceId ? { subSpaceId } : {}),
      ...(appInstanceId ? { appInstanceId } : {}),
      createdAt: now,
      updatedAt: now,
      data,
      format,
      verb,
      geolocation, // todo: remove
      visibility,
      user: userId,
      id: ObjectId().str,
    };

    // write the action to the database
    db.get('actions').push(actionToWrite).write();

    // send back the action to the app
    if (appInstanceId) {
      mainWindow.webContents.send(
        `${POST_ACTION_CHANNEL}_${appInstanceId}`,
        actionToWrite
      );
    }
  } catch (e) {
    logger.error(e);
    mainWindow.webContents.send(POST_ACTION_CHANNEL, null);
  }
};

module.exports = postAction;
