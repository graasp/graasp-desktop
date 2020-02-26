const ObjectId = require('bson-objectid');
const { POST_ACTION_CHANNEL } = require('../config/channels');

const postAction = (mainWindow, db) => (event, payload = {}) => {
  try {
    const {
      userId,
      appInstanceId,
      spaceId,
      subSpaceId,
      format,
      verb,
      data,
      geolocation,
      visibility = 'private',
    } = payload;

    // prepare the timestamp
    const now = new Date();

    // prepare the resource that we will create
    const actionToWrite = {
      spaceId,
      subSpaceId,
      appInstanceId,
      createdAt: now,
      updatedAt: now,
      data,
      format,
      verb,
      geolocation,
      visibility,
      user: userId,
      id: ObjectId().str,
    };

    // write the action to the database
    db.get('actions')
      .push(actionToWrite)
      .write();

    // send back the resource
    mainWindow.webContents.send(POST_ACTION_CHANNEL, actionToWrite);
  } catch (e) {
    console.error(e);
    mainWindow.webContents.send(POST_ACTION_CHANNEL, null);
  }
};

module.exports = postAction;
