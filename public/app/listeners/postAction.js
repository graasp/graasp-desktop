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
      visibility = 'private',
    } = payload;

    // prepare the timestamp
    const now = new Date();

    // prepare the resource that we will create
    const actionToWrite = {
      appInstance: appInstanceId,
      createdAt: now,
      updatedAt: now,
      data,
      format,
      verb,
      visibility,
      user: userId,
      id: ObjectId().str,
    };

    // write the resource to the database
    const appInstanceElement = db
      .get('spaces')
      .find({ id: spaceId })
      .get('phases')
      .find({ id: subSpaceId })
      .get('items')
      .filter(item => item.appInstance)
      .map(item => item.appInstance)
      .find({ id: appInstanceId });

    // add the actions key if it does not exist
    const hasActions = appInstanceElement.has('actions').value();
    if (!hasActions) {
      appInstanceElement.set('actions', [actionToWrite]).write();
    } else {
      appInstanceElement
        .get('actions')
        .push(actionToWrite)
        .write();
    }

    // send back the resource
    mainWindow.webContents.send(POST_ACTION_CHANNEL, actionToWrite);
  } catch (e) {
    console.error(e);
    mainWindow.webContents.send(POST_ACTION_CHANNEL, null);
  }
};

module.exports = postAction;
