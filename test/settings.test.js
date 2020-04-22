/* eslint-disable no-unused-expressions */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { expect } from 'chai';
import i18n from '../src/config/i18n';
import {
  mochaAsync,
  expectElementToNotExist,
  expectElementToExist,
  expectAnyElementToExist,
} from './utils';
import { createApplication, closeApplication } from './application';
import {
  SETTINGS_MAIN_ID,
  LANGUAGE_SELECT_ID,
  GEOLOCATION_CONTROL_ID,
  DEVELOPER_SWITCH_ID,
  DEVELOPER_MENU_ITEM_ID,
  SPACE_CARD_CLASS,
  SPACE_NOT_AVAILABLE_TEXT_CLASS,
  SYNC_ADVANCED_MODE_SWITCH_ID,
} from '../src/config/selectors';
import {
  DEFAULT_GLOBAL_TIMEOUT,
  SETTINGS_LOAD_PAUSE,
  LOAD_SPACE_PAUSE,
  LOAD_TAB_PAUSE,
} from './constants';
import {
  openDrawer,
  menuGoToSettings,
  menuGoToHome,
  menuGoToDeveloper,
  menuGoToSpacesNearby,
  menuGoToSignOut,
} from './menu.test';
import {
  DEFAULT_LANGUAGE,
  DEFAULT_GEOLOCATION_ENABLED,
  DEFAULT_DEVELOPER_MODE,
} from '../src/config/constants';
import { userSignIn } from './userSignIn.test';
import { USER_GRAASP, USER_ALICE, USER_BOB } from './fixtures/users';
import { settingsPerUser } from './fixtures/settings';

const changeLanguage = async (client, value) => {
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

const toggleGeolocationEnabled = async (client, value) => {
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

const toggleDeveloperMode = async (client, value) => {
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

// eslint-disable-next-line import/prefer-default-export
export const toggleSyncAdvancedMode = async (client, value) => {
  const syncAdvancedModeSwitchSelector = `#${SYNC_ADVANCED_MODE_SWITCH_ID} input`;
  const syncAdvancedMode = await client.getAttribute(
    syncAdvancedModeSwitchSelector,
    'value'
  );
  if (JSON.parse(syncAdvancedMode) !== value) {
    await client.click(syncAdvancedModeSwitchSelector);
    await client.pause(SETTINGS_LOAD_PAUSE);
  }
};

const isLanguageSetTo = async (client, value) => {
  const lang = await client.getAttribute(
    `#${LANGUAGE_SELECT_ID} input`,
    'value'
  );
  expect(lang).to.equal(value);
};

const isGeolocationEnabledSetTo = async (client, value) => {
  const geolocationEnabled = await client.getAttribute(
    `#${GEOLOCATION_CONTROL_ID} input`,
    'value'
  );
  expect(JSON.parse(geolocationEnabled)).to.equal(value);
};

const isDeveloperModeSetTo = async (client, value) => {
  const developer = await client.getAttribute(
    `#${DEVELOPER_SWITCH_ID} input`,
    'value'
  );
  expect(JSON.parse(developer)).to.equal(value);
};

describe('Settings Scenarios', function() {
  this.timeout(DEFAULT_GLOBAL_TIMEOUT);
  let app;

  afterEach(function() {
    return closeApplication(app);
  });

  describe('Use graasp user', function() {
    beforeEach(
      mochaAsync(async () => {
        app = await createApplication();
        await userSignIn(app.client, USER_GRAASP);
      })
    );

    it(
      'Settings default layout',
      mochaAsync(async () => {
        const { client } = app;

        await menuGoToSettings(client);

        await isLanguageSetTo(client, DEFAULT_LANGUAGE);

        await isGeolocationEnabledSetTo(client, DEFAULT_GEOLOCATION_ENABLED);

        await isDeveloperModeSetTo(client, DEFAULT_DEVELOPER_MODE);
      })
    );

    it(
      'Enable Developer Mode activates corresponding menu item',
      mochaAsync(async () => {
        const { client } = app;

        // check developer mode tab doesn't exist
        await openDrawer(client);
        await expectElementToNotExist(client, `#${DEVELOPER_MENU_ITEM_ID}`);

        // enable developer mode, check tab exist
        await menuGoToSettings(client);
        await toggleDeveloperMode(client, true);

        await menuGoToDeveloper(client);
      })
    );

    it(
      'Enable Geolocation displays Spaces Nearby',
      mochaAsync(async () => {
        const { client } = app;

        // check geolocation button shows in Spaces Nearby
        await menuGoToSpacesNearby(client);
        await expectElementToExist(client, `#${GEOLOCATION_CONTROL_ID}`);

        // enable spaces nearby
        await menuGoToSettings(client);
        await toggleGeolocationEnabled(client, true);

        await menuGoToSpacesNearby(client);

        // make sure spaces are loaded
        await client.pause(LOAD_SPACE_PAUSE);

        // geolocation button should not exist
        await expectElementToNotExist(client, `#${GEOLOCATION_CONTROL_ID}`);

        // spaces should be displayed
        await expectAnyElementToExist(client, [
          `.${SPACE_CARD_CLASS}`,
          `#${SPACE_NOT_AVAILABLE_TEXT_CLASS}`,
        ]);
      })
    );

    it(
      'Change Language updates application with translations (settings only)',
      mochaAsync(async () => {
        const { client } = app;

        // check false setting
        await menuGoToSettings(client);

        // check settings screen displays in english
        const settingsTitle = await client.getText(`#${SETTINGS_MAIN_ID} h5`);
        expect(settingsTitle).to.equal(i18n.t('Settings'));
        const languageSelectTitle = await client.getText(
          `#${LANGUAGE_SELECT_ID} label`
        );
        expect(languageSelectTitle).to.equal(i18n.t('Language'));
        const developerSwitchTitle = await client.getText(
          `#${DEVELOPER_SWITCH_ID}`
        );
        expect(developerSwitchTitle).to.equal(i18n.t('Developer Mode'));
        const geolocationEnabledControlTitle = await client.getText(
          `#${GEOLOCATION_CONTROL_ID}`
        );
        expect(geolocationEnabledControlTitle).to.equal(
          i18n.t('Geolocation Enabled')
        );

        await changeLanguage(client, 'fr');
        // update i18n locally
        await i18n.changeLanguage('fr');

        // check settings screen displays in english
        const settingsTitleFr = await client.getText(`#${SETTINGS_MAIN_ID} h5`);
        expect(settingsTitleFr).to.equal(i18n.t('Settings'));
        const languageSelectTitleFr = await client.getText(
          `#${LANGUAGE_SELECT_ID} label`
        );
        expect(languageSelectTitleFr).to.equal(i18n.t('Language'));
        const developerSwitchTitleFr = await client.getText(
          `#${DEVELOPER_SWITCH_ID}`
        );
        expect(developerSwitchTitleFr).to.equal(i18n.t('Developer Mode'));
        const geolocationEnabledControlTitleFr = await client.getText(
          `#${GEOLOCATION_CONTROL_ID}`
        );
        expect(geolocationEnabledControlTitleFr).to.equal(
          i18n.t('Geolocation Enabled')
        );
      })
    );
  });

  describe('Use multiple users', function() {
    beforeEach(
      mochaAsync(async () => {
        app = await createApplication();
      })
    );

    it(
      'Settings are saved for each user',
      mochaAsync(async () => {
        const { client } = app;
        const users = [USER_GRAASP, USER_ALICE, USER_BOB];
        for (const user of users) {
          const { lang, developerMode, geolocationEnabled } = settingsPerUser[
            user.name
          ];

          await userSignIn(client, user);

          await menuGoToSettings(client);

          // change settings to user's preferences
          await changeLanguage(client, lang);
          await toggleDeveloperMode(client, developerMode);
          await toggleGeolocationEnabled(client, geolocationEnabled);

          await menuGoToHome(client);

          // check settings are saved
          await menuGoToSettings(client);
          await isLanguageSetTo(client, lang);
          await isDeveloperModeSetTo(client, developerMode);
          await isGeolocationEnabledSetTo(client, geolocationEnabled);

          await menuGoToSignOut(client);
        }

        // check settings are saved after logout
        for (const user of users) {
          const { lang, developerMode, geolocationEnabled } = settingsPerUser[
            user.name
          ];

          await userSignIn(client, user);

          await menuGoToSettings(client);

          await isLanguageSetTo(client, lang);
          await isDeveloperModeSetTo(client, developerMode);
          await isGeolocationEnabledSetTo(client, geolocationEnabled);

          await menuGoToSignOut(client);
        }
      })
    );
  });
});
