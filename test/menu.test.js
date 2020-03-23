/* eslint-disable no-unused-expressions */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const { expect } = require('chai');
const { mochaAsync } = require('./utils');
const { createApplication, closeApplication } = require('./application');
const {
  DRAWER_BUTTON_ID,
  LOAD_MAIN_ID,
  LOAD_MENU_ITEM_ID,
  VISIT_MAIN_ID,
  VISIT_MENU_ITEM_ID,
  SETTINGS_MAIN_ID,
  SETTINGS_MENU_ITEM_ID,
  SPACE_NEARBY_MENU_ITEM_ID,
  SPACE_NEARBY_SPACE_GRID_ID,
  HOME_MENU_ITEM_ID,
  HOME_MAIN_ID,
} = require('../src/config/selectors');

const menuGoTo = async (client, menuItemId, elementToExpectId = null) => {
  // open menu if it is closed
  if (await client.isExisting(`#${DRAWER_BUTTON_ID}`)) {
    await client.click(`#${DRAWER_BUTTON_ID}`);
  }
  await client.pause(1000);
  await client.click(`#${menuItemId}`);
  if (elementToExpectId) {
    expect(await client.element(`#${elementToExpectId}`)).to.exist;
  }
  await client.pause(2000);
};

describe('Menu Scenarios', function() {
  this.timeout(20000);
  let app;

  before(
    mochaAsync(async () => {
      app = await createApplication();
    })
  );

  afterEach(function() {
    return closeApplication(app);
  });

  it(
    'MainMenu redirects to correct path',
    mochaAsync(async () => {
      const { client } = app;

      await menuGoTo(
        client,
        SPACE_NEARBY_MENU_ITEM_ID,
        SPACE_NEARBY_SPACE_GRID_ID
      );
      await menuGoTo(client, VISIT_MENU_ITEM_ID, VISIT_MAIN_ID);
      await menuGoTo(client, LOAD_MENU_ITEM_ID, LOAD_MAIN_ID);
      await menuGoTo(client, SETTINGS_MENU_ITEM_ID, SETTINGS_MAIN_ID);
      await menuGoTo(client, HOME_MENU_ITEM_ID, HOME_MAIN_ID);
    })
  );
});

module.exports = { menuGoTo };
