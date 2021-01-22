/* eslint-disable no-await-in-loop */
import {
  mochaAsync,
  userSignIn,
  menuGoToSavedSpaces,
  menuGoToSignOut,
  buildSignedInUserForDatabase,
  menuGoToPhase,
  clickOnSpaceCard,
} from '../utils';
import { createApplication, closeApplication } from '../application';
import { SPACE_ATOMIC_STRUCTURE } from '../fixtures/spaces';
import { SAVE_USER_INPUT_TIMEOUT } from '../constants';
import { USER_GRAASP, USER_BOB, USER_ALICE } from '../fixtures/users';
import {
  typeInTextInputApp,
  checkTextInputAppContainsText,
} from '../apps/textInputApp';

const userInputTextForUser = (name) => `user input from ${name}`;

describe('Save User Input in a space', function () {
  this.timeout(SAVE_USER_INPUT_TIMEOUT);
  let app;

  afterEach(() => closeApplication(app));

  describe('Use graasp user', () => {
    beforeEach(
      mochaAsync(async () => {
        app = await createApplication({
          database: {
            spaces: [SPACE_ATOMIC_STRUCTURE],
            ...buildSignedInUserForDatabase(),
          },
          responses: { showMessageDialogResponse: 1 },
        });
      })
    );

    it(
      'User input when typing in text app is saved ',
      mochaAsync(async () => {
        const { client } = app;
        const text = 'user input';
        const {
          space: { id, phases },
        } = SPACE_ATOMIC_STRUCTURE;
        const { id: textInputAppId } = phases[0].items[1];

        await menuGoToSavedSpaces(client);
        await clickOnSpaceCard(client, id);

        // go to orientation tab
        await menuGoToPhase(client, 0);

        // type in text input app
        await typeInTextInputApp(client, textInputAppId, text);

        // go back to home
        await menuGoToSavedSpaces(client);

        // check user input is saved
        await clickOnSpaceCard(client, id);

        await menuGoToPhase(client, 0);
        await checkTextInputAppContainsText(client, textInputAppId, text);
      })
    );
  });

  describe('Multiple users scenarios', () => {
    beforeEach(
      mochaAsync(async () => {
        app = await createApplication({
          database: { spaces: [SPACE_ATOMIC_STRUCTURE] },
          responses: { showMessageDialogResponse: 1 },
        });
      })
    );

    it(
      'User input when typing in text app is saved for different users',
      mochaAsync(async () => {
        const { client } = app;
        const users = [USER_GRAASP, USER_ALICE, USER_BOB];

        const {
          space: { id, phases },
        } = SPACE_ATOMIC_STRUCTURE;
        const { id: textInputAppId } = phases[0].items[1];

        for (const user of users) {
          await userSignIn(app.client, user);
          await menuGoToSavedSpaces(client);
          const text = userInputTextForUser(user.username);

          // note: this should change if users don't share spaces
          await menuGoToSavedSpaces(client);
          await clickOnSpaceCard(client, id);

          // go to orientation tab
          await menuGoToPhase(client, 0);

          // type in text input app
          await typeInTextInputApp(client, textInputAppId, text);

          // go back to home
          await menuGoToSavedSpaces(client);

          // check user input is saved
          await clickOnSpaceCard(client, id);

          await menuGoToPhase(client, 0);
          await checkTextInputAppContainsText(client, textInputAppId, text);

          await menuGoToSignOut(client);
        }

        // check user input still exist after logout
        for (const user of users) {
          await userSignIn(client, user);
          await menuGoToSavedSpaces(client);
          const text = userInputTextForUser(user.username);

          await clickOnSpaceCard(client, id);

          await menuGoToPhase(client, 0);
          await checkTextInputAppContainsText(client, textInputAppId, text);

          await menuGoToSignOut(client);
        }
      })
    );
  });
});
