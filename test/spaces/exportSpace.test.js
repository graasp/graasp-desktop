/* eslint-disable no-unused-expressions */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { expect } from 'chai';
import fs from 'fs';
import { mochaAsync, createRandomString, expectElementToExist } from '../utils';
import { createApplication, closeApplication } from '../application';
import { menuGoToSavedSpaces, menuGoToPhase } from '../menu.test';
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
import { userSignIn } from '../userSignIn.test';
import { USER_GRAASP } from '../fixtures/users';
import { typeInTextInputApp } from '../apps/textInputApp';

// eslint-disable-next-line import/prefer-default-export
export const exportSpaceWithSelected = async (
  client,
  { actions = true, resources = true } = {}
) => {
  const actionsCheckbox = `input[name="actions"]`;
  const isActionsChecked = await client.getAttribute(
    actionsCheckbox,
    'checked'
  );
  if (Boolean(isActionsChecked) !== actions) {
    await client.click(`#${buildCheckboxLabel('actions')}`);
  }

  const resourcesCheckbox = `input[name="appInstanceResources"]`;
  const isResourcesChecked = await client.getAttribute(
    resourcesCheckbox,
    'checked'
  );
  if (Boolean(isResourcesChecked) !== resources) {
    await client.click(`#${buildCheckboxLabel('appInstanceResources')}`);
  }

  await client.click(`#${EXPORT_SPACE_BUTTON_ID}`);
  await client.pause(TOOLTIP_FADE_OUT_PAUSE);
};

const checkExportSelectionLayout = async (
  client,
  { resources = false, actions = false } = {}
) => {
  const actionsCheckbox = `input[name="actions"]`;
  const resourcesCheckbox = `input[name="appInstanceResources"]`;
  await expectElementToExist(client, actionsCheckbox);
  await expectElementToExist(client, resourcesCheckbox);

  const isActionsChecked = await client.getAttribute(
    actionsCheckbox,
    'checked'
  );
  expect(Boolean(isActionsChecked)).to.equal(actions);
  const isActionsDisabled = await client.getAttribute(
    actionsCheckbox,
    'disabled'
  );
  expect(Boolean(isActionsDisabled)).to.equal(!actions);

  const isResourcesChecked = await client.getAttribute(
    actionsCheckbox,
    'checked'
  );
  expect(Boolean(isResourcesChecked) || false).to.equal(resources);
  const isResourcesDisabled = await client.getAttribute(
    actionsCheckbox,
    'disabled'
  );
  expect(Boolean(isResourcesDisabled)).to.equal(!resources);
};

describe('Export a space', function() {
  this.timeout(DEFAULT_GLOBAL_TIMEOUT);
  let app;

  afterEach(function() {
    return closeApplication(app);
  });

  describe('General', function() {
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

        await client.click(`.${SPACE_EXPORT_BUTTON_CLASS}`);
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

        await client.click(
          `#${buildSpaceCardId(id)} .${SPACE_EXPORT_BUTTON_CLASS}`
        );
        await client.pause(EXPORT_SELECTION_SPACE_PAUSE);

        // back and export again
        await client.click(`#${EXPORT_SPACE_BACK_BUTTON_ID}`);
        await client.pause(OPEN_SAVED_SPACE_PAUSE);
        await client.click(
          `#${buildSpaceCardId(id)} .${SPACE_EXPORT_BUTTON_CLASS}`
        );
        await client.pause(EXPORT_SELECTION_SPACE_PAUSE);

        await exportSpaceWithSelected(client);

        // check exported files locally
        expect(fs.existsSync(filepath)).to.be.true;
      })
    );
  });

  describe('Can export space, actions and resources if exists', function() {
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
        await client.click(`.${SPACE_EXPORT_BUTTON_CLASS}`);
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
        await client.click(`.${SPACE_EXPORT_BUTTON_CLASS}`);
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
