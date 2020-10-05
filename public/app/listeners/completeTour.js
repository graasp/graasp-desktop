const { TOUR_COMPLETED_CHANNEL } = require('../config/channels');
const { ERROR_GENERAL } = require('../config/errors');
const logger = require('../logger');

const completeTour = (mainWindow, db) => async (event, { tourName }) => {
  try {
    // update user in users collection
    db.get('user')
      .set(`tour.${tourName}`, true)
      .write();
    mainWindow.webContents.send(TOUR_COMPLETED_CHANNEL);
  } catch (e) {
    logger.error(e);
    mainWindow.webContents.send(TOUR_COMPLETED_CHANNEL, ERROR_GENERAL);
  }
};

module.exports = completeTour;
