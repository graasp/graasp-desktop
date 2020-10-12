/* eslint-disable no-unused-expressions */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable func-names */
import { expect } from 'chai';
import {
  mochaAsync,
  expectElementToNotExist,
  expectElementToExist,
  toggleSyncAdvancedMode,
  userSignIn,
  menuGoToSettings,
} from '../utils';
import { createApplication, closeApplication } from '../application';
import {
  buildSpaceCardId,
  SPACE_SYNC_BUTTON_CLASS,
  PHASE_MENU_ITEM_HOME_ID,
  PHASE_MENU_LIST_ID,
  buildPhaseMenuItemId,
  SYNC_ACCEPT_BUTTON_ID,
  SPACE_DESCRIPTION_TEXT_CLASS,
  SPACE_THUMBNAIL_IMAGE_CLASS,
  SYNC_CANCEL_BUTTON_ID,
  SYNC_ADVANCED_MAIN_ID,
} from '../../src/config/selectors';
import {
  SPACE_WITH_ADDITION,
  SPACE_WITH_ADDITION_PATH,
  SPACE_WITH_ADDITION_CHANGES,
  SPACE_WITH_REMOVAL,
  SPACE_WITH_REMOVAL_CHANGES,
  SPACE_WITH_REMOVAL_PATH,
  SPACE_WITH_UPDATE,
  SPACE_WITH_UPDATE_CHANGES,
  SPACE_WITH_UPDATE_PATH,
  SPACE_WITH_MOVE,
  SPACE_WITH_MOVE_CHANGES,
  SPACE_WITH_MOVE_PATH,
  SPACE_WITH_TOOLS_UPDATE,
  SPACE_WITH_TOOLS_UPDATE_CHANGES,
  SPACE_WITH_TOOLS_UPDATE_PATH,
  SPACE_WITH_MULTIPLE_CHANGES,
  SPACE_WITH_MULTIPLE_CHANGES_CHANGES,
  SPACE_WITH_MULTIPLE_CHANGES_PATH,
} from '../fixtures/syncSpace';
import {
  SYNC_SPACE_PAUSE,
  SYNC_OPEN_SCREEN_PAUSE,
  DEFAULT_GLOBAL_TIMEOUT,
  LOAD_PHASE_PAUSE,
  LOAD_TAB_PAUSE,
} from '../constants';
import { USER_GRAASP } from '../fixtures/users';
import { loadSpaceById } from './loadSpace.test';
import { openTools, hasSavedSpaceLayout } from './visitSpace.test';
import { SYNC_CHANGES } from '../../src/config/constants';

const { ADDED, REMOVED, UPDATED, MOVED } = SYNC_CHANGES;

const spaces = [
  [SPACE_WITH_ADDITION, SPACE_WITH_ADDITION_CHANGES, SPACE_WITH_ADDITION_PATH],
  [SPACE_WITH_REMOVAL, SPACE_WITH_REMOVAL_CHANGES, SPACE_WITH_REMOVAL_PATH],
  [SPACE_WITH_UPDATE, SPACE_WITH_UPDATE_CHANGES, SPACE_WITH_UPDATE_PATH],
  [SPACE_WITH_MOVE, SPACE_WITH_MOVE_CHANGES, SPACE_WITH_MOVE_PATH],
  [
    SPACE_WITH_TOOLS_UPDATE,
    SPACE_WITH_TOOLS_UPDATE_CHANGES,
    SPACE_WITH_TOOLS_UPDATE_PATH,
  ],
  [
    SPACE_WITH_MULTIPLE_CHANGES,
    SPACE_WITH_MULTIPLE_CHANGES_CHANGES,
    SPACE_WITH_MULTIPLE_CHANGES_PATH,
  ],
];

const constructToolsPhase = (items) => ({
  name: 'Tools',
  items,
  change: items.length ? UPDATED : null,
});

const checkItemHasChange = async (client, selector, change) => {
  const el = await client.$$(selector);
  const prevEl = await el[0].getAttribute('class');
  const afterEl = await el[1]?.getAttribute('class');
  switch (change) {
    case UPDATED:
      // there exist 2 elements with the same data-id on update
      // only one has the highlight class
      expect(afterEl).to.include(change);
      break;
    case MOVED:
      // there exist 2 elements with the same data-id on move
      // both have the highlight class
      expect(prevEl).to.include(change);
      expect(afterEl).to.include(change);
      break;
    // on added and removed, there is only one element
    case ADDED:
    case REMOVED:
      expect(prevEl).to.include(change);
      break;
    default:
      console.log(`change "${change}" is not recognized`);
  }
};

const checkItemsHaveChanges = async (client, items) => {
  for (const { id, change } of items) {
    await checkItemHasChange(client, `[data-id='${id}']`, change);
  }
};

// check changes are correctly highlighted
const hasSyncVisualScreenLayout = async (
  client,
  { image, description, items: tools = [], phases }
) => {
  // check contains all phases in drawer + tools + home
  await expectElementToExist(client, `#${PHASE_MENU_ITEM_HOME_ID}`);

  // check space thumbnail
  if (image && image.change) {
    await checkItemHasChange(
      client,
      `.${SPACE_THUMBNAIL_IMAGE_CLASS}`,
      image.change
    );
  }

  // check space description
  if (description && description.change) {
    await checkItemHasChange(
      client,
      `.${SPACE_DESCRIPTION_TEXT_CLASS}`,
      description.change
    );
  }

  for (const [
    i,
    { name, previousName = '', change: phaseChange, items },
  ] of Object.entries([constructToolsPhase(tools), ...phases])) {
    const phase = await client.$(`#${buildPhaseMenuItemId(i)}`);

    // check phase name change
    const menuItemText = await phase.getText();
    expect(menuItemText).to.include(name);
    expect(menuItemText).to.include(previousName);

    // check phase contains class of corresponding change
    if (phaseChange) {
      const menuItemHtml = await phase.getHTML();
      expect(menuItemHtml).to.include(phaseChange);
    }

    // go to phase
    await phase.click();
    await client.pause(LOAD_PHASE_PAUSE);

    // check phase item contains class of corresponding change
    if (items && items.length) {
      await checkItemsHaveChanges(client, items);
    }
  }
};

const checkItemsAfterSync = async (client, items) => {
  for (const { id, change: itemChange } of items) {
    // check item change was applied
    const itemSelector = `[data-id='${id}']`;
    switch (itemChange) {
      case ADDED:
      case UPDATED:
      case MOVED:
        await expectElementToExist(client, itemSelector);
        break;
      case REMOVED:
        await expectElementToNotExist(client, itemSelector);
        break;
      default:
        console.log(`change "${itemChange}" not recognized`);
    }
  }
};

const checkChangesInSpace = async (client, { phases, items: tools = [] }) => {
  let phaseIdx = 0;
  for (const { name, items, change: phaseChange } of phases) {
    switch (phaseChange) {
      case REMOVED: {
        const li = await client.$(`#${PHASE_MENU_LIST_ID} li`);
        // check the removed phase text is not in phase menu
        let phaseMenuItemsText = await li.getText();
        if (Array.isArray(phaseMenuItemsText)) {
          phaseMenuItemsText = [phaseMenuItemsText];
        }
        expect(phaseMenuItemsText).to.not.include(name);
        break;
      }
      case ADDED:
      case UPDATED:
      default: {
        const phase = await client.$(`#${buildPhaseMenuItemId(phaseIdx)}`);
        const menuItemText = await phase.getText();

        // check phase name change
        expect(menuItemText).to.equal(name);

        // go to phase
        await phase.click();
        await client.pause(LOAD_PHASE_PAUSE);

        if (items) {
          await checkItemsAfterSync(client, items);
        }

        phaseIdx += 1;
      }
    }
  }

  // check Tools
  if (tools.length) {
    await openTools(client);
    await checkItemsAfterSync(client, tools);
  }
};

const hasSyncAdvancedScreenLayout = async (client) => {
  await expectElementToExist(client, `#${SYNC_ADVANCED_MAIN_ID}`);
};

const acceptSync = async (client) => {
  const acceptButton = await client.$(`#${SYNC_ACCEPT_BUTTON_ID}`);
  await acceptButton.click();
  await client.pause(SYNC_SPACE_PAUSE);
};

const cancelSync = async (client) => {
  const cancelButton = await client.$(`#${SYNC_CANCEL_BUTTON_ID}`);
  await cancelButton.click();
  await client.pause(LOAD_TAB_PAUSE);
};

describe('Sync a space', function () {
  this.timeout(DEFAULT_GLOBAL_TIMEOUT);
  let app;
  let globalUser;

  afterEach(function () {
    return closeApplication(app);
  });

  describe('with advanced mode disabled (default)', function () {
    beforeEach(
      mochaAsync(async () => {
        app = await createApplication();
        const { client } = app;
        globalUser = USER_GRAASP;
        await userSignIn(client, globalUser);
      })
    );

    spaces.forEach(
      ([
        {
          space: { id, name },
        },
        changes,
        spaceFilepath,
      ]) => {
        it(
          `Syncing from card open Visual Syncing Space Screen for "${name}"`,
          mochaAsync(async () => {
            const { client } = app;

            await loadSpaceById(client, spaceFilepath);

            const syncButton = await client.$(
              `#${buildSpaceCardId(id)} .${SPACE_SYNC_BUTTON_CLASS}`
            );
            await syncButton.click();
            await client.pause(SYNC_OPEN_SCREEN_PAUSE);

            await hasSyncVisualScreenLayout(client, changes);

            await acceptSync(client);

            await checkChangesInSpace(client, changes);
          })
        );
      }
    );

    it(
      'Syncing from toolbar open Visual Syncing Space Screen',
      mochaAsync(async () => {
        const { client } = app;

        const {
          space: { id },
        } = SPACE_WITH_MULTIPLE_CHANGES;
        const changes = SPACE_WITH_MULTIPLE_CHANGES_CHANGES;

        await loadSpaceById(client, SPACE_WITH_MULTIPLE_CHANGES_PATH, id);

        const syncButton = await client.$(`.${SPACE_SYNC_BUTTON_CLASS}`);
        await syncButton.click();
        await client.pause(SYNC_OPEN_SCREEN_PAUSE);

        await hasSyncVisualScreenLayout(client, changes);

        await acceptSync(client);

        await checkChangesInSpace(client, changes);
      })
    );

    it(
      'Cancel syncing keeps original space in Saved Spaces',
      mochaAsync(async () => {
        const { client } = app;
        const space = SPACE_WITH_MULTIPLE_CHANGES;
        const {
          space: { id },
        } = space;

        await loadSpaceById(client, SPACE_WITH_MULTIPLE_CHANGES_PATH, id);

        const syncButton = await client.$(`.${SPACE_SYNC_BUTTON_CLASS}`);
        await syncButton.click();
        await client.pause(SYNC_OPEN_SCREEN_PAUSE);

        // cancel sync
        const cancelButton = await client.$(`#${SYNC_CANCEL_BUTTON_ID}`);
        await cancelButton.click();
        await client.pause(LOAD_TAB_PAUSE);

        // space still has local content
        await hasSavedSpaceLayout(client, space, { user: globalUser });
      })
    );
  });

  describe('with advanced mode enabled (default)', function () {
    beforeEach(
      mochaAsync(async () => {
        app = await createApplication();
        const { client } = app;
        await userSignIn(client, USER_GRAASP);
        await menuGoToSettings(client);
        await toggleSyncAdvancedMode(client, true);
      })
    );

    it(
      'Syncing from card open Visual Syncing Space Screen',
      mochaAsync(async () => {
        const { client } = app;

        const {
          space: { id },
        } = SPACE_WITH_MULTIPLE_CHANGES;

        await loadSpaceById(client, SPACE_WITH_MULTIPLE_CHANGES_PATH);

        const syncButton = await client.$(
          `#${buildSpaceCardId(id)} .${SPACE_SYNC_BUTTON_CLASS}`
        );
        await syncButton.click();
        await client.pause(SYNC_OPEN_SCREEN_PAUSE);

        await hasSyncAdvancedScreenLayout(client);

        await acceptSync(client);

        await checkChangesInSpace(client, SPACE_WITH_MULTIPLE_CHANGES_CHANGES);
      })
    );

    it(
      'Syncing from toolbar open Visual Syncing Space Screen',
      mochaAsync(async () => {
        const { client } = app;

        const {
          space: { id },
        } = SPACE_WITH_MULTIPLE_CHANGES;
        const changes = SPACE_WITH_MULTIPLE_CHANGES_CHANGES;

        await loadSpaceById(client, SPACE_WITH_MULTIPLE_CHANGES_PATH, id);

        const syncButton = await client.$(`.${SPACE_SYNC_BUTTON_CLASS}`);
        await syncButton.click();
        await client.pause(SYNC_OPEN_SCREEN_PAUSE);

        await hasSyncAdvancedScreenLayout(client);

        await acceptSync(client);

        await checkChangesInSpace(client, changes);
      })
    );

    it(
      'Cancel syncing keeps original space in Saved Spaces',
      mochaAsync(async () => {
        const { client } = app;
        const space = SPACE_WITH_MULTIPLE_CHANGES;
        const {
          space: { id },
        } = space;

        await loadSpaceById(client, SPACE_WITH_MULTIPLE_CHANGES_PATH, id);

        const syncButton = await client.$(`.${SPACE_SYNC_BUTTON_CLASS}`);
        await syncButton.click();
        await client.pause(SYNC_OPEN_SCREEN_PAUSE);

        // cancel sync
        await cancelSync(client);

        // space still has local content
        await hasSavedSpaceLayout(client, space, { user: globalUser });
      })
    );
  });
});
