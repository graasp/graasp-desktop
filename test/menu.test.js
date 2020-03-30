/* eslint-disable no-unused-expressions */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { expect } from 'chai';
import { mochaAsync } from './utils';
import { createApplication, closeApplication } from './application';
import {
  DRAWER_BUTTON_ID,
  LOAD_MAIN_ID,
  LOAD_MENU_ITEM_ID,
  VISIT_MAIN_ID,
  VISIT_MENU_ITEM_ID,
  SETTINGS_MAIN_ID,
  SETTINGS_MENU_ITEM_ID,
  SPACES_NEARBY_MENU_ITEM_ID,
  SPACES_NEARBY_MAIN_ID,
  HOME_MENU_ITEM_ID,
  HOME_MAIN_ID,
  DASHBOARD_MAIN_ID,
  DASHBOARD_MENU_ITEM_ID,
  DEVELOPER_MENU_ITEM_ID,
  DEVELOPER_MAIN_ID,
} from '../src/config/selectors';
import {
  LOAD_TAB_PAUSE,
  DEFAULT_GLOBAL_TIMEOUT,
  OPEN_DRAWER_PAUSE,
} from './constants';

export const openDrawer = async client => {
  if (await client.isVisible(`#${DRAWER_BUTTON_ID}`)) {
    await client.click(`#${DRAWER_BUTTON_ID}`);
  }
  await client.pause(OPEN_DRAWER_PAUSE);
};

const menuGoTo = async (client, menuItemId, elementToExpectId = null) => {
  // open menu if it is closed
  await openDrawer(client);
  await client.click(`#${menuItemId}`);
  if (elementToExpectId) {
    expect(await client.isExisting(`#${elementToExpectId}`)).to.be.true;
  }
  await client.pause(LOAD_TAB_PAUSE);
};

export const menuGoToSettings = async client => {
  await menuGoTo(client, SETTINGS_MENU_ITEM_ID, SETTINGS_MAIN_ID);
};

export const menuGoToDeveloper = async client => {
  await menuGoTo(client, DEVELOPER_MENU_ITEM_ID, DEVELOPER_MAIN_ID);
};

export const menuGoToSpacesNearby = async client => {
  await menuGoTo(client, SPACES_NEARBY_MENU_ITEM_ID, SPACES_NEARBY_MAIN_ID);
};

export const menuGoToVisitSpace = async client => {
  await menuGoTo(client, VISIT_MENU_ITEM_ID, VISIT_MAIN_ID);
};

export const menuGoToLoadSpace = async client => {
  await menuGoTo(client, LOAD_MENU_ITEM_ID, LOAD_MAIN_ID);
};

export const menuGoToDashboard = async client => {
  await menuGoTo(client, DASHBOARD_MENU_ITEM_ID, DASHBOARD_MAIN_ID);
};

export const menuGoToHome = async client => {
  await menuGoTo(client, HOME_MENU_ITEM_ID, HOME_MAIN_ID);
};

describe('Menu Scenarios', function() {
  this.timeout(DEFAULT_GLOBAL_TIMEOUT);
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

      await menuGoToSpacesNearby(client);
      await menuGoToVisitSpace(client);
      await menuGoToLoadSpace(client);
      await menuGoToSettings(client);
      await menuGoToDashboard(client);
      await menuGoToHome(client);
    })
  );
});
