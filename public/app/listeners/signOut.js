const { SIGN_OUT_CHANNEL } = require('../config/channels');
const { ERROR_GENERAL } = require('../config/errors');
const logger = require('../logger');

const signOut = (mainWindow, db) => async () => {
  try {
    // update user in users collection
    const user = db.get('user').value();
    db.get('users')
      .find({ userId: user.userId })
      .assign(user)
      .write();

    // clear user in db
    db.set('user', {}).write();

    mainWindow.webContents.send(SIGN_OUT_CHANNEL);
  } catch (e) {
    logger.error(e);
    mainWindow.webContents.send(SIGN_OUT_CHANNEL, ERROR_GENERAL);
  }
};

module.exports = signOut;
