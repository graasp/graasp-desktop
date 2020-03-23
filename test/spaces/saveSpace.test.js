/* eslint-disable no-unused-expressions */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const { mochaAsync } = require('../utils');
const { createApplication, closeApplication } = require('../application');
const { menuGoTo } = require('../menu.test');
const {
  HOME_MENU_ITEM_ID,
  HOME_MAIN_ID,
  SPACE_CARD_ID_BUILDER,
  SPACE_CARD_LINK_CLASS,
} = require('../../src/config/selectors');
const { SPACE_ATOMIC_STRUCTURE } = require('../fixtures/spaces');
const {
  checkSpaceCardLayout,
  hasSavedSpaceLayout,
  hasSavedSpaceHomeLayout,
  visitAndSaveSpaceById,
} = require('./visitSpace.test');
const { OPEN_SAVED_SPACE_PAUSE } = require('../constants');

describe('Save a space', function() {
  this.timeout(270000);
  let app;

  afterEach(function() {
    return closeApplication(app);
  });

  beforeEach(
    mochaAsync(async () => {
      app = await createApplication();
    })
  );
  it(
    'Saving a space adds it to Saved Spaces',
    mochaAsync(async () => {
      const { client } = app;
      const { id, description, name } = SPACE_ATOMIC_STRUCTURE;

      await visitAndSaveSpaceById(client, id);

      await hasSavedSpaceLayout(client, SPACE_ATOMIC_STRUCTURE);

      // check space is referenced in saved spaces
      await menuGoTo(client, HOME_MENU_ITEM_ID, HOME_MAIN_ID);

      await checkSpaceCardLayout(client, SPACE_ATOMIC_STRUCTURE);

      // go to space
      await client.click(
        `#${SPACE_CARD_ID_BUILDER(id)} .${SPACE_CARD_LINK_CLASS}`
      );
      await client.pause(OPEN_SAVED_SPACE_PAUSE);

      await hasSavedSpaceHomeLayout(client, { name, description });
    })
  );
});
