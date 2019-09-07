const _ = require('lodash');
const { CLEARED_USER_INPUT_CHANNEL } = require('../config/channels');
const { ERROR_GENERAL } = require('../config/errors');
const { SPACES_COLLECTION } = require('../db');
const logger = require('../logger');

const clearUserInput = (mainWindow, db) => async (event, { id }) => {
  try {
    logger.debug(`clearing user input for space ${id}`);

    // get handle to the space
    const spaceHandle = db.get(SPACES_COLLECTION).find({ id });

    // get handle to regular items
    const regularItems = spaceHandle
      .get('phases')
      // we only care about phases with items
      .filter(phase => phase.items)
      // ensure all items are in the same level of the array
      .flatMap(phase => phase.items);

    // get handle to tools
    const tools = spaceHandle.get('items');

    // remove user input in items within phases then
    // remove user input in tools
    [regularItems, tools].forEach(handle => {
      // we only care about items with app instances
      handle
        .filter(item => item.appInstance)
        // ensure all app instances are in the same level
        .flatMap(item => item.appInstance)
        // user input is saved inside resources
        .filter(appInstance => appInstance.resources)
        // iterate through app instances to be able to delete
        // reference to the original resource array and thus
        // mutate the db object
        .forEach(appInstance => {
          const resources = _.get(appInstance, 'resources');
          // we should not remove resources marked as public
          _.remove(resources, resource => resource.visibility !== 'public');
        })
        .write();
    });

    // we need to return the value of the mutated
    // space object to the frontend
    const space = spaceHandle.value();

    mainWindow.webContents.send(CLEARED_USER_INPUT_CHANNEL, space);
  } catch (err) {
    mainWindow.webContents.send(CLEARED_USER_INPUT_CHANNEL, ERROR_GENERAL);
  }
};

module.exports = clearUserInput;
