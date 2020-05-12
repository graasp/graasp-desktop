const { SET_SPACE_AS_FAVORITE_CHANNEL } = require('../config/channels');
const logger = require('../logger');
const { ERROR_GENERAL } = require('../config/errors');

const setSpaceAsFavorite = (mainWindow, db) => async (
  event,
  { spaceId, favorite }
) => {
  try {
    const favoriteSpaces = db.get('user.favoriteSpaces');
    const foundId = favoriteSpaces.find(id => id === spaceId).value();

    // add spaceId if does not exist
    if (favorite && !foundId) {
      favoriteSpaces.push(spaceId).write();
    }
    // remove spaceId if exists
    else if (!favorite && foundId) {
      favoriteSpaces.remove(id => id === spaceId).write();
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
