/* eslint-disable no-unused-expressions */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable func-names */
import { expect } from 'chai';
import i18n from '../src/config/i18n';
import {
  mochaAsync,
  expectElementToNotExist,
  expectElementToExist,
  expectAnyElementToExist,
  toggleDeveloperMode,
  toggleGeolocationEnabled,
  toggleSyncAdvancedMode,
  changeLanguage,
  openDrawer,
  menuGoToSettings,
  menuGoToSavedSpaces,
  menuGoToDeveloper,
  menuGoToSpacesNearby,
  menuGoToSignOut,
  userSignIn,
} from './utils';
import { createApplication, closeApplication } from './application';
import {
  LANGUAGE_SELECT_ID,
  GEOLOCATION_CONTROL_ID,
  DEVELOPER_SWITCH_ID,
  DEVELOPER_MENU_ITEM_ID,
  SPACE_CARD_CLASS,
  SPACE_NOT_AVAILABLE_TEXT_ID,
  SYNC_MODE_SWITCH_ID,
  SPACE_SYNC_BUTTON_CLASS,
  buildSpaceCardId,
  SYNC_VISUAL_MAIN_ID,
  SYNC_ADVANCED_MAIN_ID,
  SYNC_CANCEL_BUTTON_ID,
  SETTINGS_TITLE_ID,
} from '../src/config/selectors';
import {
  DEFAULT_GLOBAL_TIMEOUT,
  LOAD_SPACE_PAUSE,
  LOAD_TAB_PAUSE,
  SYNC_OPEN_SCREEN_PAUSE,
} from './constants';
import {
  DEFAULT_LANGUAGE,
  DEFAULT_GEOLOCATION_ENABLED,
  DEFAULT_DEVELOPER_MODE,
  DEFAULT_SYNC_MODE,
  SYNC_MODES,
} from '../src/config/constants';
import { USER_GRAASP, USER_ALICE, USER_CEDRIC } from './fixtures/users';
import { settingsPerUser } from './fixtures/settings';
import { loadSpaceById } from './spaces/loadSpace.test';
import {
  SPACE_WITH_REMOVAL,
  SPACE_WITH_REMOVAL_PATH,
} from './fixtures/syncSpace';

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

const isSyncAdvancedModeSetTo = async (client, value) => {
  const mode = await client.getAttribute(
    `#${SYNC_MODE_SWITCH_ID} input`,
    'value'
  );
  const booleanToMode = JSON.parse(mode)
    ? SYNC_MODES.ADVANCED
    : SYNC_MODES.VISUAL;
  expect(booleanToMode).to.equal(value);
};

describe('Settings Scenarios', function () {
  this.timeout(DEFAULT_GLOBAL_TIMEOUT);
  let app;

  afterEach(function () {
    return closeApplication(app);
  });

  describe('Use graasp user', function () {
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

        await isSyncAdvancedModeSetTo(client, DEFAULT_SYNC_MODE);
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
          `#${SPACE_NOT_AVAILABLE_TEXT_ID}`,
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
        const settingsTitle = await (
          await client.$(`#${SETTINGS_TITLE_ID}`)
        ).getText();
        expect(settingsTitle).to.equal(i18n.t('Settings'));
        const languageSelectTitle = await (
          await client.$(`#${LANGUAGE_SELECT_ID} label`)
        ).getText();
        expect(languageSelectTitle).to.equal(i18n.t('Language'));
        const developerSwitchTitle = await (
          await client.$(`#${DEVELOPER_SWITCH_ID}`)
        ).getText();
        expect(developerSwitchTitle).to.equal(i18n.t('Developer Mode'));
        const geolocationEnabledControlTitle = await (
          await client.$(`#${GEOLOCATION_CONTROL_ID}`)
        ).getText();
        expect(geolocationEnabledControlTitle).to.equal(
          i18n.t('Geolocation Enabled')
        );

        await changeLanguage(client, 'fr');
        // update i18n locally
        await i18n.changeLanguage('fr');

        // check settings screen displays in english
        const settingsTitleFr = await (
          await client.$(`#${SETTINGS_TITLE_ID}`)
        ).getText();
        expect(settingsTitleFr).to.equal(i18n.t('Settings'));
        const languageSelectTitleFr = await (
          await client.$(`#${LANGUAGE_SELECT_ID} label`)
        ).getText();
        expect(languageSelectTitleFr).to.equal(i18n.t('Language'));
        const developerSwitchTitleFr = await (
          await client.$(`#${DEVELOPER_SWITCH_ID}`)
        ).getText();
        expect(developerSwitchTitleFr).to.equal(i18n.t('Developer Mode'));
        const geolocationEnabledControlTitleFr = await (
          await client.$(`#${GEOLOCATION_CONTROL_ID}`)
        ).getText();
        expect(geolocationEnabledControlTitleFr).to.equal(
          i18n.t('Geolocation Enabled')
        );
      })
    );

    it(
      'Enable Sync Advanced Mode displays Advanced Sync',
      mochaAsync(async () => {
        const { client } = app;
        const {
          space: { id },
        } = SPACE_WITH_REMOVAL;

        // init with a modified space
        await loadSpaceById(client, SPACE_WITH_REMOVAL_PATH);

        const syncButton = await client.$(
          `#${buildSpaceCardId(id)} .${SPACE_SYNC_BUTTON_CLASS}`
        );
        await syncButton.click();
        await client.pause(SYNC_OPEN_SCREEN_PAUSE);

        await expectElementToExist(client, `#${SYNC_VISUAL_MAIN_ID}`);

        // cancel sync and go to settings to enable sync advanced mode
        await (await client.$(`#${SYNC_CANCEL_BUTTON_ID}`)).click();
        await client.pause(LOAD_TAB_PAUSE);
        await menuGoToSettings(client);
        await toggleSyncAdvancedMode(client, true);

        // sync mode should be advanced
        await menuGoToSavedSpaces(client);

        await syncButton.click();
        await client.pause(SYNC_OPEN_SCREEN_PAUSE);

        await expectElementToExist(client, `#${SYNC_ADVANCED_MAIN_ID}`);
      })
    );
  });

  describe('Use multiple users', function () {
    beforeEach(
      mochaAsync(async () => {
        app = await createApplication();
      })
    );

    it(
      'Settings are saved for each user',
      mochaAsync(async () => {
        const { client } = app;
        const users = [USER_GRAASP, USER_ALICE, USER_CEDRIC];
        for (const user of users) {
          const {
            lang,
            developerMode,
            geolocationEnabled,
            syncMode,
          } = settingsPerUser[user.name];

          await userSignIn(client, user);

          await menuGoToSettings(client);

          // change settings to user's preferences
          await changeLanguage(client, lang);
          await toggleDeveloperMode(client, developerMode);
          await toggleGeolocationEnabled(client, geolocationEnabled);
          await toggleSyncAdvancedMode(client, syncMode);

          await menuGoToSavedSpaces(client);

          // check settings are saved
          await menuGoToSettings(client);
          await isLanguageSetTo(client, lang);
          await isDeveloperModeSetTo(client, developerMode);
          await isGeolocationEnabledSetTo(client, geolocationEnabled);
          await isSyncAdvancedModeSetTo(client, syncMode);

          await menuGoToSignOut(client);
        }

        // check settings are saved after logout
        for (const user of users) {
          const {
            lang,
            developerMode,
            geolocationEnabled,
            syncMode,
          } = settingsPerUser[user.name];

          await userSignIn(client, user);

          await menuGoToSettings(client);

          await isLanguageSetTo(client, lang);
          await isDeveloperModeSetTo(client, developerMode);
          await isGeolocationEnabledSetTo(client, geolocationEnabled);
          await isSyncAdvancedModeSetTo(client, syncMode);

          await menuGoToSignOut(client);
        }
      })
    );
  });
});
