const ObjectId = require('bson-objectid');
const _ = require('lodash');
const { USERS_COLLECTION } = require('../db');
const { SIGN_IN_CHANNEL } = require('../config/channels');
const {
  DEFAULT_USER,
  ANONYMOUS_USERNAME,
  AUTHENTICATED,
} = require('../config/config');

const createNewUser = (username, createdAt, anonymous = false) => {
  const id = ObjectId().str;

  return {
    id,
    username,
    createdAt,
    anonymous,
    ..._.cloneDeep(DEFAULT_USER),
  };
};

const signIn = (mainWindow, db) => async (
  event,
  { username, anonymous = false }
) => {
  const users = db.get(USERS_COLLECTION);

  const now = new Date();

  let user;
  if (anonymous) {
    user = createNewUser(ANONYMOUS_USERNAME, now, anonymous);
    users.push(user).write();
  } else {
    // check in db if username exists
    user = users.find({ username }).value();

    if (!user) {
      user = createNewUser(username, now);
      users.push(user).write();
    }
  }

  const updatedUser = {
    ...user,
    lastSignIn: now,
    authenticated: AUTHENTICATED,
  };

  db.set('user', updatedUser).write();
  mainWindow.webContents.send(SIGN_IN_CHANNEL, updatedUser);
};

module.exports = { signIn, createNewUser };
