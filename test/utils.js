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
  SIGN_OUT_MENU_ITEM_ID,
  PHASE_MENU_LIST_ID,
  buildPhaseMenuItemId,
  SAVED_SPACES_MENU_ITEM_ID,
  SAVED_SPACES_MAIN_ID,
  CLASSROOMS_MAIN_ID,
  CLASSROOMS_MENU_ITEM_ID,
  DRAWER_BUTTON_ID,
  DRAWER_HEADER_TEACHER_ICON_ID,
  TOUR_END_SELECTOR,
} from '../src/config/selectors';
import {
  SETTINGS_LOAD_PAUSE,
  LOAD_TAB_PAUSE,
  CLEAR_INPUT_PAUSE,
  INPUT_TYPE_PAUSE,
  LOGIN_PAUSE,
  OPEN_DRAWER_PAUSE,
  LOAD_PHASE_PAUSE,
} from './constants';
import {
  SYNC_MODES,
  DEFAULT_USER_MODE,
  USER_MODES,
} from '../src/config/constants';

/** util function to deal with asynchronous tests */
export const mochaAsync = fn => {
  return done => {
    fn.call().then(done, err => {
      done(err);
    });
  };
};

/** menu util functions */

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

export const menuGoToPhase = async (client, nb) => {
  await openDrawer(client);
  await client.click(`#${PHASE_MENU_LIST_ID} li#${buildPhaseMenuItemId(nb)}`);
  await client.pause(LOAD_PHASE_PAUSE);
};

export const menuGoToSettings = async client => {
  await menuGoTo(client, SETTINGS_MENU_ITEM_ID, SETTINGS_MAIN_ID);
  await client.click(TOUR_END_SELECTOR);
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

export const menuGoToSignOut = async client => {
  await menuGoTo(client, SIGN_OUT_MENU_ITEM_ID);
};

export const menuGoToHome = async client => {
  await menuGoTo(client, HOME_MENU_ITEM_ID, HOME_MAIN_ID);
};

export const menuGoToSavedSpaces = async client => {
  await menuGoTo(client, SAVED_SPACES_MENU_ITEM_ID, SAVED_SPACES_MAIN_ID);
};

export const menuGoToClassrooms = async client => {
  await menuGoTo(client, CLASSROOMS_MENU_ITEM_ID, CLASSROOMS_MAIN_ID);
};

/** string util functions */

export const removeSpace = text => {
  return text.replace(/\s/g, '');
};

export const removeTags = html => {
  return html.replace(/<\/?[^>]+(>|$)/g, '');
};

export const createRandomString = () => {
  return Math.random()
    .toString(36)
    .substring(7);
};

/** assertion util functions */

export const expectElementToNotExist = async (client, elementSelector) => {
  const found = await client.isExisting(elementSelector);
  expect(found).to.be.false;
};

export const expectAnyElementToExist = async (client, elementSelectors) => {
  const foundElements = [];
  /* eslint-disable-next-line no-restricted-syntax */
  for (const selector of elementSelectors) {
    /* eslint-disable-next-line no-await-in-loop */
    const found = await client.isExisting(selector);
    foundElements.push(found);
  }
  expect(foundElements).to.include(true);
};

export const expectElementToExist = async (client, elementSelector) => {
  const found = await client.isExisting(elementSelector);
  if (!found) {
    console.log(`${elementSelector} is not found`);
  }
  expect(found).to.be.true;
};

export const clearInput = async (client, selector) => {
  const value = await client.getValue(selector);
  const backSpaces = new Array(value.length).fill('Backspace');
  await client.setValue(selector, backSpaces);
  await client.pause(CLEAR_INPUT_PAUSE);
};

/** settings utils */

export const changeLanguage = async (client, value) => {
  const lang = await client.getAttribute(
    `#${LANGUAGE_SELECT_ID} input`,
    'value'
  );
  if (lang !== value) {
    await client.click(`#${LANGUAGE_SELECT_ID}`);
    await client.pause(1000);
    await client.click(`[data-value='${value}']`);
    await client.pause(LOAD_TAB_PAUSE);
  }
};

export const toggleGeolocationEnabled = async (client, value) => {
  const geolocationEnabledSelector = `#${GEOLOCATION_CONTROL_ID} input`;
  const geolocationEnabled = await client.getAttribute(
    geolocationEnabledSelector,
    'value'
  );
  if (JSON.parse(geolocationEnabled) !== value) {
    await client.click(geolocationEnabledSelector);
    await client.pause(SETTINGS_LOAD_PAUSE);
  }
};

export const toggleDeveloperMode = async (client, value) => {
  const developerSwitchSelector = `#${DEVELOPER_SWITCH_ID} input`;
  const developerMode = await client.getAttribute(
    developerSwitchSelector,
    'value'
  );
  if (JSON.parse(developerMode) !== value) {
    await client.click(developerSwitchSelector);
    await client.pause(SETTINGS_LOAD_PAUSE);
  }
};

export const toggleStudentMode = async (client, value) => {
  const switchSelector = `#${STUDENT_MODE_SWITCH_ID} input`;
  const userMode = await client.getAttribute(switchSelector, 'value');
  if (JSON.parse(userMode) !== value) {
    await client.click(switchSelector);
    await client.pause(SETTINGS_LOAD_PAUSE);
  }
};

export const toggleSyncAdvancedMode = async (client, value) => {
  const syncAdvancedModeSwitchSelector = `#${SYNC_MODE_SWITCH_ID} input`;
  const syncAdvancedMode = await client.getAttribute(
    syncAdvancedModeSwitchSelector,
    'value'
  );
  const booleanToMode = JSON.parse(syncAdvancedMode)
    ? SYNC_MODES.ADVANCED
    : SYNC_MODES.VISUAL;
  if (booleanToMode !== value) {
    await client.click(syncAdvancedModeSwitchSelector);
    await client.pause(SETTINGS_LOAD_PAUSE);
  }
};

/** sign in util function */
export const userSignIn = async (
  client,
  { name, mode = DEFAULT_USER_MODE },
  closeTour = true
) => {
  await client.setValue(`#${LOGIN_USERNAME_INPUT_ID}`, name);
  await client.pause(INPUT_TYPE_PAUSE);
  await client.click(`#${LOGIN_BUTTON_ID}`);
  await client.pause(LOGIN_PAUSE);
  if (closeTour) {
    await client.click(TOUR_END_SELECTOR);
  }
  // change mode if it is not default mode
  if (mode !== DEFAULT_USER_MODE) {
    if (mode === USER_MODES.TEACHER) {
      // open drawer to detect teacher icon
      await openDrawer(client);
      const isTeacher = await client.isExisting(
        `#${DRAWER_HEADER_TEACHER_ICON_ID}`
      );
      if (!isTeacher) {
        await menuGoToSettings(client);
        await toggleStudentMode(client, mode);
      }
    }
  }
};
