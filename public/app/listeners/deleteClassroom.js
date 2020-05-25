const { CLASSROOMS_COLLECTION } = require('../db');
const { DELETE_CLASSROOM_CHANNEL } = require('../config/channels');
const { ERROR_GENERAL } = require('../config/errors');
const logger = require('../logger');

const deleteClassroomAndResources = (db, id) => {
  db.get(CLASSROOMS_COLLECTION)
    .remove({ id })
    .write();

  // todo: remove containing spaces
};

const deleteClassroom = (mainWindow, db) => async (event, { id }) => {
  logger.debug('deleting classroom');

  try {
    deleteClassroomAndResources(db, id);
    mainWindow.webContents.send(DELETE_CLASSROOM_CHANNEL);
  } catch (err) {
    logger.error(err);
    mainWindow.webContents.send(DELETE_CLASSROOM_CHANNEL, ERROR_GENERAL);
  }
};

module.exports = deleteClassroom;
