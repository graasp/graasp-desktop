/* eslint-disable no-unused-expressions */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable func-names */
import { expect } from 'chai';
import fs from 'fs';
import {
  mochaAsync,
  createRandomString,
  expectElementToExist,
  menuGoToSavedSpaces,
  menuGoToPhase,
  userSignIn,
} from '../utils';
import { createApplication, closeApplication } from '../application';
import {
  buildSpaceCardId,
  SPACE_EXPORT_BUTTON_CLASS,
  EXPORT_SPACE_BUTTON_ID,
  buildCheckboxLabel,
  EXPORT_SPACE_BACK_BUTTON_ID,
} from '../../src/config/selectors';
import { SPACE_ATOMIC_STRUCTURE } from '../fixtures/spaces';
import { visitAndSaveSpaceById } from './visitSpace.test';
import {
  EXPORT_SPACE_PAUSE,
  EXPORT_FILEPATH,
  DEFAULT_GLOBAL_TIMEOUT,
  EXPORT_SELECTION_SPACE_PAUSE,
  TOOLTIP_FADE_OUT_PAUSE,
  OPEN_SAVED_SPACE_PAUSE,
} from '../constants';
import { USER_GRAASP } from '../fixtures/users';
import { typeInTextInputApp } from '../apps/textInputApp';

// eslint-disable-next-line import/prefer-default-export
export const exportSpaceWithSelected = async (
  client,
  { actions = true, resources = true } = {}
) => {
  const actionsCheckbox = await client.$(`input[name="actions"]`);
  const isActionsChecked = await actionsCheckbox.getAttribute('checked');
  if (Boolean(isActionsChecked) !== actions) {
    await (await client.$(`#${buildCheckboxLabel('actions')}`)).click();
  }

  const resourcesCheckbox = await client.$(
    `input[name="appInstanceResources"]`
  );
  const isResourcesChecked = await resourcesCheckbox.getAttribute('checked');
  if (Boolean(isResourcesChecked) !== resources) {
    await (
      await client.$(`#${buildCheckboxLabel('appInstanceResources')}`)
    ).click();
  }

  const exportButton = await client.$(`#${EXPORT_SPACE_BUTTON_ID}`);
  await exportButton.click();
  await client.pause(TOOLTIP_FADE_OUT_PAUSE);
};

const checkExportSelectionLayout = async (
  client,
  { resources = false, actions = false } = {}
) => {
  const actionsCheckboxSelector = `input[name="actions"]`;
  const resourcesCheckboxSelector = `input[name="appInstanceResources"]`;
  await expectElementToExist(client, actionsCheckboxSelector);
  await expectElementToExist(client, resourcesCheckboxSelector);

  const actionsCheckbox = await client.$(actionsCheckboxSelector);
  const resourcesCheckbox = await client.$(resourcesCheckboxSelector);

  const isActionsChecked = await actionsCheckbox.getAttribute('checked');
  expect(Boolean(isActionsChecked)).to.equal(actions);
  const isActionsDisabled = await actionsCheckbox.getAttribute('disabled');
  expect(Boolean(isActionsDisabled)).to.equal(!actions);

  const isResourcesChecked = await resourcesCheckbox.getAttribute('checked');
  expect(Boolean(isResourcesChecked) || false).to.equal(resources);
  const isResourcesDisabled = await resourcesCheckbox.getAttribute('disabled');
  expect(Boolean(isResourcesDisabled)).to.equal(!resources);
};

describe('Export a space', function () {
  this.timeout(DEFAULT_GLOBAL_TIMEOUT);
  let app;

  afterEach(function () {
    return closeApplication(app);
  });

  describe('General', function () {
    it(
      'Exporting from toolbar saves space in local computer',
      mochaAsync(async () => {
        const {
          space: { id },
        } = SPACE_ATOMIC_STRUCTURE;

        const filepath = `${EXPORT_FILEPATH}_${createRandomString()}`;

        app = await createApplication({ showSaveDialogResponse: filepath });

        const { client } = app;

        await userSignIn(client, USER_GRAASP);

        await visitAndSaveSpaceById(client, id);

        const exportButton = await client.$(`.${SPACE_EXPORT_BUTTON_CLASS}`);
        await exportButton.click();
        await client.pause(EXPORT_SELECTION_SPACE_PAUSE);

        await exportSpaceWithSelected(client);

        // check exported files locally
        expect(fs.existsSync(filepath)).to.be.true;
      })
    );

    it(
      'Exporting from card saves space in local computer',
      mochaAsync(async () => {
        const {
          space: { id },
        } = SPACE_ATOMIC_STRUCTURE;

        const filepath = `${EXPORT_FILEPATH}_${createRandomString()}`;
        app = await createApplication({ showSaveDialogResponse: filepath });

        const { client } = app;

        await userSignIn(client, USER_GRAASP);

        await visitAndSaveSpaceById(client, id);

        await menuGoToSavedSpaces(client);

        const exportButton = await client.$(
          `#${buildSpaceCardId(id)} .${SPACE_EXPORT_BUTTON_CLASS}`
        );
        await exportButton.click();
        await client.pause(EXPORT_SELECTION_SPACE_PAUSE);

        // back and export again
        const backButton = await client.$(`#${EXPORT_SPACE_BACK_BUTTON_ID}`);
        await backButton.click();
        await client.pause(OPEN_SAVED_SPACE_PAUSE);
        await exportButton.click();
        await client.pause(EXPORT_SELECTION_SPACE_PAUSE);

        await exportSpaceWithSelected(client);

        // check exported files locally
        expect(fs.existsSync(filepath)).to.be.true;
      })
    );
  });

  describe('Can export space, actions and resources if exists', function () {
    it(
      'space only',
      mochaAsync(async () => {
        const {
          space: { id },
        } = SPACE_ATOMIC_STRUCTURE;

        const filepath = `${EXPORT_FILEPATH}_${createRandomString()}`;
        app = await createApplication({ showSaveDialogResponse: filepath });

        const { client } = app;

        await userSignIn(client, USER_GRAASP);

        // visit and save space
        await visitAndSaveSpaceById(client, id);

        // export from card
        await (await client.$(`.${SPACE_EXPORT_BUTTON_CLASS}`)).click();
        await client.pause(EXPORT_SPACE_PAUSE);

        await checkExportSelectionLayout(client);

        await exportSpaceWithSelected(client);

        // check exported files locally
        expect(fs.existsSync(filepath)).to.be.true;
      })
    );
    it(
      'space with actions and resources',
      mochaAsync(async () => {
        const {
          space: { id, phases },
        } = SPACE_ATOMIC_STRUCTURE;
        const { id: textInputAppId0 } = phases[0].items[1];
        const text = 'some user input orientation';

        const filepath = `${EXPORT_FILEPATH}_${createRandomString()}`;
        app = await createApplication({ showSaveDialogResponse: filepath });

        const { client } = app;

        await userSignIn(client, USER_GRAASP);

        // visit and save space
        await visitAndSaveSpaceById(client, id);

        // write in text input
        await menuGoToPhase(client, 0);
        await typeInTextInputApp(client, textInputAppId0, text);

        // export from card
        await (await client.$(`.${SPACE_EXPORT_BUTTON_CLASS}`)).click();
        await client.pause(EXPORT_SPACE_PAUSE);

        await checkExportSelectionLayout(client, {
          actions: true,
          resources: true,
        });

        await exportSpaceWithSelected(client);

        // check exported files locally
        expect(fs.existsSync(filepath)).to.be.true;
      })
    );
  });
});
