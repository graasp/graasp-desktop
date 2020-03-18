/* eslint-disable no-unused-expressions */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const { expect } = require('chai');
const { mochaAsync } = require('./utils');
const { createApplication, closeApplication } = require('./application');
const { menuGoTo } = require('./menu.test');
const {
  SPACE_SAVE_ICON_CLASS,
  HOME_MENU_ITEM_ID,
  HOME_MAIN_ID,
  SPACE_CARD_ID_BUILDER,
  VISIT_MENU_ITEM_ID,
  VISIT_MAIN_ID,
  VISIT_BUTTON_ID,
  VISIT_INPUT_ID,
  SPACE_CARD_LINK_CLASS,
  SPACE_DELETE_BUTTON_CLASS,
} = require('../src/config/selectors');
const { SPACE_ATOMIC_STRUCTURE } = require('./fixtures/spaces');
const {
  checkSpaceCardLayout,
  hasPreviewSpaceLayout,
  hasSavedSpaceLayout,
  hasSavedSpaceHomeLayout,
} = require('./spaces/layout');

const visitSpaceById = async (client, id) => {
  await menuGoTo(client, VISIT_MENU_ITEM_ID, VISIT_MAIN_ID);

  // input space id
  await client.setValue(`#${VISIT_INPUT_ID}`, id);
  await client.pause(1000);
  const value = await client.getValue(`#${VISIT_INPUT_ID}`);
  expect(value).to.equal(id);

  await client.click(`#${VISIT_BUTTON_ID}`);
  await client.pause(2000);
};

describe('Space Scenarios', function() {
  this.timeout(70000);
  let app;

  afterEach(function() {
    return closeApplication(app);
  });

  describe('Layout verification', function() {
    beforeEach(function lauchApp() {
      app = createApplication();
      return app.start();
    });

    it(
      'Saving a space adds it to Saved Spaces',
      mochaAsync(async () => {
        const { client } = app;
        const { id, description, name } = SPACE_ATOMIC_STRUCTURE;

        await client.pause(1000);

        await visitSpaceById(client, id);

        // save space
        await client.click(`.${SPACE_SAVE_ICON_CLASS}`);
        await client.pause(10000);

        await hasSavedSpaceLayout(client, SPACE_ATOMIC_STRUCTURE);

        // check space is referenced in saved spaces
        await menuGoTo(client, HOME_MENU_ITEM_ID, HOME_MAIN_ID);

        await client.pause(2000);

        await checkSpaceCardLayout(client, SPACE_ATOMIC_STRUCTURE);

        // go to space
        await client.click(
          `#${SPACE_CARD_ID_BUILDER(id)} .${SPACE_CARD_LINK_CLASS}`
        );
        await client.pause(2000);

        await hasSavedSpaceHomeLayout(client, { name, description });
      })
    );

    it(
      `Visit space ${SPACE_ATOMIC_STRUCTURE.name} (${SPACE_ATOMIC_STRUCTURE.id})`,
      mochaAsync(async () => {
        const { client } = app;

        await client.pause(1000);

        await visitSpaceById(client, SPACE_ATOMIC_STRUCTURE.id);

        await hasPreviewSpaceLayout(client, SPACE_ATOMIC_STRUCTURE);
      })
    );
  });

  describe('Mock dialog Tests', function() {
    describe('Delete a space', function() {
      it(
        'Deleting from card removes space from Saved Spaces',
        mochaAsync(async () => {
          const { id } = SPACE_ATOMIC_STRUCTURE;

          app = createApplication(1);
          await app.start();

          const { client } = app;

          await client.pause(1000);

          await visitSpaceById(client, id);

          // save space
          await client.click(`.${SPACE_SAVE_ICON_CLASS}`);
          await client.pause(5000);

          await menuGoTo(client, HOME_MENU_ITEM_ID, HOME_MAIN_ID);
          await client.pause(2000);

          await checkSpaceCardLayout(client, SPACE_ATOMIC_STRUCTURE);

          await client.click(
            `#${SPACE_CARD_ID_BUILDER(id)} .${SPACE_DELETE_BUTTON_CLASS}`
          );
          await client.pause(2000);

          // card not in saved spaces
          const card = await client.element(`#${SPACE_CARD_ID_BUILDER(id)}`);
          expect(card.value).to.not.exist;
        })
      );

      it(
        'Deleting from toolbar removes space from Saved Spaces',
        mochaAsync(async () => {
          const { id } = SPACE_ATOMIC_STRUCTURE;

          await app.start();

          const { client } = app;

          await client.pause(1000);

          await visitSpaceById(client, id);

          // save space
          await client.click(`.${SPACE_SAVE_ICON_CLASS}`);
          // this waiting time is longer to wait for tooltip to fade out
          await client.pause(10000);

          await client.click(`.${SPACE_DELETE_BUTTON_CLASS}`);
          await client.pause(2000);

          // card not in saved spaces
          const card = await client.element(`#${SPACE_CARD_ID_BUILDER(id)}`);
          expect(card.value).to.not.exist;
        })
      );
    });
  });
});
