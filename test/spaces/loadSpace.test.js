/* eslint-disable no-unused-expressions */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { expect } from 'chai';
import path from 'path';
import {
  mochaAsync,
  createRandomString,
  expectElementToExist,
  toggleStudentMode,
} from '../utils';
import { createApplication, closeApplication } from '../application';
import {
  menuGoToLoadSpace,
  menuGoToHome,
  menuGoToSavedSpaces,
  menuGoToSettings,
} from '../menu.test';
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
import { userSignIn } from '../userSignIn.test';
import { USER_GRAASP } from '../fixtures/users';
import { typeInTextInputApp } from '../apps/textInputApp';
import { exportSpaceWithSelected } from './exportSpace.test';
import { USER_MODES } from '../../src/config/constants';

export const setCheckboxesTo = async (
  client,
  { resources = false, actions = false }
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
};

export const checkLoadSelectionLayout = async (
  client,
  { space = true, resources = false, actions = false }
) => {
  const spaceCheckbox = `input[name="space"]`;
  const actionsCheckbox = `input[name="actions"]`;
  const resourcesCheckbox = `input[name="appInstanceResources"]`;
  await expectElementToExist(client, spaceCheckbox);
  await expectElementToExist(client, actionsCheckbox);
  await expectElementToExist(client, resourcesCheckbox);

  const isSpaceChecked = await client.getAttribute(spaceCheckbox, 'checked');
  expect(Boolean(isSpaceChecked)).to.equal(space);

  // space is always disabled
  const isSpaceDisabled = await client.getAttribute(spaceCheckbox, 'disabled');
  expect(Boolean(isSpaceDisabled)).to.be.true;

  const isActionsChecked = await client.getAttribute(
    actionsCheckbox,
    'checked'
  );
  expect(Boolean(isActionsChecked)).to.equal(actions);

  // if checkbox is false by default, it is also disabled
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

  // if checkbox is false by default, it is also disabled
  const isResourcesDisabled = await client.getAttribute(
    actionsCheckbox,
    'disabled'
  );
  expect(Boolean(isResourcesDisabled)).to.equal(!resources);
};

export const loadFilepath = async (
  client,
  filepath,
  isChecked = { space: true, actions: false, resources: false },
  shouldCheck = { actions: false, resources: false }
) => {
  const loadInput = `#${LOAD_INPUT_ID}`;

  // input space id
  const absolutePath = path.resolve(__dirname, '../fixtures/spaces', filepath);
  await client.setValue(loadInput, absolutePath);
  await client.pause(INPUT_TYPE_PAUSE);

  const value = await client.getValue(loadInput);
  expect(value).to.equal(absolutePath);

  await client.click(`#${LOAD_SUBMIT_BUTTON_ID}`);
  await client.pause(LOAD_SELECTION_SPACE_PAUSE);

  // check checkboxes default layout
  await checkLoadSelectionLayout(client, isChecked);

  // check wanted checkboxes
  await setCheckboxesTo(client, shouldCheck);

  await client.click(`#${LOAD_LOAD_BUTTON_ID}`);
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
    await client.click(`#${buildSpaceCardId(id)} .${SPACE_CARD_LINK_CLASS}`);

    await client.pause(OPEN_SAVED_SPACE_PAUSE);
  }
};

describe('Load Space Scenarios', function() {
  this.timeout(DEFAULT_GLOBAL_TIMEOUT);
  let app;

  afterEach(function() {
    return closeApplication(app);
  });

  describe('predefined export spaces', function() {
    beforeEach(
      mochaAsync(async () => {
        app = await createApplication();
        await userSignIn(app.client, USER_GRAASP);
      })
    );

    it(
      `Cannot load space with a non-zip file`,
      mochaAsync(async () => {
        const { client } = app;

        // load space
        await menuGoToLoadSpace(client);

        await client.setValue(`#${LOAD_INPUT_ID}`, 'somefilepath');
        await client.pause(INPUT_TYPE_PAUSE);

        const isLoadButtonDisabled = await client.getAttribute(
          `#${LOAD_SUBMIT_BUTTON_ID}`,
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
        await client.setValue(`#${LOAD_INPUT_ID}`, absolutePath);
        await client.pause(INPUT_TYPE_PAUSE);
        await client.click(`#${LOAD_SUBMIT_BUTTON_ID}`);
        await client.pause(LOAD_SELECTION_SPACE_PAUSE);
        await client.click(`#${LOAD_BACK_BUTTON_ID}`);
        await client.pause(LOAD_TAB_PAUSE);

        await loadSpaceById(
          client,
          SPACE_ATOMIC_STRUCTURE_PATH,
          SPACE_ATOMIC_STRUCTURE.space.id
        );

        await hasSavedSpaceLayout(client, SPACE_ATOMIC_STRUCTURE);
      })
    );

    describe('Load selection Layout', function() {
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
          await hasSavedSpaceLayout(client, SPACE_WITH_MULTIPLE_CHANGES);
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

          await client.click(
            `#${buildSpaceCardId(id)} .${SPACE_CARD_LINK_CLASS}`
          );

          // check content
          await hasSavedSpaceLayout(
            client,
            SPACE_ATOMIC_STRUCTURE_WITH_ACTIONS_AND_RESOURCES,
            appInstanceResources
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

          await client.click(
            `#${buildSpaceCardId(id)} .${SPACE_CARD_LINK_CLASS}`
          );
          // check content
          await hasSavedSpaceLayout(
            client,
            SPACE_ATOMIC_STRUCTURE_WITH_ACTIONS_AND_RESOURCES
          );
        })
      );
    });

    describe('Student', function() {
      it(
        `Cannot load non-existing space ${SPACE_ATOMIC_STRUCTURE_WITH_ACTIONS_AND_RESOURCES.space.name}`,
        mochaAsync(async () => {
          const { client } = app;
          await menuGoToSettings(client);
          await toggleStudentMode(client, true);

          // load space without actions and resources
          await menuGoToLoadSpace(client);

          // submit a zip file
          const absolutePath = path.resolve(
            __dirname,
            '../fixtures/spaces',
            SPACE_ATOMIC_STRUCTURE_PATH
          );
          await client.setValue(`#${LOAD_INPUT_ID}`, absolutePath);
          await client.pause(INPUT_TYPE_PAUSE);
          await client.click(`#${LOAD_SUBMIT_BUTTON_ID}`);
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
            appInstanceResources,
            USER_MODES.STUDENT
          );
        })
      );
    });
  });

  describe('Load from app created export files', function() {
    it(
      `Load exported space of ${SPACE_ATOMIC_STRUCTURE.space.name}`,
      mochaAsync(async () => {
        const {
          space: { id },
        } = SPACE_ATOMIC_STRUCTURE;

        const filepath = `${EXPORT_FILEPATH}_${createRandomString()}.zip`;
        app = await createApplication({
          showSaveDialogResponse: filepath,
          showMessageDialogResponse: 1,
        });

        const { client } = app;

        await userSignIn(client, USER_GRAASP);

        // get space
        await visitAndSaveSpaceById(client, id);

        // export space
        await client.click(`.${SPACE_EXPORT_BUTTON_CLASS}`);
        await client.pause(EXPORT_SPACE_PAUSE);

        await exportSpaceWithSelected(client);

        // delete space from home to avoid back error
        // see more here https://github.com/graasp/graasp-desktop/issues/263
        await menuGoToHome(client);
        await client.click(
          `#${buildSpaceCardId(id)} .${SPACE_DELETE_BUTTON_CLASS}`
        );
        await client.pause(DELETE_SPACE_PAUSE);

        // load space
        await loadSpaceById(client, filepath, SPACE_ATOMIC_STRUCTURE.space.id);

        // check content
        await hasSavedSpaceLayout(client, SPACE_ATOMIC_STRUCTURE);
      })
    );

    it(
      `Load exported space of ${SPACE_ATOMIC_STRUCTURE.space.name} with added user input`,
      mochaAsync(async () => {
        const {
          space: { id, phases },
        } = SPACE_ATOMIC_STRUCTURE;

        const filepath = `${EXPORT_FILEPATH}_${createRandomString()}.zip`;
        app = await createApplication({
          showSaveDialogResponse: filepath,
          showMessageDialogResponse: 1,
        });

        const { client } = app;

        await userSignIn(client, USER_GRAASP);

        // get space
        await visitAndSaveSpaceById(client, id);

        // add user input
        await client.click(
          `#${PHASE_MENU_LIST_ID} li#${buildPhaseMenuItemId(0)}`
        );
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
        await client.click(`.${SPACE_EXPORT_BUTTON_CLASS}`);
        await client.pause(EXPORT_SPACE_PAUSE);
        await exportSpaceWithSelected(client);

        // delete space from home to avoid back error
        // see more here https://github.com/graasp/graasp-desktop/issues/263
        await menuGoToHome(client);
        await client.click(
          `#${buildSpaceCardId(id)} .${SPACE_DELETE_BUTTON_CLASS}`
        );
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
        await hasSavedSpaceLayout(client, SPACE_ATOMIC_STRUCTURE, resources);
      })
    );

    it(
      `Load exported space of ${SPACE_ATOMIC_STRUCTURE.space.name} without added user input`,
      mochaAsync(async () => {
        const {
          space: { id, phases },
        } = SPACE_ATOMIC_STRUCTURE;

        const filepath = `${EXPORT_FILEPATH}_${createRandomString()}.zip`;
        app = await createApplication({
          showSaveDialogResponse: filepath,
          showMessageDialogResponse: 1,
        });

        const { client } = app;

        await userSignIn(client, USER_GRAASP);

        // get space
        await visitAndSaveSpaceById(client, id);

        // add user input
        await client.click(
          `#${PHASE_MENU_LIST_ID} li#${buildPhaseMenuItemId(0)}`
        );
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
        await client.click(`.${SPACE_EXPORT_BUTTON_CLASS}`);
        await client.pause(EXPORT_SPACE_PAUSE);
        await exportSpaceWithSelected(client);

        // delete space from home to avoid back error
        // see more here https://github.com/graasp/graasp-desktop/issues/263
        await menuGoToHome(client);
        await client.click(
          `#${buildSpaceCardId(id)} .${SPACE_DELETE_BUTTON_CLASS}`
        );
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
        await hasSavedSpaceLayout(client, SPACE_ATOMIC_STRUCTURE);
      })
    );
  });
});
