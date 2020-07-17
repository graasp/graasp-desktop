// eslint-disable-next-line import/no-extraneous-dependencies
const { app } = require('electron');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const postAction = require('./postAction');
const { USER_COLLECTION } = require('../db');
const { DATABASE_PATH, ACTIONS_VERBS } = require('../config/config');

const windowAllClosed = mainWindow => {
  const adapter = new FileSync(DATABASE_PATH);
  const db = low(adapter);
  const user = db.get(USER_COLLECTION).value();

  // post sign out action if user is still connected when quitting the app
  if (user) {
    const { id: userId, username, anonymous, geolocation } = user;
    postAction(mainWindow, db)(null, {
      userId,
      verb: ACTIONS_VERBS.LOGOUT,
      data: { id: userId, username, anonymous },
      geolocation,
    });
  }

  app.quit();
};

module.exports = windowAllClosed;
