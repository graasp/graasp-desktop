const ObjectId = require('bson-objectid');
const _ = require('lodash');
const { USERS_COLLECTION } = require('../db');
const { SIGN_IN_CHANNEL } = require('../config/channels');
const { DEFAULT_USER } = require('../config/config');

const signIn = (mainWindow, db) => async (event, { username }) => {
  const users = db.get(USERS_COLLECTION);

  const now = new Date();

  // check in db if username exists
  let user = users.find({ username }).value();
  if (!user) {
    const userId = ObjectId().str;
    // assignment inside function to avoid sharing the same array among users
    user = { userId, username, createdAt: now, ..._.cloneDeep(DEFAULT_USER) };
    users.push(user).write();
  }
  // update last login timestamp
  user = { ...user, lastLogin: now };

  db.set('user', user).write();
  mainWindow.webContents.send(SIGN_IN_CHANNEL, user);
};

module.exports = signIn;
