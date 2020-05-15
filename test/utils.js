/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import {
  LANGUAGE_SELECT_ID,
  GEOLOCATION_CONTROL_ID,
  DEVELOPER_SWITCH_ID,
  SYNC_MODE_SWITCH_ID,
  STUDENT_MODE_SWITCH_ID,
} from '../src/config/selectors';
import {
  SETTINGS_LOAD_PAUSE,
  LOAD_TAB_PAUSE,
  CLEAR_INPUT_PAUSE,
} from './constants';
import { SYNC_MODES } from '../src/config/constants';

export const mochaAsync = fn => {
  return done => {
    fn.call().then(done, err => {
      done(err);
    });
  };
};

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

// settings utils

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
