const { SET_SPACE_AS_FAVORITE_CHANNEL } = require('../config/channels');
const logger = require('../logger');
const { ERROR_GENERAL } = require('../config/errors');

const setSpaceAsFavorite = (mainWindow, db) => async (
  event,
  { spaceId, favorite }
) => {
  // add spaceId if does not exist
  try {
    if (favorite) {
      const foundId = db
        .get('user.favoriteSpaces')
        .find(id => id === spaceId)
        .value();
      if (!foundId) {
        db.get('user.favoriteSpaces')
          .push(spaceId)
          .write();
      }
    }
    // remove spaceId if exists
    else {
      const foundId = db
        .get('user.favoriteSpaces')
        .find(id => id === spaceId)
        .value();
      if (foundId) {
        db.get('user.favoriteSpaces')
          .remove(id => id === spaceId)
          .write();
      }
    }
    mainWindow.webContents.send(SET_SPACE_AS_FAVORITE_CHANNEL, {
      favorite,
      spaceId,
    });
  } catch (e) {
    logger.error(e);
    mainWindow.webContents.send(SET_SPACE_AS_FAVORITE_CHANNEL, ERROR_GENERAL);
  }
};

module.exports = setSpaceAsFavorite;
