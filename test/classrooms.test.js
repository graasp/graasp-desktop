/* eslint-disable no-unused-expressions */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { expect } from 'chai';
import {
  mochaAsync,
  expectElementToNotExist,
  expectElementToExist,
  toggleStudentMode,
  clearInput,
} from './utils';
import { createApplication, closeApplication } from './application';
import {
  CLASSROOMS_MENU_ITEM_ID,
  ADD_CLASSROOM_BUTTON_ID,
  ADD_CLASSROOM_NAME_INPUT_ID,
  ADD_CLASSROOM_VALIDATE_BUTTON_ID,
  ADD_CLASSROOM_CANCEL_BUTTON_ID,
  CLASSROOM_CARD_CLASS,
  NO_CLASSROOM_AVAILABLE_ID,
  EDIT_CLASSROOM_INPUT_ID,
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
} from './constants';
import { openDrawer, menuGoToSettings, menuGoToClassrooms } from './menu.test';
import { userSignIn } from './userSignIn.test';
import { USER_GRAASP } from './fixtures/users';

const openClassroom = async (client, name) => {
  await client.click(`.${CLASSROOM_CARD_CLASS}[data-name='${name}']`);
  await client.pause(OPEN_CLASSROOM_PAUSE);
};

const addClassroom = async (client, name) => {
  await client.click(`#${ADD_CLASSROOM_BUTTON_ID}`);
  await client.pause(MODAL_OPEN_PAUSE);
  const inputSelector = `#${ADD_CLASSROOM_NAME_INPUT_ID}`;
  await clearInput(client, inputSelector);
  await client.setValue(inputSelector, name);
  await client.pause(INPUT_TYPE_PAUSE);
  await client.click(`#${ADD_CLASSROOM_VALIDATE_BUTTON_ID}`);
  await client.pause(MODAL_CLOSE_PAUSE);
};

const editClassroom = async (client, name, newName) => {
  // search based on name since id is generated on the fly
  const classroomSelector = `.${CLASSROOM_CARD_CLASS}[data-name='${name}']`;

  await client.click(`${classroomSelector} .${EDIT_CLASSROOM_BUTTON_CLASS}`);
  await client.pause(MODAL_OPEN_PAUSE);
  const editInput = `#${EDIT_CLASSROOM_INPUT_ID}`;
  await clearInput(client, editInput);
  await client.setValue(editInput, newName);
  await client.pause(INPUT_TYPE_PAUSE);
  await client.click(`#${EDIT_CLASSROOM_VALIDATE_BUTTON_ID}`);
  await client.pause(MODAL_CLOSE_PAUSE);
};

const deleteClassroom = async (client, name) => {
  // search based on name since id is generated on the fly
  const classroomSelector = `.${CLASSROOM_CARD_CLASS}[data-name='${name}']`;

  await client.click(`${classroomSelector} .${DELETE_CLASSROOM_BUTTON_CLASS}`);
  await client.pause(DELETE_CLASSROOM_PAUSE);
};

const addUserInClassroom = async (client, username) => {
  await client.click(`#${ADD_USER_IN_CLASSROOM_BUTTON_ID}`);
  await client.pause(MODAL_OPEN_PAUSE);
  const usernameInput = `#${ADD_USER_IN_CLASSROOM_NAME_INPUT_ID}`;
  await clearInput(client, usernameInput);
  await client.setValue(usernameInput, username);
  await client.pause(INPUT_TYPE_PAUSE);
  await client.click(`#${ADD_USER_IN_CLASSROOM_VALIDATE_BUTTON_ID}`);
  await client.pause(MODAL_CLOSE_PAUSE);
};

const deleteUserInClassroom = async (client, username) => {
  // search based on name since id is generated on the fly
  const userRowSelector = `#${CLASSROOM_TABLE_BODY_ID} tr[data-name='${username}']`;

  await client.click(
    `${userRowSelector} .${DELETE_USER_IN_CLASSROOM_BUTTON_CLASS}`
  );
  await client.pause(DELETE_USER_IN_CLASSROOM_PAUSE);
};

const deleteUsersInClassroom = async (client, usernames) => {
  // check all rows for given usernames
  for (const username of usernames) {
    // search based on name since id is generated on the fly
    const userRowSelector = `#${CLASSROOM_TABLE_BODY_ID} tr[data-name='${username}']`;
    await client.click(`${userRowSelector} .${SELECT_USER_IN_CLASSROOM_CLASS}`);
  }
  await client.click(`#${DELETE_USERS_IN_CLASSROOM_BUTTON_ID}`);
  await client.pause(DELETE_USER_IN_CLASSROOM_PAUSE);
};

// changes is appended to username
const editUserInClassroom = async (client, username, changes) => {
  // search based on name since id is generated on the fly
  const userRowSelector = `tr[data-name='${username}']`;

  await client.click(
    `${userRowSelector} .${EDIT_USER_IN_CLASSROOM_BUTTON_CLASS}`
  );
  await client.pause(MODAL_OPEN_PAUSE);
  const editInput = `#${EDIT_USER_IN_CLASSROOM_USERNAME_INPUT_ID}`;
  await client.setValue(editInput, changes);
  await client.pause(INPUT_TYPE_PAUSE);
  await client.click(`#${EDIT_USER_IN_CLASSROOM_VALIDATE_BUTTON_ID}`);
  await client.pause(MODAL_CLOSE_PAUSE);
};

const hasStudentsTableLayout = async (client, usernames = []) => {
  // no user should have no table row
  if (!usernames.length) {
    await expectElementToNotExist(
      client,
      `#${CLASSROOM_TABLE_BODY_ID} tr[data-name]`
    );
  }

  for (const username of usernames) {
    await expectElementToExist(
      client,
      `#${CLASSROOM_TABLE_BODY_ID} tr[data-name='${username}']`
    );
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
  const title = await client.getText(
    `${classroomSelector} .${CLASSROOM_CARD_NAME_CLASS}`
  );
  expect(title).to.equal(name);

  // check space number
  const spacesText = await client.getText(
    `${classroomSelector} .${CLASSROOM_CARD_SPACES_CLASS}`
  );
  expect(spacesText).to.include(nbSpace);

  // check student number
  const studentsText = await client.getText(
    `${classroomSelector} .${CLASSROOM_CARD_STUDENTS_CLASS}`
  );
  expect(studentsText).to.include(nbStudent);
};

describe('Classrooms Scenarios', function() {
  this.timeout(DEFAULT_GLOBAL_TIMEOUT);
  let app;

  afterEach(function() {
    return closeApplication(app);
  });

  describe('Student', function() {
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

  describe('Teacher', function() {
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
        await client.click(`#${ADD_CLASSROOM_BUTTON_ID}`);
        await client.pause(MODAL_OPEN_PAUSE);
        await client.setValue(`#${ADD_CLASSROOM_NAME_INPUT_ID}`, name);
        await client.pause(INPUT_TYPE_PAUSE);
        await client.click(`#${ADD_CLASSROOM_CANCEL_BUTTON_ID}`);
        await client.pause(MODAL_CLOSE_PAUSE);
        await expectElementToExist(client, `#${NO_CLASSROOM_AVAILABLE_ID}`);

        // add classroom
        await addClassroom(client, name);
        await hasClassroomCardLayout(client, name);

        // edit
        const newName = 'graasp';
        await editClassroom(client, name, newName);
        await hasClassroomCardLayout(client, newName);

        // delete
        await deleteClassroom(client, newName);
        await expectElementToExist(client, `#${NO_CLASSROOM_AVAILABLE_ID}`);
      })
    );

    it.skip(
      'classrooms are saved for a given teacher',
      mochaAsync(async () => {})
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
        await hasStudentsTableLayout(client, [username]);

        // add two users
        const username1 = 'bob';
        await addUserInClassroom(client, username1);
        await hasStudentsTableLayout(client, [username, username1]);
        const username2 = 'cedric';
        await addUserInClassroom(client, username2);
        await hasStudentsTableLayout(client, [username, username1, username2]);

        // edit user
        const changes = ' g.';
        const newName = username + changes;
        await editUserInClassroom(client, username, changes);
        await hasStudentsTableLayout(client, [newName]);

        // check classroom layout
        await client.click(`#${CLASSROOM_SCREEN_BACK_BUTTON_ID}`);
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
        await hasStudentsTableLayout(client, [username1, username2]);

        // delete two users in classroom
        await deleteUsersInClassroom(client, [username1, username2]);
        await hasStudentsTableLayout(client, []);
      })
    );

    it.skip(
      'add data for a student (add, remove)',
      mochaAsync(async () => {
        // todo: check students table layout: spaces, all users
      })
    );
  });
});
