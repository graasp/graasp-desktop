import { expect } from 'chai';
import path from 'path';
import {
  mochaAsync,
  expectElementToNotExist,
  expectElementToExist,
  clearInput,
  menuGoToClassrooms,
  menuGoToSignOut,
  userSignIn,
  buildSignedInUserForDatabase,
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
  MAIN_MENU_ID,
} from '../src/config/selectors';
import {
  DEFAULT_GLOBAL_TIMEOUT,
  MODAL_CLOSE_PAUSE,
  MODAL_OPEN_PAUSE,
  INPUT_TYPE_PAUSE,
  DELETE_CLASSROOM_PAUSE,
  DELETE_USER_IN_CLASSROOM_PAUSE,
  OPEN_CLASSROOM_PAUSE,
  LOAD_SELECTION_SPACE_PAUSE,
} from './constants';
import {
  USER_GRAASP,
  USER_ALICE,
  USER_BOB,
  USER_CEDRIC,
} from './fixtures/users';
import {
  checkLoadSelectionLayout,
  setCheckboxesTo,
} from './spaces/loadSpace.test';
import {
  SPACE_ATOMIC_STRUCTURE_WITH_ACTIONS_AND_RESOURCES,
  SPACE_APOLLO_11,
} from './fixtures/spaces';
import { SIMPLE_CLASSROOM } from './fixtures/classrooms';

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
    const users = await (
      await client.$(`#${CLASSROOM_TABLE_BODY_ID}`)
    ).getText();
    expect(users).to.equal('');
  }

  // check space columns
  for (const spaceId of spaces) {
    const headCellSelector = `#${buildTableCellSpaceId(spaceId)}`;
    await expectElementToExist(client, headCellSelector);
    for (const { username, actions = {}, resources = {} } of usernames) {
      const userRowSelector = `#${CLASSROOM_TABLE_BODY_ID} tr[data-name='${username}']`;
      await expectElementToExist(client, userRowSelector);
      const cellSelector = `${userRowSelector} *[data-head-cell-id='${spaceId}']`;
      if (actions[spaceId]) {
        await expectElementToExist(client, `.${STUDENT_ROW_ACTIONS_CLASS}`);
      } else {
        await expectElementToNotExist(
          client,
          cellSelector,
          STUDENT_ROW_ACTIONS_CLASS
        );
      }
      if (resources[spaceId]) {
        await expectElementToExist(client, `.${STUDENT_ROW_RESOURCES_CLASS}`);
      } else {
        await expectElementToNotExist(
          client,
          cellSelector,
          STUDENT_ROW_RESOURCES_CLASS
        );
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

  // return to classroom
  await (await client.$(`#${IMPORT_DATA_IN_CLASSROOM_BACK_BUTTON_ID}`)).click();
};

describe('Classrooms Scenarios', function () {
  this.timeout(DEFAULT_GLOBAL_TIMEOUT);
  let app;

  afterEach(() => closeApplication(app));

  describe('Student', () => {
    beforeEach(
      mochaAsync(async () => {
        app = await createApplication({ database: {} });
        const { client } = app;
        await userSignIn(client, USER_BOB);
      })
    );

    it(
      'cannot access classrooms',
      mochaAsync(async () => {
        const { client } = app;

        await openDrawer(client);
        await expectElementToNotExist(
          client,
          `#${MAIN_MENU_ID}`,
          CLASSROOMS_MENU_ITEM_ID
        );
      })
    );
  });

  describe('Teacher', () => {
    it(
      'manage a classroom (add, edit, remove)',
      mochaAsync(async () => {
        app = await createApplication({
          responses: { showMessageDialogResponse: 1 },
        });

        const { client } = app;

        await menuGoToClassrooms(client);

        // default content empty
        await expectElementToExist(client, `#${NO_CLASSROOM_AVAILABLE_ID}`);

        const { name } = SIMPLE_CLASSROOM;

        // open and cancel modal
        await (await client.$(`#${ADD_CLASSROOM_BUTTON_ID}`)).click();
        await (await client.$(`#${CLASSROOM_NAME_INPUT_ID}`)).setValue(name);
        await client.pause(INPUT_TYPE_PAUSE);
        await (await client.$(`#${ADD_CLASSROOM_CANCEL_BUTTON_ID}`)).click();
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
        app = await createApplication({ database: {} });

        const { client } = app;

        // add classroom as alice
        await userSignIn(client, USER_ALICE);

        await menuGoToClassrooms(client);

        // default content empty
        await expectElementToExist(client, `#${NO_CLASSROOM_AVAILABLE_ID}`);

        const { name } = SIMPLE_CLASSROOM;

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
        const { name } = SIMPLE_CLASSROOM;
        const id = 'classroomId';

        app = await createApplication({
          database: {
            classrooms: [
              {
                spaces: [],
                appInstanceResources: [],
                actions: [],
                users: [],
                id,
                name,
                createdAt: Date.now(),
                updatedAt: Date.now(),
                teacherId: USER_GRAASP.id,
              },
            ],
            ...buildSignedInUserForDatabase(),
          },
          responses: { showMessageDialogResponse: 1 },
        });

        const { client } = app;

        await menuGoToClassrooms(client);

        await openClassroom(client, name);

        // add user
        const { username } = USER_ALICE;
        await addUserInClassroom(client, username);
        await hasStudentsTableLayout(client, [], [{ username }]);

        // add two users
        const { username: bobUsername } = USER_BOB;
        await addUserInClassroom(client, bobUsername);
        await hasStudentsTableLayout(
          client,
          [],
          [{ username }, { username: bobUsername }]
        );
        const { username: cedricUsername } = USER_CEDRIC;
        await addUserInClassroom(client, cedricUsername);
        await hasStudentsTableLayout(
          client,
          [],
          [
            { username },
            { username: bobUsername },
            { username: cedricUsername },
          ]
        );

        // edit user
        const newName = 'new name';
        await editUserInClassroom(client, username, { username: newName });
        await hasStudentsTableLayout(
          client,
          [],
          [
            { username: newName },
            { username: bobUsername },
            { username: cedricUsername },
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
        await hasStudentsTableLayout(
          client,
          [],
          [{ username: bobUsername }, { username: cedricUsername }]
        );

        // delete two users in classroom
        await deleteUsersInClassroom(client, [bobUsername, cedricUsername]);
        await hasStudentsTableLayout(client, [], []);
      })
    );

    describe('manage space data in classroom', () => {
      const { name: classroomName } = SIMPLE_CLASSROOM;
      const user = USER_ALICE;

      beforeEach(
        mochaAsync(async () => {
          app = await createApplication({
            database: {
              classrooms: [
                {
                  spaces: [],
                  appInstanceResources: [],
                  actions: [],
                  users: [],
                  id: 'someid',
                  name: classroomName,
                  createdAt: Date.now(),
                  updatedAt: Date.now(),
                  teacherId: USER_GRAASP.id,
                },
              ],
              ...buildSignedInUserForDatabase(),
            },
          });

          const { client } = app;

          await menuGoToClassrooms(client);
        })
      );

      it(
        'manage data for existing student (add, remove data, remove space)',
        mochaAsync(async () => {
          const { client } = app;

          const filepath =
            SPACE_ATOMIC_STRUCTURE_WITH_ACTIONS_AND_RESOURCES.path;

          await (
            await client.$(
              `.${CLASSROOM_CARD_CLASS}[data-name='${classroomName}']`
            )
          ).click();
          await client.pause(OPEN_CLASSROOM_PAUSE);

          const { username } = user;

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
        'create new student',
        mochaAsync(async () => {
          const { client } = app;

          const filepath =
            SPACE_ATOMIC_STRUCTURE_WITH_ACTIONS_AND_RESOURCES.path;

          await (
            await client.$(
              `.${CLASSROOM_CARD_CLASS}[data-name='${classroomName}']`
            )
          ).click();
          await client.pause(OPEN_CLASSROOM_PAUSE);

          const { username } = USER_BOB;

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
          const { username: username1 } = USER_CEDRIC;
          await importDataInClassroom(
            client,
            SPACE_APOLLO_11.path,
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

          const filepath =
            SPACE_ATOMIC_STRUCTURE_WITH_ACTIONS_AND_RESOURCES.path;

          await (
            await client.$(
              `.${CLASSROOM_CARD_CLASS}[data-name='${classroomName}']`
            )
          ).click();

          const { username } = USER_BOB;

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
          const { username: username1 } = USER_CEDRIC;
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
