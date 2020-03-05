const ObjectId = require('bson-objectid');
const { USERS_COLLECTION } = require('../db');
const { SIGN_IN_CHANNEL } = require('../config/channels');

const DEFAULT_USER = {};

const signIn = (mainWindow, db) => async (event, { username, password }) => {
  const users = db.get(USERS_COLLECTION);

  // @TODO hash password and check password validity

  // check in db if username exists
  const user = users.find({ username }).value();
  if (user) {
    mainWindow.webContents.send(SIGN_IN_CHANNEL, user);
  } else {
    const userId = ObjectId().str;
    // assignment inside function to avoid sharing the same array among users
    const newUser = { userId, username, password, ...DEFAULT_USER };
    users.push(newUser).write();
    mainWindow.webContents.send(SIGN_IN_CHANNEL, newUser);
  }
};

module.exports = signIn;
