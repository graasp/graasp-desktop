/* eslint-disable no-unused-expressions */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { expect } from 'chai';
import i18n from '../src/config/i18n';
import {
  mochaAsync,
  expectElementToNotExist,
  expectElementToExist,
  expectEitherElementsToExist,
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
  menuGoToDeveloper,
  menuGoToSpacesNearby,
} from './menu.test';
import {
  DEFAULT_LANGUAGE,
  DEFAULT_GEOLOCATION_ENABLED,
  DEFAULT_DEVELOPER_MODE,
} from '../src/config/constants';

describe('Settings Scenarios', function() {
  this.timeout(DEFAULT_GLOBAL_TIMEOUT);
  let app;

  beforeEach(
    mochaAsync(async () => {
      app = await createApplication();
    })
  );

  afterEach(function() {
    return closeApplication(app);
  });

  it(
    'Settings default layout',
    mochaAsync(async () => {
      const { client } = app;

      await menuGoToSettings(client);

      const lang = await client.getAttribute(
        `#${LANGUAGE_SELECT_ID} input`,
        'value'
      );
      expect(lang).to.equal(DEFAULT_LANGUAGE);

      const geolocationEnabled = await client.getAttribute(
        `#${GEOLOCATION_CONTROL_ID} input`,
        'value'
      );
      expect(JSON.parse(geolocationEnabled)).to.equal(
        DEFAULT_GEOLOCATION_ENABLED
      );

      const developer = await client.getAttribute(
        `#${DEVELOPER_SWITCH_ID} input`,
        'value'
      );
      expect(JSON.parse(developer)).to.equal(DEFAULT_DEVELOPER_MODE);
    })
  );

  it(
    'Enable Developer Mode activates corresponding menu item',
    mochaAsync(async () => {
      const { client } = app;
      const developerSwitchSelector = `#${DEVELOPER_SWITCH_ID} input`;

      // check developer mode tab doesn't exist
      await openDrawer(client);
      await expectElementToNotExist(client, `#${DEVELOPER_MENU_ITEM_ID}`);

      // enable developer mode, check tab exist
      await menuGoToSettings(client);
      await client.click(developerSwitchSelector);
      await client.pause(SETTINGS_LOAD_PAUSE);

      await menuGoToDeveloper(client);
    })
  );

  it(
    'Enable Geolocation displays Spaces Nearby',
    mochaAsync(async () => {
      const { client } = app;
      const geolocationEnabledSelector = `#${GEOLOCATION_CONTROL_ID} input`;

      // check geolocation button shows in Spaces Nearby
      await menuGoToSpacesNearby(client);
      await expectElementToExist(client, `#${GEOLOCATION_CONTROL_ID}`);

      // enable spaces nearby
      await menuGoToSettings(client);
      await client.click(geolocationEnabledSelector);
      await client.pause(SETTINGS_LOAD_PAUSE);

      await menuGoToSpacesNearby(client);

      // make sure spaces are loaded
      await client.pause(LOAD_SPACE_PAUSE);

      // geolocation button should not exist
      await expectElementToNotExist(client, `#${GEOLOCATION_CONTROL_ID}`);

      // spaces should be displayed
      await expectEitherElementsToExist(client, [
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

      await client.click(`#${LANGUAGE_SELECT_ID}`);
      await client.pause(1000);
      await client.click(`[data-value='fr']`);
      await client.pause(LOAD_TAB_PAUSE);

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
