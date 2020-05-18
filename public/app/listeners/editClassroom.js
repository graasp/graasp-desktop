const { EDIT_CLASSROOM_CHANNEL } = require('../config/channels');
const { ERROR_GENERAL } = require('../config/errors');
const { CLASSROOMS_COLLECTION } = require('../db');
const logger = require('../logger');

const editClassroom = (mainWindow, db) => async (event, { name, id }) => {
  logger.debug('editing classroom');

  try {
    const classroom = db.get(CLASSROOMS_COLLECTION).find({ id });

    // check classroom exists
    const found = classroom.value();
    if (!found) {
      mainWindow.webContents.send(EDIT_CLASSROOM_CHANNEL, ERROR_GENERAL);
    }

    // update data
    const now = new Date();
    classroom.assign({ name, updatedAt: now }).write();

    mainWindow.webContents.send(EDIT_CLASSROOM_CHANNEL);
  } catch (err) {
    logger.error(err);
    mainWindow.webContents.send(EDIT_CLASSROOM_CHANNEL, ERROR_GENERAL);
  }
};

module.exports = editClassroom;
