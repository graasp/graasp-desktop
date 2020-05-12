const { SET_SPACE_AS_RECENT_CHANNEL } = require('../config/channels');
const logger = require('../logger');
const { ERROR_GENERAL } = require('../config/errors');
const { MAX_RECENT_SPACES } = require('../config/config');

const setSpaceAsRecent = (mainWindow, db) => async (
  event,
  { spaceId, recent }
) => {
  try {
    const recentSpaces = db.get('user.recentSpaces');
    const foundId = recentSpaces.find(id => id === spaceId).value();

    // add spaceId
    if (recent) {
      // if exist, remove, then push
      if (foundId) {
        recentSpaces.remove(id => id === spaceId).write();
      }
      recentSpaces.push(spaceId).write();

      // remove first element if contains more than fixed elements
      if (recentSpaces.size().value() > MAX_RECENT_SPACES) {
        const firstEl = recentSpaces.take(1).value();
        recentSpaces.remove(firstEl).write();
      }
    }
    // remove spaceId if exists
    else if (!recent && foundId) {
      recentSpaces.remove(id => id === spaceId).write();
    }

    mainWindow.webContents.send(SET_SPACE_AS_RECENT_CHANNEL, {
      recent,
      spaceId,
    });
  } catch (e) {
    logger.error(e);
    mainWindow.webContents.send(SET_SPACE_AS_RECENT_CHANNEL, ERROR_GENERAL);
  }
};

module.exports = setSpaceAsRecent;
