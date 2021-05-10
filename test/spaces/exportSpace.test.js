import { expect } from 'chai';
import fs from 'fs';
import {
  mochaAsync,
  createRandomString,
  expectElementToExist,
  menuGoToSavedSpaces,
  clickOnSpaceCard,
  buildSignedInUserForDatabase,
} from '../utils';
import { createApplication, closeApplication } from '../application';
import {
  buildSpaceCardId,
  SPACE_EXPORT_BUTTON_CLASS,
  EXPORT_SPACE_BUTTON_ID,
  buildCheckboxLabel,
  EXPORT_SPACE_BACK_BUTTON_ID,
} from '../../src/config/selectors';
import {
  SPACE_ATOMIC_STRUCTURE,
  SPACE_ATOMIC_STRUCTURE_WITH_ACTIONS_AND_RESOURCES,
  SPACE_WITH_FILE_DROP,
} from '../fixtures/spaces';
import { hasSavedSpaceLayout } from './visitSpace.test';
import {
  EXPORT_FILEPATH,
  DEFAULT_GLOBAL_TIMEOUT,
  OPEN_SAVED_SPACE_PAUSE,
  EXPORT_SPACE_PAUSE,
} from '../constants';

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

  await client.pause(EXPORT_SPACE_PAUSE);
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

  afterEach(() => closeApplication(app));

  describe('General', () => {
    it(
      'Exporting from toolbar saves space in local computer',
      mochaAsync(async () => {
        const filepath = `${EXPORT_FILEPATH}_${createRandomString()}`;

        app = await createApplication({
          database: {
            spaces: [SPACE_ATOMIC_STRUCTURE],
            ...buildSignedInUserForDatabase(),
          },
          responses: { showSaveDialogResponse: filepath },
        });

        const { client } = app;

        await menuGoToSavedSpaces(client);
        await clickOnSpaceCard(client, SPACE_ATOMIC_STRUCTURE.space.id);
        const exportButton = await client.$(`.${SPACE_EXPORT_BUTTON_CLASS}`);
        await exportButton.click();

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
        app = await createApplication({
          database: {
            spaces: [SPACE_ATOMIC_STRUCTURE],
            ...buildSignedInUserForDatabase(),
          },
          responses: { showSaveDialogResponse: filepath },
        });

        const { client } = app;

        await menuGoToSavedSpaces(client);

        const exportButton = await client.$(
          `#${buildSpaceCardId(id)} .${SPACE_EXPORT_BUTTON_CLASS}`
        );
        await exportButton.click();

        // back and export again
        const backButton = await client.$(`#${EXPORT_SPACE_BACK_BUTTON_ID}`);
        await backButton.click();
        await exportButton.click();

        await exportSpaceWithSelected(client);

        // check exported files locally
        expect(fs.existsSync(filepath)).to.be.true;
      })
    );

    it(
      'Export correctly space with prepackaged app',
      mochaAsync(async () => {
        const { space } = SPACE_WITH_FILE_DROP;
        const { id } = space;

        const filepath = `${EXPORT_FILEPATH}_${createRandomString()}`;
        app = await createApplication({
          database: {
            spaces: [SPACE_WITH_FILE_DROP],
            ...buildSignedInUserForDatabase(),
          },
          responses: { showSaveDialogResponse: filepath },
        });

        const { client } = app;

        await menuGoToSavedSpaces(client);

        const exportButton = await client.$(
          `#${buildSpaceCardId(id)} .${SPACE_EXPORT_BUTTON_CLASS}`
        );
        await exportButton.click();

        await exportSpaceWithSelected(client);

        // check exported files locally
        expect(fs.existsSync(filepath)).to.be.true;

        const viewButton = await client.$(`#${buildSpaceCardId(id)}`);
        await viewButton.click();
        await client.pause(OPEN_SAVED_SPACE_PAUSE);

        // check space is still displayed correctly
        await hasSavedSpaceLayout(client, SPACE_WITH_FILE_DROP);
      })
    );
  });

  describe('Can export space, actions and resources if exists', () => {
    it(
      'space only',
      mochaAsync(async () => {
        const filepath = `${EXPORT_FILEPATH}_${createRandomString()}`;
        app = await createApplication({
          database: {
            spaces: [SPACE_ATOMIC_STRUCTURE],
            ...buildSignedInUserForDatabase(),
          },
          responses: { showSaveDialogResponse: filepath },
        });

        const { client } = app;

        await menuGoToSavedSpaces(client);

        // export from card
        const exportButton = await client.$(
          `#${buildSpaceCardId(
            SPACE_ATOMIC_STRUCTURE.space.id
          )} .${SPACE_EXPORT_BUTTON_CLASS}`
        );
        await exportButton.click();

        await checkExportSelectionLayout(client);

        await exportSpaceWithSelected(client);

        // check exported files locally
        expect(fs.existsSync(filepath)).to.be.true;
      })
    );
    it(
      'space with actions and resources',
      mochaAsync(async () => {
        const filepath = `${EXPORT_FILEPATH}_${createRandomString()}`;
        app = await createApplication({
          database: {
            spaces: [SPACE_ATOMIC_STRUCTURE_WITH_ACTIONS_AND_RESOURCES],
            ...buildSignedInUserForDatabase(),
          },
          responses: { showSaveDialogResponse: filepath },
        });

        const { client } = app;

        await menuGoToSavedSpaces(client);

        // export from card
        const exportButton = await client.$(
          `#${buildSpaceCardId(
            SPACE_ATOMIC_STRUCTURE_WITH_ACTIONS_AND_RESOURCES.space.id
          )} .${SPACE_EXPORT_BUTTON_CLASS}`
        );
        await exportButton.click();

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
