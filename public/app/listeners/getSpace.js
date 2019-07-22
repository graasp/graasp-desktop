const ObjectId = require('bson-objectid');
const { GET_SPACE_CHANNEL } = require('../config/channels');
const logger = require('../logger');
const { SPACES_COLLECTION, USERS_COLLECTION } = require('../db');

const getSpace = (mainWindow, db) => async (event, { id, user }) => {
  try {
    // get space from local db
    const space = db
      .get(SPACES_COLLECTION)
      .find({ id })
      .value();

    // get user token for this space, or create a new one
    const spaceTokens = db
      .get(USERS_COLLECTION)
      .find({ username: user.username })
      .get('tokens');
    let token = spaceTokens.find({ spaceId: id }).value();

    // if the user has never signed in before, we obtain a token for this space
    if (!token) {
      token = ObjectId().str;
      spaceTokens.push({ spaceId: id, token }).write();
    }

    mainWindow.webContents.send(GET_SPACE_CHANNEL, space);
  } catch (err) {
    logger.error(err);
    mainWindow.webContents.send(GET_SPACE_CHANNEL, null);
  }
};

module.exports = getSpace;
