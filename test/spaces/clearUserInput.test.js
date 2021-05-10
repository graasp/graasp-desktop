import {
  mochaAsync,
  userSignIn,
  menuGoToSavedSpaces,
  menuGoToPhase,
  menuGoToSignOut,
  buildSignedInUserForDatabase,
  clickOnSpaceCard,
} from '../utils';
import { createApplication, closeApplication } from '../application';
import {
  buildSpaceCardId,
  SPACE_CLEAR_BUTTON_CLASS,
  SPACE_CARD_LINK_CLASS,
} from '../../src/config/selectors';
import { SPACE_ATOMIC_STRUCTURE } from '../fixtures/spaces';
import { DEFAULT_GLOBAL_TIMEOUT } from '../constants';
import { USER_BOB, USER_ALICE } from '../fixtures/users';
import {
  typeInTextInputApp,
  checkTextInputAppContainsText,
} from '../apps/textInputApp';

// @TODO this should be changed to load user input from zip
describe('Clear User Input in a space', function () {
  this.timeout(DEFAULT_GLOBAL_TIMEOUT);
  let app;

  afterEach(() => closeApplication(app));

  describe('Use graasp user', () => {
    describe('Mock positive response for dialog', () => {
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
        'Clear from toolbar remove all user input in apps ',
        mochaAsync(async () => {
          const { client } = app;
          const {
            space: { phases, id: spaceId },
          } = SPACE_ATOMIC_STRUCTURE;
          const { id: textInputAppId0 } = phases[0].items[1];
          const { id: textInputAppId1 } = phases[1].items[1];
          const text0 = 'some user input orientation';
          const text1 = 'some user input conceptualisation';

          await menuGoToSavedSpaces(client);
          await clickOnSpaceCard(client, spaceId);

          // add user input
          await menuGoToPhase(client, 0);
          await typeInTextInputApp(client, textInputAppId0, text0);
          await menuGoToPhase(client, 1);
          await typeInTextInputApp(client, textInputAppId1, text1);

          // check it is still saved
          await menuGoToPhase(client, 0);
          await checkTextInputAppContainsText(client, textInputAppId0, text0);
          await menuGoToPhase(client, 1);
          await checkTextInputAppContainsText(client, textInputAppId1, text1);

          // clear
          const clearButton = await client.$(`.${SPACE_CLEAR_BUTTON_CLASS}`);
          await clearButton.click();

          // check space doesn't contain user input
          await menuGoToPhase(client, 0);
          await checkTextInputAppContainsText(client, textInputAppId0, '');
          await menuGoToPhase(client, 1);
          await checkTextInputAppContainsText(client, textInputAppId1, '');
        })
      );

      it(
        'Clear from card remove all user input in apps ',
        mochaAsync(async () => {
          const { client } = app;
          const {
            space: { id, phases },
          } = SPACE_ATOMIC_STRUCTURE;
          const { id: textInputAppId0 } = phases[0].items[1];
          const { id: textInputAppId1 } = phases[1].items[1];
          const text0 = 'some user input orientation';
          const text1 = 'some user input conceptualisation';

          await menuGoToSavedSpaces(client);
          await clickOnSpaceCard(client, id);

          // add user input
          await menuGoToPhase(client, 0);
          await typeInTextInputApp(client, textInputAppId0, text0);
          await menuGoToPhase(client, 1);
          await typeInTextInputApp(client, textInputAppId1, text1);

          // check it is still saved
          await menuGoToPhase(client, 0);
          await checkTextInputAppContainsText(client, textInputAppId0, text0);
          await menuGoToPhase(client, 1);
          await checkTextInputAppContainsText(client, textInputAppId1, text1);

          await menuGoToSavedSpaces(client);

          // clear user input
          const clearButton = await client.$(
            `#${buildSpaceCardId(id)} .${SPACE_CLEAR_BUTTON_CLASS}`
          );
          await clearButton.click();

          // check app doesn't contain user input
          const spaceCard = await client.$(
            `#${buildSpaceCardId(id)} .${SPACE_CARD_LINK_CLASS}`
          );
          await spaceCard.click();
          await menuGoToPhase(client, 0);
          await checkTextInputAppContainsText(client, textInputAppId0, '');
          await menuGoToPhase(client, 1);
          await checkTextInputAppContainsText(client, textInputAppId1, '');
        })
      );
    });

    describe('Mock negative response for dialog', () => {
      beforeEach(
        mochaAsync(async () => {
          app = await createApplication({
            database: {
              spaces: [SPACE_ATOMIC_STRUCTURE],
              ...buildSignedInUserForDatabase(),
            },
            responses: { showMessageDialogResponse: 0 },
          });
        })
      );

      it(
        'Cancel clear still contains user input',
        mochaAsync(async () => {
          const { client } = app;
          const {
            space: { phases, id: spaceId },
          } = SPACE_ATOMIC_STRUCTURE;
          const { id: textInputAppId0 } = phases[0].items[1];
          const { id: textInputAppId1 } = phases[1].items[1];
          const text0 = 'some user input orientation';
          const text1 = 'some user input conceptualisation';

          await menuGoToSavedSpaces(client);
          await clickOnSpaceCard(client, spaceId);

          // add user input
          await menuGoToPhase(client, 0);
          await typeInTextInputApp(client, textInputAppId0, text0);
          await menuGoToPhase(client, 1);
          await typeInTextInputApp(client, textInputAppId1, text1);

          await (await client.$(`.${SPACE_CLEAR_BUTTON_CLASS}`)).click();

          // check it is still saved
          await menuGoToPhase(client, 0);
          await checkTextInputAppContainsText(client, textInputAppId0, text0);
          await menuGoToPhase(client, 1);
          await checkTextInputAppContainsText(client, textInputAppId1, text1);
        })
      );
    });
  });

  describe('Use graasp user', () => {
    beforeEach(
      mochaAsync(async () => {
        app = await createApplication({
          database: {
            spaces: [SPACE_ATOMIC_STRUCTURE],
          },
          responses: { showMessageDialogResponse: 1 },
        });
      })
    );

    it(
      'Clear user input only for current user',
      mochaAsync(async () => {
        const { client } = app;
        const {
          space: { id, phases },
        } = SPACE_ATOMIC_STRUCTURE;
        const { id: textInputAppId0 } = phases[0].items[1];
        const { id: textInputAppId1 } = phases[1].items[1];
        const textAlice0 = 'some user input orientation alice';
        const textAlice1 = 'some user input conceptualisation alice';
        const textBob0 = 'some user input orientation bob';
        const textBob1 = 'some user input conceptualisation bob';

        // login as Alice, save user input
        await userSignIn(client, USER_ALICE);

        await menuGoToSavedSpaces(client);
        await clickOnSpaceCard(client, id);

        // add user input
        await menuGoToPhase(client, 0);
        await typeInTextInputApp(client, textInputAppId0, textAlice0);
        await menuGoToPhase(client, 1);
        await typeInTextInputApp(client, textInputAppId1, textAlice1);
        await menuGoToSignOut(client);

        // login as bob, save user input
        await userSignIn(client, USER_BOB);
        await menuGoToSavedSpaces(client);
        await clickOnSpaceCard(client, id);
        await menuGoToPhase(client, 0);
        await typeInTextInputApp(client, textInputAppId0, textBob0);
        await menuGoToPhase(client, 1);
        await typeInTextInputApp(client, textInputAppId1, textBob1);
        await menuGoToSignOut(client);

        // login as Alice, clear user input
        await userSignIn(client, USER_ALICE);
        await menuGoToSavedSpaces(client);
        await clickOnSpaceCard(client, id);
        await menuGoToPhase(client, 0);
        await checkTextInputAppContainsText(
          client,
          textInputAppId0,
          textAlice0
        );
        await menuGoToPhase(client, 1);
        await checkTextInputAppContainsText(
          client,
          textInputAppId1,
          textAlice1
        );
        await (await client.$(`.${SPACE_CLEAR_BUTTON_CLASS}`)).click();
        await menuGoToSignOut(client);

        // login as Bob, check user input are still saved
        await userSignIn(client, USER_BOB);
        await menuGoToSavedSpaces(client);
        await clickOnSpaceCard(client, id);
        await menuGoToPhase(client, 0);
        await checkTextInputAppContainsText(client, textInputAppId0, textBob0);
        await menuGoToPhase(client, 1);
        await checkTextInputAppContainsText(client, textInputAppId1, textBob1);
      })
    );
  });
});
