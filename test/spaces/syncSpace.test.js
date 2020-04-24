/* eslint-disable no-unused-expressions */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { expect } from 'chai';
import { mochaAsync } from '../utils';
import { createApplication, closeApplication } from '../application';
import {
  buildSpaceCardId,
  SPACE_SYNC_BUTTON_CLASS,
  PHASE_MENU_ITEM_HOME_ID,
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
import { userSignIn } from '../userSignIn.test';
import { USER_GRAASP } from '../fixtures/users';
import { loadSpaceById } from './loadSpace.test';
import { openTools, hasSavedSpaceLayout } from './visitSpace.test';
import {
  SYNC_ADDED,
  SYNC_REMOVED,
  SYNC_MOVED,
  SYNC_UPDATED,
} from '../../src/config/constants';
import { toggleSyncAdvancedMode } from '../settings.test';
import { menuGoToSettings } from '../menu.test';

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

const constructToolsPhase = items => ({
  name: 'Tools',
  items,
  change: items.length ? SYNC_UPDATED : null,
});

const checkItemHasChange = async (client, selector, change) => {
  const itemHtml = await client.getHTML(selector);
  switch (change) {
    case SYNC_UPDATED:
      // there exist 2 elements with the same data-id on update
      // only one has the highlight class
      expect(itemHtml[1]).to.include(change);
      break;
    case SYNC_MOVED:
      // there exist 2 elements with the same data-id on move
      // both have the highlight class
      expect(itemHtml[0]).to.include(change);
      expect(itemHtml[1]).to.include(change);
      break;
    // on added and removed, there is only one element
    case SYNC_ADDED:
    case SYNC_REMOVED:
      expect(itemHtml).to.include(change);
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
  const homeMenuItem = await client.element(`#${PHASE_MENU_ITEM_HOME_ID}`);
  expect(homeMenuItem.value).to.exist;

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
    const phaseSelector = `#${buildPhaseMenuItemId(i)}`;

    // check phase name change
    const menuItemText = await client.getText(phaseSelector);
    expect(menuItemText).to.include(name);
    expect(menuItemText).to.include(previousName);

    // check phase contains class of corresponding change
    if (phaseChange) {
      const menuItemHtml = await client.getHTML(phaseSelector);
      expect(menuItemHtml).to.include(phaseChange);
    }

    // go to phase
    await client.click(phaseSelector);
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
    const item = await client.element(`[data-id='${id}']`);
    switch (itemChange) {
      case SYNC_ADDED:
      case SYNC_UPDATED:
      case SYNC_MOVED:
        expect(item.value).to.exist;
        break;
      case SYNC_REMOVED:
        expect(item.value).to.not.exist;
        break;
      default:
        console.log(`change "${itemChange}" not recognized`);
    }
  }
};

const checkChangesInSpace = async (client, { phases, items: tools = [] }) => {
  let phaseIdx = 0;
  for (const { name, items, change: phaseChange } of phases) {
    const phaseSelector = `#${buildPhaseMenuItemId(phaseIdx)}`;

    switch (phaseChange) {
      case SYNC_REMOVED:
        expect(await client.element(phaseSelector).value).to.not.exist;
        break;
      case SYNC_ADDED:
      case SYNC_UPDATED:
      case SYNC_MOVED:
      default: {
        // check phase name change
        const menuItemText = await client.getText(phaseSelector);
        expect(menuItemText).to.equal(name);

        // go to phase
        await client.click(phaseSelector);
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

const hasSyncAdvancedScreenLayout = async client => {
  const mainAdvancedContent = await client.element(`#${SYNC_ADVANCED_MAIN_ID}`);
  expect(mainAdvancedContent.value).to.exist;
};

const acceptSync = async client => {
  await client.click(`#${SYNC_ACCEPT_BUTTON_ID}`);
  await client.pause(SYNC_SPACE_PAUSE);
};

describe.only('Sync a space', function() {
  this.timeout(DEFAULT_GLOBAL_TIMEOUT);
  let app;

  afterEach(function() {
    return closeApplication(app);
  });

  describe('with advanced mode disabled (default)', function() {
    beforeEach(
      mochaAsync(async () => {
        app = await createApplication();
        const { client } = app;
        await userSignIn(client, USER_GRAASP);
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

            await client.click(
              `#${buildSpaceCardId(id)} .${SPACE_SYNC_BUTTON_CLASS}`
            );
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

        await client.click(`.${SPACE_SYNC_BUTTON_CLASS}`);
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

        await client.click(`.${SPACE_SYNC_BUTTON_CLASS}`);
        await client.pause(SYNC_OPEN_SCREEN_PAUSE);

        // cancel sync
        await client.click(`#${SYNC_CANCEL_BUTTON_ID}`);
        await client.pause(LOAD_TAB_PAUSE);

        // space still has local content
        await hasSavedSpaceLayout(client, space);
      })
    );
  });

  describe('with advanced mode enabled (default)', function() {
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

        await client.click(
          `#${buildSpaceCardId(id)} .${SPACE_SYNC_BUTTON_CLASS}`
        );
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

        await client.click(`.${SPACE_SYNC_BUTTON_CLASS}`);
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

        await client.click(`.${SPACE_SYNC_BUTTON_CLASS}`);
        await client.pause(SYNC_OPEN_SCREEN_PAUSE);

        // cancel sync
        await client.click(`#${SYNC_CANCEL_BUTTON_ID}`);
        await client.pause(LOAD_TAB_PAUSE);

        // space still has local content
        await hasSavedSpaceLayout(client, space);
      })
    );
  });
});
