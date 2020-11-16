/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
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
} from '../src/config/selectors';
import {
  SETTINGS_LOAD_PAUSE,
  LOAD_TAB_PAUSE,
  CLEAR_INPUT_PAUSE,
  INPUT_TYPE_PAUSE,
  LOGIN_PAUSE,
  LOAD_PHASE_PAUSE,
} from './constants';
import {
  SYNC_MODES,
  DEFAULT_USER_MODE,
  USER_MODES,
} from '../src/config/constants';

/** util function to deal with asynchronous tests */
export const mochaAsync = (fn) => {
  return (done) => {
    fn.call().then(done, (err) => {
      done(err);
    });
  };
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

export const removeSpace = (text) => {
  return text.replace(/\s/g, '');
};

export const removeTags = (html) => {
  return html.replace(/<\/?[^>]+(>|$)/g, '');
};

export const removePathSeparators = (path) => {
  return path.replace(/[/\\]/g, '');
};

export const createRandomString = () => {
  return Math.random().toString(36).substring(7);
};

/** assertion util functions */

export const expectElementToNotExist = async (client, elementSelector) => {
  const found = await (await client.$(elementSelector)).isExisting();
  expect(found).to.be.false;
};

export const expectAnyElementToExist = async (client, elementSelectors) => {
  const foundElements = [];
  /* eslint-disable-next-line no-restricted-syntax */
  for (const selector of elementSelectors) {
    /* eslint-disable-next-line no-await-in-loop */
    const found = await (await client.$(selector)).isExisting();
    foundElements.push(found);
  }
  expect(foundElements).to.include(true);
};

export const expectElementToExist = async (client, elementSelector) => {
  const found = await (await client.$(elementSelector)).isExisting();
  if (!found) {
    // eslint-disable-next-line no-console
    console.log(`${elementSelector} is not found`);
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
  { name, mode = DEFAULT_USER_MODE },
  closeTour = false
) => {
  const input = await client.$(`#${LOGIN_USERNAME_INPUT_ID}`);
  await input.setValue(name);
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
  if (mode !== DEFAULT_USER_MODE) {
    if (mode === USER_MODES.TEACHER) {
      // open drawer to detect teacher icon
      await openDrawer(client);
      const drawerStudentIcon = await client.$(
        `#${DRAWER_HEADER_STUDENT_ICON_ID}`
      );
      const isStudent = await drawerStudentIcon.isExisting();
      if (isStudent) {
        await menuGoToSettings(client);
        await toggleStudentMode(client, mode);
      }
    }
  }
};
