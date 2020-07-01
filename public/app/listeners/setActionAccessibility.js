const { SET_ACTION_ACCESSIBILITY_CHANNEL } = require('../config/channels');
const { ERROR_GENERAL } = require('../config/errors');
const logger = require('../logger');

const setActionAccessibility = (mainWindow, db) => async (
  event,
  actionAccessibility
) => {
  try {
    db.set('user.settings.actionAccessibility', actionAccessibility).write();
    mainWindow.webContents.send(
      SET_ACTION_ACCESSIBILITY_CHANNEL,
      actionAccessibility
    );
  } catch (e) {
    logger.error(e);
    mainWindow.webContents.send(
      SET_ACTION_ACCESSIBILITY_CHANNEL,
      ERROR_GENERAL
    );
  }
};

module.exports = setActionAccessibility;
