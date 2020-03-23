/* eslint-disable no-unused-expressions */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const { expect } = require('chai');
const fs = require('fs');
const { mochaAsync, createRandomString } = require('../utils');
const { createApplication, closeApplication } = require('../application');
const { menuGoTo } = require('../menu.test');
const {
  HOME_MENU_ITEM_ID,
  HOME_MAIN_ID,
  SPACE_CARD_ID_BUILDER,
  SPACE_EXPORT_BUTTON_CLASS,
} = require('../../src/config/selectors');
const { SPACE_ATOMIC_STRUCTURE } = require('../fixtures/spaces');
const { visitAndSaveSpaceById } = require('./visitSpace.test');
const { EXPORT_SPACE_PAUSE, EXPORT_FILEPATH } = require('../constants');

describe('Export a space', function() {
  this.timeout(270000);
  let app;

  afterEach(function() {
    return closeApplication(app);
  });

  it(
    'Exporting from toolbar saves space in local computer',
    mochaAsync(async () => {
      const { id } = SPACE_ATOMIC_STRUCTURE;

      const filepath = `${EXPORT_FILEPATH}_${createRandomString()}`;

      app = await createApplication({ showSaveDialogResponse: filepath });

      const { client } = app;

      await visitAndSaveSpaceById(client, id);

      await client.click(`.${SPACE_EXPORT_BUTTON_CLASS}`);
      await client.pause(EXPORT_SPACE_PAUSE);

      // check exported files locally
      expect(fs.existsSync(filepath)).to.be.true;
    })
  );
  it(
    'Exporting from card saves space in local computer',
    mochaAsync(async () => {
      const { id } = SPACE_ATOMIC_STRUCTURE;

      const filepath = `${EXPORT_FILEPATH}_${createRandomString()}`;
      app = await createApplication({ showSaveDialogResponse: filepath });

      const { client } = app;

      await visitAndSaveSpaceById(client, id);

      await menuGoTo(client, HOME_MENU_ITEM_ID, HOME_MAIN_ID);

      await client.click(
        `#${SPACE_CARD_ID_BUILDER(id)} .${SPACE_EXPORT_BUTTON_CLASS}`
      );
      await client.pause(EXPORT_SPACE_PAUSE);

      // check exported files locally
      expect(fs.existsSync(filepath)).to.be.true;
    })
  );
});
