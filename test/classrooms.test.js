/* eslint-disable no-unused-expressions */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable func-names */
import { expect } from 'chai';
import path from 'path';
import _ from 'lodash';
import {
  mochaAsync,
  expectElementToNotExist,
  expectElementToExist,
  toggleStudentMode,
  clearInput,
  menuGoToSettings,
  menuGoToClassrooms,
  menuGoToSignOut,
  userSignIn,
  openDrawer,
} from './utils';
import { createApplication, closeApplication } from './application';
import {
  CLASSROOMS_MENU_ITEM_ID,
  ADD_CLASSROOM_BUTTON_ID,
  CLASSROOM_NAME_INPUT_ID,
  ADD_CLASSROOM_VALIDATE_BUTTON_ID,
  ADD_CLASSROOM_CANCEL_BUTTON_ID,
  CLASSROOM_CARD_CLASS,
  NO_CLASSROOM_AVAILABLE_ID,
  EDIT_CLASSROOM_VALIDATE_BUTTON_ID,
  EDIT_CLASSROOM_BUTTON_CLASS,
  DELETE_CLASSROOM_BUTTON_CLASS,
  ADD_USER_IN_CLASSROOM_BUTTON_ID,
  ADD_USER_IN_CLASSROOM_NAME_INPUT_ID,
  ADD_USER_IN_CLASSROOM_VALIDATE_BUTTON_ID,
  EDIT_USER_IN_CLASSROOM_VALIDATE_BUTTON_ID,
  EDIT_USER_IN_CLASSROOM_USERNAME_INPUT_ID,
  EDIT_USER_IN_CLASSROOM_BUTTON_CLASS,
  CLASSROOM_TABLE_BODY_ID,
  DELETE_USER_IN_CLASSROOM_BUTTON_CLASS,
  CLASSROOM_CARD_SPACES_CLASS,
  CLASSROOM_CARD_STUDENTS_CLASS,
  CLASSROOM_SCREEN_BACK_BUTTON_ID,
  CLASSROOM_CARD_NAME_CLASS,
  SELECT_USER_IN_CLASSROOM_CLASS,
  DELETE_USERS_IN_CLASSROOM_BUTTON_ID,
  IMPORT_DATA_IN_CLASSROOM_BUTTON_ID,
  IMPORT_FILEPATH_IN_CLASSROOM_INPUT_ID,
  IMPORT_DATA_IN_CLASSROOM_STUDENT_SELECT_CONTAINER_CLASS,
  IMPORT_DATA_IN_CLASSROOM_STUDENT_SELECT_PREFIX_CLASS,
  IMPORT_DATA_IN_CLASSROOM_SUBMIT_BUTTON_ID,
  IMPORT_DATA_IN_CLASSROOM_BACK_BUTTON_ID,
  IMPORT_DATA_CLASSROOM_VALIDATE_BUTTON_ID,
  STUDENT_ROW_ACTIONS_CLASS,
  STUDENT_ROW_RESOURCES_CLASS,
  EDIT_USER_IN_CLASSROOM_DELETE_DATA_BUTTON_CLASS,
  buildTableCellSpaceId,
  EDIT_CLASSROOM_DELETE_DATA_BUTTON_CLASS,
} from '../src/config/selectors';
import {
  DEFAULT_GLOBAL_TIMEOUT,
  MODAL_CLOSE_PAUSE,
  MODAL_OPEN_PAUSE,
  INPUT_TYPE_PAUSE,
  DELETE_CLASSROOM_PAUSE,
  DELETE_USER_IN_CLASSROOM_PAUSE,
  OPEN_CLASSROOM_PAUSE,
  TOOLTIP_FADE_OUT_PAUSE,
  LOAD_SELECTION_SPACE_PAUSE,
  SELECT_OPEN_PAUSE,
  OPEN_IMPORT_DATA_IN_CLASSROOM_PAUSE,
} from './constants';
import { USER_GRAASP, USER_ALICE } from './fixtures/users';
import {
  checkLoadSelectionLayout,
  setCheckboxesTo,
} from './spaces/loadSpace.test';
import {
  SPACE_ATOMIC_STRUCTURE_WITH_ACTIONS_AND_RESOURCES_PATH,
  SPACE_ATOMIC_STRUCTURE_WITH_ACTIONS_AND_RESOURCES,
  SPACE_APOLLO_11_PATH,
  SPACE_APOLLO_11,
} from './fixtures/spaces';

const openClassroom = async (client, name) => {
  const classroom = await client.$(
    `.${CLASSROOM_CARD_CLASS}[data-name='${name}']`
  );
  await classroom.click();
  await client.pause(OPEN_CLASSROOM_PAUSE);
};

const addClassroom = async (client, name) => {
  const addButton = await client.$(`#${ADD_CLASSROOM_BUTTON_ID}`);
  await addButton.click();
  await client.pause(MODAL_OPEN_PAUSE);
  const inputSelector = `#${CLASSROOM_NAME_INPUT_ID}`;
  const input = await client.$(inputSelector);
  await clearInput(client, inputSelector);
  await input.setValue(name);
  await client.pause(INPUT_TYPE_PAUSE);
  const validateButton = await client.$(`#${ADD_CLASSROOM_VALIDATE_BUTTON_ID}`);
  await validateButton.click();
  await client.pause(MODAL_CLOSE_PAUSE);
};

const editClassroom = async (
  client,
  name,
  { name: newName, deletionSelection }
) => {
  await client.pause(MODAL_OPEN_PAUSE);
  if (newName && newName !== name) {
    const editInput = `#${CLASSROOM_NAME_INPUT_ID}`;
    await clearInput(client, editInput);
    await (await client.$(editInput)).setValue(newName);
    await client.pause(INPUT_TYPE_PAUSE);
  }

  if (deletionSelection) {
    for (const [spaceId, toDelete] of Object.entries(deletionSelection)) {
      if (toDelete) {
        const deleteDataButton = await client.$(
          `*[data-space-id='${spaceId}'] .${EDIT_CLASSROOM_DELETE_DATA_BUTTON_CLASS}`
        );
        await deleteDataButton.click();
      }
    }
  }
  const validateButton = await client.$(
    `#${EDIT_CLASSROOM_VALIDATE_BUTTON_ID}`
  );
  await validateButton.click();
  await client.pause(MODAL_CLOSE_PAUSE);
};

const deleteClassroom = async (client, name) => {
  // search based on name since id is generated on the fly
  const classroomSelector = `.${CLASSROOM_CARD_CLASS}[data-name='${name}']`;

  const deleteButton = await client.$(
    `${classroomSelector} .${DELETE_CLASSROOM_BUTTON_CLASS}`
  );
  await deleteButton.click();
  await client.pause(DELETE_CLASSROOM_PAUSE);
};

const addUserInClassroom = async (client, username) => {
  await (await client.$(`#${ADD_USER_IN_CLASSROOM_BUTTON_ID}`)).click();
  await client.pause(MODAL_OPEN_PAUSE);
  const usernameInput = `#${ADD_USER_IN_CLASSROOM_NAME_INPUT_ID}`;
  await clearInput(client, usernameInput);
  await (await client.$(usernameInput)).setValue(username);
  await client.pause(INPUT_TYPE_PAUSE);
  await (
    await client.$(`#${ADD_USER_IN_CLASSROOM_VALIDATE_BUTTON_ID}`)
  ).click();
  await client.pause(MODAL_CLOSE_PAUSE);
};

const deleteUserInClassroom = async (client, username) => {
  // search based on name since id is generated on the fly
  const userRowSelector = `#${CLASSROOM_TABLE_BODY_ID} tr[data-name='${username}']`;

  const deleteUserButton = await client.$(
    `${userRowSelector} .${DELETE_USER_IN_CLASSROOM_BUTTON_CLASS}`
  );
  await deleteUserButton.click();
  await client.pause(DELETE_USER_IN_CLASSROOM_PAUSE);
};

const deleteUsersInClassroom = async (client, usernames) => {
  // check all rows for given usernames
  for (const username of usernames) {
    // search based on name since id is generated on the fly
    const userRowSelector = `#${CLASSROOM_TABLE_BODY_ID} tr[data-name='${username}']`;
    const selectUser = await client.$(
      `${userRowSelector} .${SELECT_USER_IN_CLASSROOM_CLASS}`
    );
    await selectUser.click();
  }
  await (await client.$(`#${DELETE_USERS_IN_CLASSROOM_BUTTON_ID}`)).click();
  await client.pause(DELETE_USER_IN_CLASSROOM_PAUSE);
};

// changes is appended to username
const editUserInClassroom = async (
  client,
  username,
  { username: newUsername, deletionSelection }
) => {
  // search based on name since id is generated on the fly
  const userRowSelector = `tr[data-name='${username}']`;

  await (
    await client.$(`${userRowSelector} .${EDIT_USER_IN_CLASSROOM_BUTTON_CLASS}`)
  ).click();
  await client.pause(MODAL_OPEN_PAUSE);

  // edit username
  const editInput = `#${EDIT_USER_IN_CLASSROOM_USERNAME_INPUT_ID}`;
  if (newUsername) {
    await clearInput(client, editInput);
    await (await client.$(editInput)).setValue(newUsername);
    await client.pause(INPUT_TYPE_PAUSE);
  }

  // check data to delete
  if (deletionSelection) {
    for (const [spaceId, toDelete] of Object.entries(deletionSelection)) {
      if (toDelete) {
        await (
          await client.$(
            `*[data-space-id='${spaceId}'] .${EDIT_USER_IN_CLASSROOM_DELETE_DATA_BUTTON_CLASS}`
          )
        ).click();
      }
    }
  }

  // submit changes
  await (
    await client.$(`#${EDIT_USER_IN_CLASSROOM_VALIDATE_BUTTON_ID}`)
  ).click();
  await client.pause(MODAL_CLOSE_PAUSE);
};

/**
 * Check whether the students table displays the correct data
 * @param {Object[]} usernames: list of users
 * @param {string} usernames[].username: username of a user
 * @param {Object<string, boolean>} usernames[].actions: map object describing whether the user has actions for a spaceId
 * @param {Object<string, boolean>} usernames[].resources: map object describing whether the user has resources for a spaceId
 */
const hasStudentsTableLayout = async (client, spaces = [], usernames = []) => {
  // no user should have no table row
  if (!usernames.length) {
    await expectElementToNotExist(
      client,
      `#${CLASSROOM_TABLE_BODY_ID} tr[data-name]`
    );
  }

  // check space columns
  for (const spaceId of spaces) {
    const headCellSelector = `#${buildTableCellSpaceId(spaceId)}`;
    await expectElementToExist(client, headCellSelector);
  }

  // check user rows
  for (const { username, actions = {}, resources = {} } of usernames) {
    const userRowSelector = `#${CLASSROOM_TABLE_BODY_ID} tr[data-name='${username}']`;
    await expectElementToExist(client, userRowSelector);

    if (!_.isEmpty(actions)) {
      for (const [spaceId, exists] of Object.entries(actions)) {
        const actionsSelector = `${userRowSelector} *[data-head-cell-id='${spaceId}'] .${STUDENT_ROW_ACTIONS_CLASS}`;
        if (exists) {
          await expectElementToExist(client, actionsSelector);
        } else {
          await expectElementToNotExist(client, actionsSelector);
        }
      }
    }

    if (!_.isEmpty(resources)) {
      for (const [spaceId, exists] of Object.entries(resources)) {
        const resourcesSelector = `${userRowSelector} *[data-head-cell-id='${spaceId}'] .${STUDENT_ROW_RESOURCES_CLASS}`;
        if (exists) {
          await expectElementToExist(client, resourcesSelector);
        } else {
          await expectElementToNotExist(client, resourcesSelector);
        }
      }
    }
  }
};

const hasClassroomCardLayout = async (
  client,
  name,
  nbSpace = 0,
  nbStudent = 0
) => {
  const classroomSelector = `.${CLASSROOM_CARD_CLASS}[data-name='${name}']`;
  await expectElementToExist(client, classroomSelector);

  // check title
  const title = await (
    await client.$(`${classroomSelector} .${CLASSROOM_CARD_NAME_CLASS}`)
  ).getText();
  expect(title).to.equal(name);

  // check space number
  const spacesText = await (
    await client.$(`${classroomSelector} .${CLASSROOM_CARD_SPACES_CLASS}`)
  ).getText();
  expect(spacesText).to.include(nbSpace);

  // check student number
  const studentsText = await (
    await client.$(`${classroomSelector} .${CLASSROOM_CARD_STUDENTS_CLASS}`)
  ).getText();
  expect(studentsText).to.include(nbStudent);
};

const importDataInClassroom = async (
  client,
  filepath,
  username,
  isChecked = { space: true, actions: false, resources: false },
  shouldCheck = { actions: false, resources: false }
) => {
  // submit filepath
  const absolutePath = path.resolve(__dirname, './fixtures/spaces', filepath);
  await (await client.$(`#${IMPORT_DATA_IN_CLASSROOM_BUTTON_ID}`)).click();
  await client.pause(OPEN_IMPORT_DATA_IN_CLASSROOM_PAUSE);
  await (await client.$(`#${IMPORT_FILEPATH_IN_CLASSROOM_INPUT_ID}`)).setValue(
    absolutePath
  );
  await client.pause(INPUT_TYPE_PAUSE);
  await (
    await client.$(`#${IMPORT_DATA_IN_CLASSROOM_SUBMIT_BUTTON_ID}`)
  ).click();
  await client.pause(LOAD_SELECTION_SPACE_PAUSE);

  const select = await client.$(
    `.${IMPORT_DATA_IN_CLASSROOM_STUDENT_SELECT_CONTAINER_CLASS}`
  );
  // assign user
  await select.click();
  const optionSelector = `.${IMPORT_DATA_IN_CLASSROOM_STUDENT_SELECT_PREFIX_CLASS}__option`;
  const option = await client.$(optionSelector);
  // check username exists : have option and one of them contains username
  let userExists = await option.isExisting();
  let index = -1;
  if (userExists) {
    // find position of username, click on this option
    let options = await option.getText();
    if (!Array.isArray(options)) {
      options = [options];
    }
    index = options.indexOf(username);
    userExists = index >= 0;
  }

  if (userExists) {
    // click on option
    await client.pause(SELECT_OPEN_PAUSE);
    await (await client.$(`${optionSelector}:nth-child(${index + 1})`)).click();
    await client.pause(2000);
  } else {
    // create username
    await (
      await client.$(
        `.${IMPORT_DATA_IN_CLASSROOM_STUDENT_SELECT_PREFIX_CLASS}__input input`
      )
    ).setValue([username, 'Enter']); // set Enter to validate username in select
    await client.pause(INPUT_TYPE_PAUSE);
  }

  // select load options
  await checkLoadSelectionLayout(client, isChecked);
  await setCheckboxesTo(client, shouldCheck);

  await (
    await client.$(`#${IMPORT_DATA_CLASSROOM_VALIDATE_BUTTON_ID}`)
  ).click();
  await client.pause(LOAD_SELECTION_SPACE_PAUSE);

  // return to classroom
  await (await client.$(`#${IMPORT_DATA_IN_CLASSROOM_BACK_BUTTON_ID}`)).click();
  await client.pause(OPEN_CLASSROOM_PAUSE);
};

describe('Classrooms Scenarios', function () {
  this.timeout(DEFAULT_GLOBAL_TIMEOUT);
  let app;

  afterEach(function () {
    return closeApplication(app);
  });

  describe('Student', function () {
    beforeEach(
      mochaAsync(async () => {
        app = await createApplication();
        const { client } = app;
        await userSignIn(client, USER_GRAASP);
        await menuGoToSettings(client);
        await toggleStudentMode(client, true);
      })
    );

    it(
      'cannot access classrooms',
      mochaAsync(async () => {
        const { client } = app;

        await openDrawer(client);
        await expectElementToNotExist(client, `#${CLASSROOMS_MENU_ITEM_ID}`);
      })
    );
  });

  describe('Teacher', function () {
    it(
      'manage a classroom (add, edit, remove)',
      mochaAsync(async () => {
        app = await createApplication({ showMessageDialogResponse: 1 });

        const { client } = app;

        await userSignIn(client, USER_GRAASP);

        await menuGoToClassrooms(client);

        // default content empty
        await expectElementToExist(client, `#${NO_CLASSROOM_AVAILABLE_ID}`);

        const name = 'classroomname';

        // open and cancel modal
        await (await client.$(`#${ADD_CLASSROOM_BUTTON_ID}`)).click();
        await client.pause(MODAL_OPEN_PAUSE);
        await (await client.$(`#${CLASSROOM_NAME_INPUT_ID}`)).setValue(name);
        await client.pause(INPUT_TYPE_PAUSE);
        await (await client.$(`#${ADD_CLASSROOM_CANCEL_BUTTON_ID}`)).click();
        await client.pause(MODAL_CLOSE_PAUSE);
        await expectElementToExist(client, `#${NO_CLASSROOM_AVAILABLE_ID}`);

        // add classroom
        await addClassroom(client, name);
        await hasClassroomCardLayout(client, name);

        // edit
        // search based on name since id is generated on the fly
        const editSelector = await client.$(
          `.${CLASSROOM_CARD_CLASS}[data-name='${name}'] .${EDIT_CLASSROOM_BUTTON_CLASS}`
        );
        await editSelector.click();
        const newName = 'new name';
        await editClassroom(client, name, { name: newName });
        await expectElementToExist(
          client,
          `.${CLASSROOM_CARD_CLASS}[data-name='${newName}']`
        );

        // delete
        await deleteClassroom(client, newName);
        await expectElementToExist(client, `#${NO_CLASSROOM_AVAILABLE_ID}`);
      })
    );

    it(
      'classrooms are saved for a given teacher',
      mochaAsync(async () => {
        app = await createApplication({});

        const { client } = app;

        // add classroom as alice
        await userSignIn(client, USER_ALICE);

        await menuGoToClassrooms(client);

        // default content empty
        await expectElementToExist(client, `#${NO_CLASSROOM_AVAILABLE_ID}`);

        const name = 'classroomname';

        // add classroom
        await addClassroom(client, name);
        await expectElementToExist(
          client,
          `.${CLASSROOM_CARD_CLASS}[data-name='${name}']`
        );

        await menuGoToSignOut(client);

        // add classroom as graasp
        await userSignIn(client, USER_GRAASP);

        await menuGoToClassrooms(client);

        // default content empty
        await expectElementToExist(client, `#${NO_CLASSROOM_AVAILABLE_ID}`);

        const name1 = 'classroomname1';

        // add classroom
        await addClassroom(client, name1);
        await expectElementToExist(
          client,
          `.${CLASSROOM_CARD_CLASS}[data-name='${name1}']`
        );
      })
    );

    it(
      'manage a student in a classroom (add, remove, edit)',
      mochaAsync(async () => {
        app = await createApplication({ showMessageDialogResponse: 1 });

        const { client } = app;

        await userSignIn(client, USER_GRAASP);

        await menuGoToClassrooms(client);

        // default content empty
        await expectElementToExist(client, `#${NO_CLASSROOM_AVAILABLE_ID}`);

        const name = 'classroomname';

        // add classroom
        await addClassroom(client, name);
        await openClassroom(client, name);

        // add user
        const username = 'anna';
        await addUserInClassroom(client, username);
        await hasStudentsTableLayout(client, [], [{ username }]);

        // add two users
        const username1 = 'bob';
        await addUserInClassroom(client, username1);
        await hasStudentsTableLayout(
          client,
          [],
          [{ username }, { username: username1 }]
        );
        const username2 = 'cedric';
        await addUserInClassroom(client, username2);
        await hasStudentsTableLayout(
          client,
          [],
          [{ username }, { username: username1 }, { username: username2 }]
        );

        // edit user
        const newName = 'new name';
        await editUserInClassroom(client, username, { username: newName });
        await hasStudentsTableLayout(
          client,
          [],
          [
            { username: newName },
            { username: username1 },
            { username: username2 },
          ]
        );

        // check classroom layout
        await (await client.$(`#${CLASSROOM_SCREEN_BACK_BUTTON_ID}`)).click();
        await hasClassroomCardLayout(client, name, 0, 3);

        // check data is not shared between classrooms
        // create new classroom
        const classroomName = 'name';
        await addClassroom(client, classroomName);
        await hasClassroomCardLayout(client, classroomName, 0, 0);

        // delete user in first classroom
        await openClassroom(client, name);
        await deleteUserInClassroom(client, newName);
        await client.pause(TOOLTIP_FADE_OUT_PAUSE);
        await hasStudentsTableLayout(
          client,
          [],
          [{ username: username1 }, { username: username2 }]
        );

        // delete two users in classroom
        await deleteUsersInClassroom(client, [username1, username2]);
        await hasStudentsTableLayout(client, [], []);
      })
    );

    describe('manage space data in classroom', function () {
      beforeEach(
        mochaAsync(async () => {
          app = await createApplication();

          const { client } = app;

          await userSignIn(client, USER_GRAASP);

          await menuGoToClassrooms(client);
        })
      );

      it(
        'manage data for existing student (add, remove data, remove space)',
        mochaAsync(async () => {
          const { client } = app;

          const filepath = SPACE_ATOMIC_STRUCTURE_WITH_ACTIONS_AND_RESOURCES_PATH;

          const classroomName = 'classroomname';

          // add classroom
          await addClassroom(client, classroomName);
          await (
            await client.$(
              `.${CLASSROOM_CARD_CLASS}[data-name='${classroomName}']`
            )
          ).click();
          await client.pause(OPEN_CLASSROOM_PAUSE);

          // add user
          const username = 'anna';
          await addUserInClassroom(client, username);

          // import data
          await importDataInClassroom(
            client,
            filepath,
            username,
            { space: true, actions: true, resources: true },
            { space: true, actions: true, resources: true }
          );

          const spaceId =
            SPACE_ATOMIC_STRUCTURE_WITH_ACTIONS_AND_RESOURCES.space.id;
          const spaces = [spaceId];
          await hasStudentsTableLayout(client, spaces, [
            {
              username,
              actions: { [spaceId]: true },
              resources: { [spaceId]: true },
            },
          ]);

          // remove space data for user
          const deletionSelection = {
            [SPACE_ATOMIC_STRUCTURE_WITH_ACTIONS_AND_RESOURCES.space.id]: true,
          };
          await editUserInClassroom(client, username, { deletionSelection });

          await hasStudentsTableLayout(client, spaces, [
            {
              username,
              actions: { [spaceId]: false },
              resources: { [spaceId]: false },
            },
          ]);

          // remove space from classroom
          await (await client.$(`.${EDIT_CLASSROOM_BUTTON_CLASS}`)).click();
          await editClassroom(client, classroomName, { deletionSelection });

          await hasStudentsTableLayout(
            client,
            [],
            [
              {
                username,
                actions: { [spaceId]: false },
                resources: { [spaceId]: false },
              },
            ]
          );
        })
      );

      it(
        'and create new student',
        mochaAsync(async () => {
          const { client } = app;

          const filepath = SPACE_ATOMIC_STRUCTURE_WITH_ACTIONS_AND_RESOURCES_PATH;

          const classroomName = 'classroomname';

          // add classroom
          await addClassroom(client, classroomName);
          await (
            await client.$(
              `.${CLASSROOM_CARD_CLASS}[data-name='${classroomName}']`
            )
          ).click();
          await client.pause(OPEN_CLASSROOM_PAUSE);

          const username = 'bob';

          // import data
          await importDataInClassroom(
            client,
            filepath,
            username,
            { space: true, actions: true, resources: true },
            { space: true, actions: true, resources: true }
          );

          const spaceId =
            SPACE_ATOMIC_STRUCTURE_WITH_ACTIONS_AND_RESOURCES.space.id;
          await hasStudentsTableLayout(
            client,
            [spaceId],
            [
              {
                username,
                actions: { [spaceId]: true },
                resources: { [spaceId]: true },
              },
            ]
          );

          // import data
          const username1 = 'cedric';
          await importDataInClassroom(
            client,
            SPACE_APOLLO_11_PATH,
            username1,
            { space: true, actions: false, resources: false },
            { space: true, actions: false, resources: false }
          );

          const spaceId1 = SPACE_APOLLO_11.space.id;
          await hasStudentsTableLayout(
            client,
            [spaceId, spaceId1],
            [
              {
                username,
                actions: { [spaceId]: true, [spaceId1]: false },
                resources: { [spaceId]: true, [spaceId1]: false },
              },
              {
                username: username1,
                actions: { [spaceId1]: false, [spaceId]: false },
                resources: { [spaceId1]: false, [spaceId]: false },
              },
            ]
          );
        })
      );

      it(
        'add twice a space will replace data',
        mochaAsync(async () => {
          const { client } = app;

          const filepath = SPACE_ATOMIC_STRUCTURE_WITH_ACTIONS_AND_RESOURCES_PATH;

          const classroomName = 'classroomname';

          // add classroom
          await addClassroom(client, classroomName);
          await (
            await client.$(
              `.${CLASSROOM_CARD_CLASS}[data-name='${classroomName}']`
            )
          ).click();
          await client.pause(OPEN_CLASSROOM_PAUSE);

          const username = 'bob';

          // import data
          await importDataInClassroom(
            client,
            filepath,
            username,
            { space: true, actions: true, resources: true },
            { space: true, actions: true, resources: true }
          );

          const spaceId =
            SPACE_ATOMIC_STRUCTURE_WITH_ACTIONS_AND_RESOURCES.space.id;
          await hasStudentsTableLayout(
            client,
            [spaceId],
            [
              {
                username,
                actions: { [spaceId]: true },
                resources: { [spaceId]: true },
              },
            ]
          );

          // import data
          const username1 = 'cedric';
          await importDataInClassroom(
            client,
            filepath,
            username1,
            { space: false, actions: true, resources: true },
            { space: false, actions: true, resources: true }
          );

          await hasStudentsTableLayout(
            client,
            [spaceId],
            [
              {
                username,
                actions: { [spaceId]: false },
                resources: { [spaceId]: false },
              },
              {
                username: username1,
                actions: { [spaceId]: true },
                resources: { [spaceId]: true },
              },
            ]
          );
        })
      );
    });
  });
});
