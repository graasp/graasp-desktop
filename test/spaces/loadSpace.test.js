/* eslint-disable no-unused-expressions */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const { expect } = require('chai');
const path = require('path');
const { mochaAsync, createRandomString } = require('../utils');
const { createApplication, closeApplication } = require('../application');
const { menuGoTo } = require('../menu.test');
const {
  HOME_MENU_ITEM_ID,
  SPACE_CARD_ID_BUILDER,
  SPACE_CARD_LINK_CLASS,
  LOAD_MENU_ITEM_ID,
  LOAD_MAIN_ID,
  LOAD_LOAD_BUTTON_ID,
  SPACE_EXPORT_BUTTON_CLASS,
  LOAD_INPUT_ID,
  SPACE_DELETE_BUTTON_CLASS,
  HOME_MAIN_ID,
} = require('../../src/config/selectors');
const {
  SPACE_ATOMIC_STRUCTURE,
  SPACE_ATOMIC_STRUCTURE_PATH,
  SPACE_ATOMIC_STRUCTURE_WITH_CHANGES,
  SPACE_ATOMIC_STRUCTURE_WITH_CHANGES_PATH,
  SPACE_ATOMIC_STRUCTURE_WITH_USER_INPUT,
  SPACE_ATOMIC_STRUCTURE_WITH_USER_INPUT_PATH,
} = require('../fixtures/spaces');
const {
  hasSavedSpaceLayout,
  visitAndSaveSpaceById,
} = require('./visitSpace.test');
const {
  TOOLTIP_FADE_OUT_PAUSE,
  INPUT_TYPE_PAUSE,
  LOAD_SPACE_PAUSE,
  EXPORT_SPACE_PAUSE,
  EXPORT_FILEPATH,
  DELETE_SPACE_PAUSE,
  OPEN_SAVED_SPACE_PAUSE,
} = require('../constants');

const loadSpaceById = async (client, space, filepath) => {
  const { id } = space;
  await menuGoTo(client, LOAD_MENU_ITEM_ID, LOAD_MAIN_ID);

  // input space id
  const absolutePath = path.resolve(__dirname, '../fixtures/spaces', filepath);
  await client.setValue(`#${LOAD_INPUT_ID}`, absolutePath);
  await client.pause(INPUT_TYPE_PAUSE);
  const value = await client.getValue(`#${LOAD_INPUT_ID}`);
  expect(value).to.equal(absolutePath);

  await client.click(`#${LOAD_LOAD_BUTTON_ID}`);
  await client.pause(LOAD_SPACE_PAUSE);

  // go to space
  await menuGoTo(client, HOME_MENU_ITEM_ID);

  await client.click(`#${SPACE_CARD_ID_BUILDER(id)} .${SPACE_CARD_LINK_CLASS}`);

  // this waiting time is longer to wait for tooltip to fade out
  await client.pause(OPEN_SAVED_SPACE_PAUSE);
};

describe('Load Space Scenarios', function() {
  this.timeout(270000);
  let app;

  afterEach(function() {
    return closeApplication(app);
  });

  describe('predefined export spaces', function() {
    beforeEach(
      mochaAsync(async () => {
        app = await createApplication();
      })
    );

    it(
      `Cannot load space with a non-zip file`,
      mochaAsync(async () => {
        const { client } = app;

        // load space
        await menuGoTo(client, LOAD_MENU_ITEM_ID, LOAD_MAIN_ID);

        await client.setValue(`#${LOAD_INPUT_ID}`, 'somefilepath');
        await client.pause(INPUT_TYPE_PAUSE);

        const loadButtonHtml = await client.getHTML(`#${LOAD_LOAD_BUTTON_ID}`);
        expect(loadButtonHtml).to.include('disabled');
      })
    );

    it(
      `Load space ${SPACE_ATOMIC_STRUCTURE.name}`,
      mochaAsync(async () => {
        const { client } = app;

        await loadSpaceById(
          client,
          SPACE_ATOMIC_STRUCTURE,
          SPACE_ATOMIC_STRUCTURE_PATH
        );

        await hasSavedSpaceLayout(client, SPACE_ATOMIC_STRUCTURE);
      })
    );

    it(
      `Load space ${SPACE_ATOMIC_STRUCTURE_WITH_USER_INPUT.name} with user input`,
      mochaAsync(async () => {
        const { client } = app;

        await loadSpaceById(
          client,
          SPACE_ATOMIC_STRUCTURE_WITH_USER_INPUT,
          SPACE_ATOMIC_STRUCTURE_WITH_USER_INPUT_PATH
        );

        await hasSavedSpaceLayout(
          client,
          SPACE_ATOMIC_STRUCTURE_WITH_USER_INPUT
        );
      })
    );

    it(
      `Cannot load already saved space of ${SPACE_ATOMIC_STRUCTURE.name}`,
      mochaAsync(async () => {
        const { id } = SPACE_ATOMIC_STRUCTURE;
        const { client } = app;

        // get space
        await visitAndSaveSpaceById(client, id);

        // load space
        await loadSpaceById(
          client,
          SPACE_ATOMIC_STRUCTURE_WITH_CHANGES,
          SPACE_ATOMIC_STRUCTURE_WITH_CHANGES_PATH
        );

        // go to space
        await menuGoTo(client, HOME_MENU_ITEM_ID);

        const savedSpacesHtml = await client.getHTML(`#${HOME_MAIN_ID}`);
        expect(savedSpacesHtml).to.not.include(
          SPACE_ATOMIC_STRUCTURE_WITH_CHANGES_PATH.name
        );
        await client.pause(OPEN_SAVED_SPACE_PAUSE);

        await client.click(
          `#${SPACE_CARD_ID_BUILDER(id)} .${SPACE_CARD_LINK_CLASS}`
        );
        // check content hasn't changed
        await hasSavedSpaceLayout(client, SPACE_ATOMIC_STRUCTURE);
      })
    );
  });

  it(
    `Load exported space of ${SPACE_ATOMIC_STRUCTURE.name}`,
    mochaAsync(async () => {
      const { id } = SPACE_ATOMIC_STRUCTURE;

      const filepath = `${EXPORT_FILEPATH}_${createRandomString()}.zip`;
      app = await createApplication({
        showSaveDialogResponse: filepath,
        showMessageDialogResponse: 1,
      });

      const { client } = app;

      // get space
      await visitAndSaveSpaceById(client, id);

      // export space
      await client.click(`.${SPACE_EXPORT_BUTTON_CLASS}`);
      await client.pause(EXPORT_SPACE_PAUSE);
      await client.pause(TOOLTIP_FADE_OUT_PAUSE);

      // delete space
      await client.click(`.${SPACE_DELETE_BUTTON_CLASS}`);
      await client.pause(DELETE_SPACE_PAUSE);

      // load space
      await loadSpaceById(client, SPACE_ATOMIC_STRUCTURE, filepath);

      // check content
      await hasSavedSpaceLayout(client, SPACE_ATOMIC_STRUCTURE);
    })
  );
});
