/* eslint-disable no-unused-expressions */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable func-names */
import { expect } from 'chai';
import path from 'path';
import {
  mochaAsync,
  createRandomString,
  expectElementToExist,
  toggleStudentMode,
  menuGoToLoadSpace,
  menuGoToHome,
  menuGoToSavedSpaces,
  menuGoToSettings,
  userSignIn,
} from '../utils';
import { createApplication, closeApplication } from '../application';
import {
  buildSpaceCardId,
  SPACE_CARD_LINK_CLASS,
  LOAD_SUBMIT_BUTTON_ID,
  SPACE_EXPORT_BUTTON_CLASS,
  LOAD_INPUT_ID,
  SPACE_DELETE_BUTTON_CLASS,
  PHASE_MENU_LIST_ID,
  buildPhaseMenuItemId,
  buildCheckboxLabel,
  LOAD_LOAD_BUTTON_ID,
  LOAD_BACK_BUTTON_ID,
  SPACE_NOT_AVAILABLE_TEXT_ID,
} from '../../src/config/selectors';
import {
  SPACE_ATOMIC_STRUCTURE,
  SPACE_ATOMIC_STRUCTURE_PATH,
  SPACE_WITH_MULTIPLE_CHANGES,
  SPACE_WITH_MULTIPLE_CHANGES_PATH,
  SPACE_ATOMIC_STRUCTURE_WITH_ACTIONS_AND_RESOURCES,
  SPACE_ATOMIC_STRUCTURE_WITH_ACTIONS_AND_RESOURCES_PATH,
} from '../fixtures/spaces';
import { hasSavedSpaceLayout, visitAndSaveSpaceById } from './visitSpace.test';
import {
  INPUT_TYPE_PAUSE,
  LOAD_SPACE_PAUSE,
  LOAD_SELECTION_SPACE_PAUSE,
  EXPORT_SPACE_PAUSE,
  EXPORT_FILEPATH,
  DELETE_SPACE_PAUSE,
  OPEN_SAVED_SPACE_PAUSE,
  LOAD_PHASE_PAUSE,
  DEFAULT_GLOBAL_TIMEOUT,
  LOAD_TAB_PAUSE,
} from '../constants';
import { USER_GRAASP, USER_BOB } from '../fixtures/users';
import { typeInTextInputApp } from '../apps/textInputApp';
import { exportSpaceWithSelected } from './exportSpace.test';

export const setCheckboxesTo = async (
  client,
  { resources = false, actions = false }
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
};

export const checkLoadSelectionLayout = async (
  client,
  { space = true, resources = false, actions = false }
) => {
  const spaceCheckboxSelector = `input[name="space"]`;
  const actionsCheckboxSelector = `input[name="actions"]`;
  const resourcesCheckboxSelector = `input[name="appInstanceResources"]`;
  await expectElementToExist(client, spaceCheckboxSelector);
  await expectElementToExist(client, actionsCheckboxSelector);
  await expectElementToExist(client, resourcesCheckboxSelector);

  const spaceCheckbox = await client.$(spaceCheckboxSelector);
  const actionsCheckbox = await client.$(actionsCheckboxSelector);
  const resourcesCheckbox = await client.$(resourcesCheckboxSelector);

  const isSpaceChecked = await spaceCheckbox.getAttribute('checked');
  expect(Boolean(isSpaceChecked)).to.equal(space);

  // space is always disabled
  const isSpaceDisabled = await spaceCheckbox.getAttribute('disabled');
  expect(Boolean(isSpaceDisabled)).to.be.true;

  const isActionsChecked = await actionsCheckbox.getAttribute('checked');
  expect(Boolean(isActionsChecked)).to.equal(actions);

  // if checkbox is false by default, it is also disabled
  const isActionsDisabled = await actionsCheckbox.getAttribute('disabled');
  expect(Boolean(isActionsDisabled)).to.equal(!actions);

  const isResourcesChecked = await resourcesCheckbox.getAttribute('checked');
  expect(Boolean(isResourcesChecked) || false).to.equal(resources);

  // if checkbox is false by default, it is also disabled
  const isResourcesDisabled = await resourcesCheckbox.getAttribute('disabled');
  expect(Boolean(isResourcesDisabled)).to.equal(!resources);
};

export const loadFilepath = async (
  client,
  filepath,
  isChecked = { space: true, actions: false, resources: false },
  shouldCheck = { actions: false, resources: false }
) => {
  const loadInput = await client.$(`#${LOAD_INPUT_ID}`);

  // input space id
  const absolutePath = path.resolve(__dirname, '../fixtures/spaces', filepath);
  await loadInput.setValue(absolutePath);
  await client.pause(INPUT_TYPE_PAUSE);

  const value = await loadInput.getValue();
  expect(value).to.equal(absolutePath);

  const loadSubmitButton = await client.$(`#${LOAD_SUBMIT_BUTTON_ID}`);
  await loadSubmitButton.click();
  await client.pause(LOAD_SELECTION_SPACE_PAUSE);

  // check checkboxes default layout
  await checkLoadSelectionLayout(client, isChecked);

  // check wanted checkboxes
  await setCheckboxesTo(client, shouldCheck);

  const loadButton = await client.$(`#${LOAD_LOAD_BUTTON_ID}`);
  await loadButton.click();
  await client.pause(LOAD_SPACE_PAUSE);
};

export const loadSpaceById = async (
  client,
  filepath,
  id,
  isChecked,
  shouldCheck
) => {
  await menuGoToLoadSpace(client);

  await loadFilepath(client, filepath, isChecked, shouldCheck);

  // go to space
  await menuGoToSavedSpaces(client);

  if (id) {
    await (
      await client.$(`#${buildSpaceCardId(id)} .${SPACE_CARD_LINK_CLASS}`)
    ).click();

    await client.pause(OPEN_SAVED_SPACE_PAUSE);
  }
};

describe('Load Space Scenarios', function () {
  this.timeout(DEFAULT_GLOBAL_TIMEOUT);
  let app;
  let globalUser;

  afterEach(function () {
    return closeApplication(app);
  });

  describe('predefined export spaces', function () {
    beforeEach(
      mochaAsync(async () => {
        app = await createApplication();
        globalUser = USER_GRAASP;
        await userSignIn(app.client, globalUser);
      })
    );

    it(
      `Cannot load space with a non-zip file`,
      mochaAsync(async () => {
        const { client } = app;

        // load space
        await menuGoToLoadSpace(client);
        const loadInput = await client.$(`#${LOAD_INPUT_ID}`);
        await loadInput.setValue('somefilepath');
        await client.pause(INPUT_TYPE_PAUSE);

        const loadSubmitButton = await client.$(`#${LOAD_SUBMIT_BUTTON_ID}`);
        const isLoadButtonDisabled = await loadSubmitButton.getAttribute(
          'disabled'
        );
        expect(isLoadButtonDisabled).to.equal('true');
      })
    );

    it(
      `Cancel load, then load space ${SPACE_ATOMIC_STRUCTURE.space.name}`,
      mochaAsync(async () => {
        const { client } = app;

        await menuGoToLoadSpace(client);

        // submit a zip file, then cancel
        const absolutePath = path.resolve(
          __dirname,
          '../fixtures/spaces',
          SPACE_ATOMIC_STRUCTURE_PATH
        );
        const loadInput = await client.$(`#${LOAD_INPUT_ID}`);
        await loadInput.setValue(absolutePath);
        await client.pause(INPUT_TYPE_PAUSE);
        const loadSubmitButton = await client.$(`#${LOAD_SUBMIT_BUTTON_ID}`);
        await loadSubmitButton.click();
        await client.pause(LOAD_SELECTION_SPACE_PAUSE);
        const loadBackButton = await client.$(`#${LOAD_BACK_BUTTON_ID}`);
        await loadBackButton.click();
        await client.pause(LOAD_TAB_PAUSE);

        await loadSpaceById(
          client,
          SPACE_ATOMIC_STRUCTURE_PATH,
          SPACE_ATOMIC_STRUCTURE.space.id
        );

        await hasSavedSpaceLayout(client, SPACE_ATOMIC_STRUCTURE, {
          user: globalUser,
        });
      })
    );

    describe('Load selection Layout', function () {
      it(
        `Load changed and existing space of ${SPACE_WITH_MULTIPLE_CHANGES.space.name} replace database`,
        mochaAsync(async () => {
          const {
            space: { id },
          } = SPACE_WITH_MULTIPLE_CHANGES;

          const { client } = app;

          // get space
          await visitAndSaveSpaceById(client, id);

          // load space
          await loadSpaceById(client, SPACE_WITH_MULTIPLE_CHANGES_PATH, id);

          // check content has changed
          await hasSavedSpaceLayout(client, SPACE_WITH_MULTIPLE_CHANGES, {
            user: globalUser,
          });
        })
      );
      it(
        `Can only load actions and resources existing space of ${SPACE_ATOMIC_STRUCTURE_WITH_ACTIONS_AND_RESOURCES.space.name} `,
        mochaAsync(async () => {
          const {
            space: { id },
            appInstanceResources,
          } = SPACE_ATOMIC_STRUCTURE_WITH_ACTIONS_AND_RESOURCES;
          const { client } = app;

          // get space
          await visitAndSaveSpaceById(client, id);

          // load space
          await loadSpaceById(
            client,
            SPACE_ATOMIC_STRUCTURE_WITH_ACTIONS_AND_RESOURCES_PATH,
            undefined,
            { space: false, actions: true, resources: true },
            { actions: true, resources: true }
          );
          const spaceCardLink = await client.$(
            `#${buildSpaceCardId(id)} .${SPACE_CARD_LINK_CLASS}`
          );
          await spaceCardLink.click();

          // check content
          await hasSavedSpaceLayout(
            client,
            SPACE_ATOMIC_STRUCTURE_WITH_ACTIONS_AND_RESOURCES,
            { resources: appInstanceResources, user: globalUser }
          );
        })
      );
      it(
        `Load only space ${SPACE_ATOMIC_STRUCTURE_WITH_ACTIONS_AND_RESOURCES.space.name}`,
        mochaAsync(async () => {
          const {
            space: { id },
          } = SPACE_ATOMIC_STRUCTURE_WITH_ACTIONS_AND_RESOURCES;
          const { client } = app;

          // load space without actions and resources
          await loadSpaceById(
            client,
            SPACE_ATOMIC_STRUCTURE_WITH_ACTIONS_AND_RESOURCES_PATH,
            undefined,
            { space: true, actions: true, resources: true },
            { actions: false, resources: false }
          );

          const spaceCard = await client.$(
            `#${buildSpaceCardId(id)} .${SPACE_CARD_LINK_CLASS}`
          );
          await spaceCard.click();
          // check content
          await hasSavedSpaceLayout(
            client,
            SPACE_ATOMIC_STRUCTURE_WITH_ACTIONS_AND_RESOURCES,
            { user: globalUser }
          );
        })
      );
    });
  });

  describe('Predefined Export Spaces for Student', function () {
    beforeEach(
      mochaAsync(async () => {
        app = await createApplication();
        globalUser = USER_BOB;
        await userSignIn(app.client, USER_BOB);
      })
    );

    it(
      `Cannot load non-existing space ${SPACE_ATOMIC_STRUCTURE_WITH_ACTIONS_AND_RESOURCES.space.name}`,
      mochaAsync(async () => {
        const { client } = app;

        // load space without actions and resources
        await menuGoToLoadSpace(client);

        // submit a zip file
        const absolutePath = path.resolve(
          __dirname,
          '../fixtures/spaces',
          SPACE_ATOMIC_STRUCTURE_PATH
        );
        const loadInput = await client.$(`#${LOAD_INPUT_ID}`);
        await loadInput.setValue(absolutePath);
        await client.pause(INPUT_TYPE_PAUSE);
        const loadSubmitButton = await client.$(`#${LOAD_SUBMIT_BUTTON_ID}`);
        await loadSubmitButton.click();
        await client.pause(LOAD_SELECTION_SPACE_PAUSE);

        await menuGoToSavedSpaces(client);

        await expectElementToExist(client, `#${SPACE_NOT_AVAILABLE_TEXT_ID}`);
      })
    );
    it(
      `Can only load actions and resources of ${SPACE_ATOMIC_STRUCTURE_WITH_ACTIONS_AND_RESOURCES.space.name}`,
      mochaAsync(async () => {
        const { client } = app;
        const {
          space: { id },
          appInstanceResources,
        } = SPACE_ATOMIC_STRUCTURE_WITH_ACTIONS_AND_RESOURCES;

        // set teacher mode
        await menuGoToSettings(client);
        await toggleStudentMode(client, false);

        // get space
        await visitAndSaveSpaceById(client, id);

        // set student mode
        await menuGoToSettings(client);
        await toggleStudentMode(client, true);

        // load space without actions and resources
        await loadSpaceById(
          client,
          SPACE_ATOMIC_STRUCTURE_WITH_ACTIONS_AND_RESOURCES_PATH,
          id,
          { space: false, actions: true, resources: true },
          { actions: true, resources: true }
        );

        // check content
        await hasSavedSpaceLayout(
          client,
          SPACE_ATOMIC_STRUCTURE_WITH_ACTIONS_AND_RESOURCES,
          { resources: appInstanceResources, user: globalUser }
        );
      })
    );
  });

  describe('Load from app created export files', function () {
    this.retries(2);

    it(
      `Load exported space of ${SPACE_ATOMIC_STRUCTURE.space.name}`,
      mochaAsync(async () => {
        globalUser = USER_GRAASP;
        const {
          space: { id },
        } = SPACE_ATOMIC_STRUCTURE;

        const filepath = `${EXPORT_FILEPATH}_${createRandomString()}.zip`;
        app = await createApplication({
          showSaveDialogResponse: filepath,
          showMessageDialogResponse: 1,
        });

        const { client } = app;
        await userSignIn(client, globalUser);

        // get space
        await visitAndSaveSpaceById(client, id);

        // export space
        const exportButton = await client.$(`.${SPACE_EXPORT_BUTTON_CLASS}`);
        await exportButton.click();
        await client.pause(EXPORT_SPACE_PAUSE);

        await exportSpaceWithSelected(client);

        // delete space from home to avoid back error
        // see more here https://github.com/graasp/graasp-desktop/issues/263
        await menuGoToHome(client);
        const deleteButton = await client.$(
          `#${buildSpaceCardId(id)} .${SPACE_DELETE_BUTTON_CLASS}`
        );
        await deleteButton.click();
        await client.pause(DELETE_SPACE_PAUSE);

        // load space
        await loadSpaceById(client, filepath, SPACE_ATOMIC_STRUCTURE.space.id);

        // check content
        await hasSavedSpaceLayout(client, SPACE_ATOMIC_STRUCTURE, {
          user: globalUser,
        });
      })
    );

    it(
      `Load exported space of ${SPACE_ATOMIC_STRUCTURE.space.name} with added user input`,
      mochaAsync(async () => {
        globalUser = USER_GRAASP;
        const {
          space: { id, phases },
        } = SPACE_ATOMIC_STRUCTURE;

        const filepath = `${EXPORT_FILEPATH}_${createRandomString()}.zip`;
        app = await createApplication({
          showSaveDialogResponse: filepath,
          showMessageDialogResponse: 1,
        });

        const { client } = app;
        await userSignIn(client, globalUser);

        // get space
        await visitAndSaveSpaceById(client, id);

        // add user input
        const phaseItem = await client.$(
          `#${PHASE_MENU_LIST_ID} li#${buildPhaseMenuItemId(0)}`
        );
        await phaseItem.click();
        await client.pause(LOAD_PHASE_PAUSE);

        // type in text input app
        const { id: appId, appInstance } = phases[0].items[1];
        const resources = [
          {
            data: 'user input in space with graasp account',
            appInstance: appInstance.id,
          },
        ];
        await typeInTextInputApp(client, appId, resources[0].data);

        // export space
        const exportButton = await client.$(`.${SPACE_EXPORT_BUTTON_CLASS}`);
        await exportButton.click();
        await client.pause(EXPORT_SPACE_PAUSE);
        await exportSpaceWithSelected(client);

        // delete space from home to avoid back error
        // see more here https://github.com/graasp/graasp-desktop/issues/263
        await menuGoToHome(client);
        const deleteButton = await client.$(
          `#${buildSpaceCardId(id)} .${SPACE_DELETE_BUTTON_CLASS}`
        );
        await deleteButton.click();
        await client.pause(DELETE_SPACE_PAUSE);

        // load space
        await loadSpaceById(
          client,
          filepath,
          SPACE_ATOMIC_STRUCTURE.space.id,
          {
            actions: true,
            resources: true,
          },
          {
            actions: true,
            resources: true,
          }
        );

        // check content
        await hasSavedSpaceLayout(client, SPACE_ATOMIC_STRUCTURE, {
          resources,
          user: globalUser,
        });
      })
    );

    it(
      `Load exported space of ${SPACE_ATOMIC_STRUCTURE.space.name} without added user input`,
      mochaAsync(async () => {
        globalUser = USER_GRAASP;
        const {
          space: { id, phases },
        } = SPACE_ATOMIC_STRUCTURE;

        const filepath = `${EXPORT_FILEPATH}_${createRandomString()}.zip`;
        app = await createApplication({
          showSaveDialogResponse: filepath,
          showMessageDialogResponse: 1,
        });

        const { client } = app;

        await userSignIn(client, globalUser);

        // get space
        await visitAndSaveSpaceById(client, id);

        // add user input
        const phaseItem = await client.$(
          `#${PHASE_MENU_LIST_ID} li#${buildPhaseMenuItemId(0)}`
        );
        await phaseItem.click();
        await client.pause(LOAD_PHASE_PAUSE);

        // type in text input app
        const { id: appId, appInstance } = phases[0].items[1];
        const resources = [
          {
            data: 'user input in space with graasp account',
            appInstance: appInstance.id,
          },
        ];
        await typeInTextInputApp(client, appId, resources[0].data);

        // export space
        const exportButton = await client.$(`.${SPACE_EXPORT_BUTTON_CLASS}`);
        await exportButton.click();
        await client.pause(EXPORT_SPACE_PAUSE);
        await exportSpaceWithSelected(client);

        // delete space from home to avoid back error
        // see more here https://github.com/graasp/graasp-desktop/issues/263
        await menuGoToHome(client);
        const deleteButton = await client.$(
          `#${buildSpaceCardId(id)} .${SPACE_DELETE_BUTTON_CLASS}`
        );
        await deleteButton.click();
        await client.pause(DELETE_SPACE_PAUSE);

        // load space
        await loadSpaceById(
          client,
          filepath,
          SPACE_ATOMIC_STRUCTURE.space.id,
          {
            actions: true,
            resources: true,
          },
          {
            actions: false,
            resources: false,
          }
        );

        // check content
        await hasSavedSpaceLayout(client, SPACE_ATOMIC_STRUCTURE, {
          user: globalUser,
        });
      })
    );
  });
});
