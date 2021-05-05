/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import _ from 'lodash';
import {
  LANGUAGE_SELECT_ID,
  GEOLOCATION_CONTROL_ID,
  DEVELOPER_SWITCH_ID,
  SYNC_MODE_SWITCH_ID,
  STUDENT_MODE_SWITCH_ID,
  LOGIN_USERNAME_INPUT_ID,
  LOGIN_BUTTON_ID,
  LOAD_MENU_ITEM_ID,
  VISIT_MENU_ITEM_ID,
  SETTINGS_MENU_ITEM_ID,
  SPACES_NEARBY_MENU_ITEM_ID,
  HOME_MENU_ITEM_ID,
  DASHBOARD_MENU_ITEM_ID,
  DEVELOPER_MENU_ITEM_ID,
  SIGN_OUT_MENU_ITEM_ID,
  PHASE_MENU_LIST_ID,
  buildPhaseMenuItemId,
  SAVED_SPACES_MENU_ITEM_ID,
  CLASSROOMS_MENU_ITEM_ID,
  DRAWER_BUTTON_ID,
  TOUR_END_SELECTOR,
  DRAWER_HEADER_STUDENT_ICON_ID,
  buildSpaceCardId,
  SPACE_CARD_LINK_CLASS,
} from '../src/config/selectors';
import {
  SETTINGS_LOAD_PAUSE,
  LOAD_TAB_PAUSE,
  CLEAR_INPUT_PAUSE,
  INPUT_TYPE_PAUSE,
  LOGIN_PAUSE,
  LOAD_PHASE_PAUSE,
  OPEN_SAVED_SPACE_PAUSE,
} from './constants';
import {
  SYNC_MODES,
  DEFAULT_USER_MODE,
  USER_MODES,
  DEFAULT_SYNC_MODE,
  AUTHENTICATED,
} from '../src/config/constants';
import { USER_GRAASP } from './fixtures/users';

/** util function to deal with asynchronous tests */
export const mochaAsync = (fn) => (done) => {
  fn.call().then(done, (err) => {
    done(err);
  });
};

/** menu util functions */

export const openDrawer = async (client) => {
  const drawerButton = await client.$(`#${DRAWER_BUTTON_ID}`);
  if (await drawerButton.isClickable()) {
    await drawerButton.click();
  }
};

const menuGoTo = async (client, menuItemId) => {
  // open menu if it is closed
  await openDrawer(client);
  const menuItem = await client.$(`#${menuItemId}`);
  await menuItem.click();
};

export const menuGoToPhase = async (client, nb) => {
  await openDrawer(client);
  const phaseItem = await client.$(
    `#${PHASE_MENU_LIST_ID} li#${buildPhaseMenuItemId(nb)}`
  );
  await phaseItem.click();
  await client.pause(LOAD_PHASE_PAUSE);
};

export const menuGoToSettings = async (client, closeTour = false) => {
  await menuGoTo(client, SETTINGS_MENU_ITEM_ID);
  if (closeTour) {
    const tourEndButton = await client.$(TOUR_END_SELECTOR);
    if (await tourEndButton.isExisting()) {
      await tourEndButton.click();
    }
  }
};

export const menuGoToDeveloper = async (client) => {
  await menuGoTo(client, DEVELOPER_MENU_ITEM_ID);
};

export const menuGoToSpacesNearby = async (client) => {
  await menuGoTo(client, SPACES_NEARBY_MENU_ITEM_ID);
};

export const menuGoToVisitSpace = async (client) => {
  await menuGoTo(client, VISIT_MENU_ITEM_ID);
};

export const menuGoToLoadSpace = async (client) => {
  await menuGoTo(client, LOAD_MENU_ITEM_ID);
};

export const menuGoToDashboard = async (client) => {
  await menuGoTo(client, DASHBOARD_MENU_ITEM_ID);
};

export const menuGoToSignOut = async (client) => {
  await menuGoTo(client, SIGN_OUT_MENU_ITEM_ID);
};

export const menuGoToHome = async (client) => {
  await menuGoTo(client, HOME_MENU_ITEM_ID);
};

export const menuGoToSavedSpaces = async (client) => {
  await menuGoTo(client, SAVED_SPACES_MENU_ITEM_ID);
};

export const menuGoToClassrooms = async (client) => {
  await menuGoTo(client, CLASSROOMS_MENU_ITEM_ID);
};

/** string util functions */

export const removeSpace = (text) => text.replace(/\s/g, '');

export const removeTags = (html) => html.replace(/<\/?[^>]+(>|$)/g, '');

export const removePathSeparators = (path) => path.replace(/[/\\]/g, '');

export const createRandomString = () => Math.random().toString(36).substring(7);

/** assertion util functions */

export const expectElementToNotExist = async (
  client,
  containerSelector,
  elementSelector
) => {
  const found = await (await client.$(containerSelector)).getHTML();
  expect(found).to.not.contain(elementSelector);
};

export const expectAnyElementToExist = async (
  client,
  containerSelector,
  elementSelectors
) => {
  const foundElements = [];
  const content = await (await client.$(containerSelector)).getHTML();
  // eslint-disable-next-line no-restricted-syntax
  for (const selector of elementSelectors) {
    const found = content.includes(selector);
    foundElements.push(found);
  }
  expect(foundElements).to.include(true);
};

export const expectElementToExist = async (client, elementSelector) => {
  const found = await (await client.$(elementSelector)).isExisting();
  if (!found) {
    console.error(`${elementSelector} is not found`);
  }
  expect(found).to.be.true;
};

export const clearInput = async (client, selector) => {
  const input = await client.$(selector);
  const value = await input.getValue();
  const backSpaces = new Array(value.length).fill('Backspace');
  await input.setValue(backSpaces);
  await client.pause(CLEAR_INPUT_PAUSE);
};

/** settings utils */

export const changeLanguage = async (client, value) => {
  const languageInput = await client.$(`#${LANGUAGE_SELECT_ID} input`);
  const lang = await languageInput.getAttribute('value');
  if (lang !== value) {
    await (await client.$(`#${LANGUAGE_SELECT_ID}`)).click();
    await (await client.$(`[data-value='${value}']`)).click();
    await client.pause(LOAD_TAB_PAUSE);
  }
};

// todo: remove
export const toggleGeolocationEnabled = async (client, value) => {
  const geolocationEnabledSelector = await client.$(
    `#${GEOLOCATION_CONTROL_ID} input`
  );
  const geolocationEnabled = await geolocationEnabledSelector.getAttribute(
    'value'
  );
  if (JSON.parse(geolocationEnabled) !== value) {
    await geolocationEnabledSelector.click();
    await client.pause(SETTINGS_LOAD_PAUSE);
  }
};

export const toggleDeveloperMode = async (client, value) => {
  const developerSwitchSelector = await client.$(
    `#${DEVELOPER_SWITCH_ID} input`
  );
  const developerMode = await developerSwitchSelector.getAttribute('value');
  if (JSON.parse(developerMode) !== value) {
    await developerSwitchSelector.click();
    await client.pause(SETTINGS_LOAD_PAUSE);
  }
};

export const toggleStudentMode = async (client, value) => {
  const switchSelector = await client.$(`#${STUDENT_MODE_SWITCH_ID} input`);
  const userMode = await switchSelector.getAttribute('value');
  if (JSON.parse(userMode) !== value) {
    await switchSelector.click();
    await client.pause(SETTINGS_LOAD_PAUSE);
  }
};

export const toggleSyncAdvancedMode = async (client, value) => {
  const syncAdvancedModeSwitchSelector = await client.$(
    `#${SYNC_MODE_SWITCH_ID} input`
  );
  const syncAdvancedMode = await syncAdvancedModeSwitchSelector.getAttribute(
    'value'
  );
  const booleanToMode = JSON.parse(syncAdvancedMode)
    ? SYNC_MODES.ADVANCED
    : SYNC_MODES.VISUAL;
  if (booleanToMode !== value) {
    await syncAdvancedModeSwitchSelector.click();
    await client.pause(SETTINGS_LOAD_PAUSE);
  }
};

/** sign in util function */
export const userSignIn = async (
  client,
  { username, settings: { userMode = DEFAULT_USER_MODE } },
  closeTour = false
) => {
  const input = await client.$(`#${LOGIN_USERNAME_INPUT_ID}`);
  await input.setValue(username);
  await client.pause(INPUT_TYPE_PAUSE);
  const button = await client.$(`#${LOGIN_BUTTON_ID}`);
  await button.click();
  await client.pause(LOGIN_PAUSE);
  if (closeTour) {
    const tourEndButton = await client.$(TOUR_END_SELECTOR);
    if (await tourEndButton.isExisting()) {
      await tourEndButton.click();
    }
  }
  // change mode if it is not default mode
  if (userMode !== DEFAULT_USER_MODE) {
    if (userMode === USER_MODES.TEACHER) {
      // open drawer to detect teacher icon
      await openDrawer(client);
      const drawerStudentIcon = await client.$(
        `#${DRAWER_HEADER_STUDENT_ICON_ID}`
      );
      const isStudent = await drawerStudentIcon.isExisting();
      if (isStudent) {
        await menuGoToSettings(client);
        await toggleStudentMode(client, userMode);
      }
    }
  }
};

export const clickOnSpaceCard = async (client, id) => {
  const spaceCardLink = await client.$(
    `#${buildSpaceCardId(id)} .${SPACE_CARD_LINK_CLASS}`
  );
  await spaceCardLink.click();
  await client.pause(OPEN_SAVED_SPACE_PAUSE);
};

export const buildSignedInUserForDatabase = ({
  syncMode = DEFAULT_SYNC_MODE,
} = {}) => ({
  users: [USER_GRAASP],
  user: {
    id: USER_GRAASP.id,
    username: USER_GRAASP.username,
    createdAt: '2020-11-23T14:54:49.092Z',
    anonymous: false,
    geolocation: null, // todo: remove
    settings: {
      lang: 'en',
      developerMode: false,
      geolocationEnabled: false, // todo: remove
      syncMode,
      userMode: USER_GRAASP?.settings?.userMode || DEFAULT_USER_MODE,
      actionAccessibility: false,
      actionsEnabled: true,
    },
    favoriteSpaces: [],
    recentSpaces: [],
    tour: {
      visitSpace: true,
      settings: true,
    },
    lastSignIn: '2020-11-23T14:54:49.092Z',
    authenticated: AUTHENTICATED,
  },
});

// check necessary property for a space
// remove asset field from item (it is an offline property)
export const prepareSpaceForApi = (json) => {
  // depending on the space fixture, we use the space property
  const space = _.cloneDeep(json?.space || json);

  // id is necessary
  if (!space.id) {
    throw new Error('The mocked space requires an id.');
  }

  space.saved = false;

  space.phases = space.phases.map((phase) => {
    const newPhase = _.cloneDeep(phase);
    newPhase.items = newPhase.items.map((item) => {
      const newItem = _.cloneDeep(item);
      newItem.asset = null;
      return newItem;
    });
    return newPhase;
  });

  return space;
};
