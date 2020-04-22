const { DEFAULT_STUDENT_MODE } = require('../config/config');
const { GET_STUDENT_MODE_CHANNEL } = require('../config/channels');
const logger = require('../logger');
const { ERROR_GENERAL } = require('../config/errors');

const getStudentMode = (mainWindow, db) => async () => {
  try {
    const studentMode =
      db.get('user.settings.studentMode').value() || DEFAULT_STUDENT_MODE;
    mainWindow.webContents.send(GET_STUDENT_MODE_CHANNEL, studentMode);
  } catch (e) {
    logger.error(e);
    mainWindow.webContents.send(GET_STUDENT_MODE_CHANNEL, ERROR_GENERAL);
  }
};

module.exports = getStudentMode;
