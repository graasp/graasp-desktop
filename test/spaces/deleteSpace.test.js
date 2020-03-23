/* eslint-disable no-unused-expressions */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const { expect } = require('chai');
const { mochaAsync } = require('../utils');
const { createApplication, closeApplication } = require('../application');
const { menuGoTo } = require('../menu.test');
const {
  HOME_MENU_ITEM_ID,
  HOME_MAIN_ID,
  SPACE_CARD_ID_BUILDER,
  SPACE_DELETE_BUTTON_CLASS,
} = require('../../src/config/selectors');
const { SPACE_ATOMIC_STRUCTURE } = require('../fixtures/spaces');
const { visitAndSaveSpaceById } = require('./visitSpace.test');
const { DELETE_SPACE_PAUSE } = require('../constants');

describe('Delete a space', function() {
  this.timeout(270000);
  let app;

  afterEach(function() {
    return closeApplication(app);
  });

  it(
    'Deleting from card removes space from Saved Spaces',
    mochaAsync(async () => {
      const { id } = SPACE_ATOMIC_STRUCTURE;

      app = await createApplication({ showMessageDialogResponse: 1 });

      const { client } = app;

      await visitAndSaveSpaceById(client, id);

      await menuGoTo(client, HOME_MENU_ITEM_ID, HOME_MAIN_ID);

      await client.click(
        `#${SPACE_CARD_ID_BUILDER(id)} .${SPACE_DELETE_BUTTON_CLASS}`
      );
      await client.pause(DELETE_SPACE_PAUSE);

      // card not in saved spaces
      const card = await client.element(`#${SPACE_CARD_ID_BUILDER(id)}`);
      expect(card.value).to.not.exist;
    })
  );

  it(
    'Deleting from toolbar removes space from Saved Spaces',
    mochaAsync(async () => {
      const { id } = SPACE_ATOMIC_STRUCTURE;

      app = await createApplication({ showMessageDialogResponse: 1 });

      const { client } = app;

      await visitAndSaveSpaceById(client, id);

      await client.click(`.${SPACE_DELETE_BUTTON_CLASS}`);
      await client.pause(DELETE_SPACE_PAUSE);

      // card not in saved spaces
      const card = await client.element(`#${SPACE_CARD_ID_BUILDER(id)}`);
      expect(card.value).to.not.exist;
    })
  );

  it(
    'Cancel deleting keeps space in Saved Spaces',
    mochaAsync(async () => {
      const { id } = SPACE_ATOMIC_STRUCTURE;

      app = await createApplication({ showMessageDialogResponse: 0 });

      const { client } = app;

      await visitAndSaveSpaceById(client, id);

      await client.click(`.${SPACE_DELETE_BUTTON_CLASS}`);
      await client.pause(DELETE_SPACE_PAUSE);

      await menuGoTo(client, HOME_MENU_ITEM_ID, HOME_MAIN_ID);

      // card not in saved spaces
      const card = await client.element(`#${SPACE_CARD_ID_BUILDER(id)}`);
      expect(card.value).to.exist;
    })
  );
});
