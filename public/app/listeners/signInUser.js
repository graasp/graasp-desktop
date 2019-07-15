// const fs = require('fs');
// const { ERROR_GENERAL } = require('../config/errors');
const logger = require('../logger');
const { USERS_COLLECTION } = require('../db');
const { LOGIN_USER_CHANNEL } = require('../config/channels');
const { DEFAULT_LANG } = require('../config/config');

// use promisified fs
// const fsPromises = fs.promises;

const DEFAULT_USER = {
  lang: DEFAULT_LANG,
};

const signInUser = (mainWindow, db) => async (event, { username }) => {
  const users = db.get(USERS_COLLECTION);

  // check in db if username exists
  const user = users.find({ username }).value();
  if (user) {
    logger.error(user);
    mainWindow.webContents.send(LOGIN_USER_CHANNEL, user);
  } else {
    const newUser = { username, ...DEFAULT_USER };
    users.push(newUser).write();
    mainWindow.webContents.send(LOGIN_USER_CHANNEL, newUser);
  }
};

module.exports = signInUser;
