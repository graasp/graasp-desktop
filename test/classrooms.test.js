/* eslint-disable no-unused-expressions */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import {
  mochaAsync,
  expectElementToNotExist,
  expectElementToExist,
  toggleStudentMode,
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
} from '../src/config/selectors';
import {
  DEFAULT_GLOBAL_TIMEOUT,
  MODAL_CLOSE_PAUSE,
  MODAL_OPEN_PAUSE,
  INPUT_TYPE_PAUSE,
  DELETE_CLASSROOM_PAUSE,
} from './constants';
import { openDrawer, menuGoToSettings, menuGoToClassrooms } from './menu.test';
import { userSignIn } from './userSignIn.test';
import { USER_GRAASP } from './fixtures/users';

const addClassroom = async (client, name) => {
  await client.click(`#${ADD_CLASSROOM_BUTTON_ID}`);
  await client.pause(MODAL_OPEN_PAUSE);
  await client.setValue(`#${ADD_CLASSROOM_NAME_INPUT_ID}`, name);
  await client.pause(INPUT_TYPE_PAUSE);
  await client.click(`#${ADD_CLASSROOM_VALIDATE_BUTTON_ID}`);
  await client.pause(MODAL_CLOSE_PAUSE);
};

// newName is appended to name
const editClassroom = async (client, name, changes) => {
  // search based on name since id is generated on the fly
  const classroomSelector = `.${CLASSROOM_CARD_CLASS}[data-name='${name}']`;

  await client.click(`${classroomSelector} .${EDIT_CLASSROOM_BUTTON_CLASS}`);
  await client.pause(MODAL_OPEN_PAUSE);
  const editInput = `#${EDIT_CLASSROOM_INPUT_ID}`;
  await client.setValue(editInput, changes);
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
    beforeEach(mochaAsync(async () => {}));

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
        await expectElementToExist(
          client,
          `.${CLASSROOM_CARD_CLASS}[data-name='${name}']`
        );

        // edit
        const changes = ' graasp';
        const newName = name + changes;
        await editClassroom(client, name, changes);
        await expectElementToExist(
          client,
          `.${CLASSROOM_CARD_CLASS}[data-name='${newName}']`
        );

        // delete
        await deleteClassroom(client, newName);
        await expectElementToExist(client, `#${NO_CLASSROOM_AVAILABLE_ID}`);
      })
    );

    it.skip(
      'classrooms are saved for a given teacher',
      mochaAsync(async () => {})
    );

    it.skip(
      'manage a student in a classroom (add, remove, edit)',
      mochaAsync(async () => {
        // todo: check students table layout: spaces, all users
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
