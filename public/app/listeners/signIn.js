const { USERS_COLLECTION } = require('../db');
const { SIGN_IN_CHANNEL } = require('../config/channels');
const { DEFAULT_LANG } = require('../config/config');

const DEFAULT_USER = {
  lang: DEFAULT_LANG,
};

const signIn = (mainWindow, db) => async (event, { username }) => {
  const users = db.get(USERS_COLLECTION);

  // check in db if username exists
  const user = users.find({ username }).value();
  if (user) {
    mainWindow.webContents.send(SIGN_IN_CHANNEL, user);
  } else {
    const newUser = { username, ...DEFAULT_USER };
    users.push(newUser).write();
    mainWindow.webContents.send(SIGN_IN_CHANNEL, newUser);
  }
};

module.exports = signIn;
