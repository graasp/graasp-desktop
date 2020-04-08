const { SIGN_OUT_CHANNEL } = require('../config/channels');
const { ERROR_GENERAL } = require('../config/errors');
const logger = require('../logger');

const signOut = (mainWindow, db) => async () => {
  try {
    db.set('user.authenticated', false).write();

    // update user in users collection
    const user = db.get('user').value();
    db.get('users')
      .find({ id: user.id })
      .assign(user)
      .write();

    // clear user in db
    db.set('user', {}).write();

    // @TODO: save length of the session for analytics

    mainWindow.webContents.send(SIGN_OUT_CHANNEL);
  } catch (e) {
    logger.error(e);
    mainWindow.webContents.send(SIGN_OUT_CHANNEL, ERROR_GENERAL);
  }
};

module.exports = signOut;
