const { SET_STUDENT_MODE_CHANNEL } = require('../config/channels');
const { ERROR_GENERAL } = require('../config/errors');
const logger = require('../logger');

const setStudentMode = (mainWindow, db) => async (event, studentMode) => {
  try {
    db.set('user.settings.studentMode', studentMode).write();
    mainWindow.webContents.send(SET_STUDENT_MODE_CHANNEL, studentMode);
  } catch (e) {
    logger.error(e);
    mainWindow.webContents.send(SET_STUDENT_MODE_CHANNEL, ERROR_GENERAL);
  }
};

module.exports = setStudentMode;
