/* eslint-disable no-unused-expressions */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable func-names */
import { expect } from 'chai';
import {
  removeSpace,
  removeTags,
  mochaAsync,
  userSignIn,
  menuGoToVisitSpace,
  expectElementToExist,
} from '../utils';
import { closeApplication, createApplication } from '../application';
import {
  SPACE_TOOLBAR_ID,
  PHASE_MENU_LIST_ID,
  SPACE_START_PREVIEW_BUTTON,
  SPACE_DESCRIPTION_ID,
  SPACE_SAVE_ICON_CLASS,
  SPACE_PREVIEW_ICON_CLASS,
  VISIT_INPUT_ID,
  VISIT_BUTTON_ID,
  PHASE_DESCRIPTION_ID,
  buildPhaseMenuItemId,
  BANNER_WARNING_PREVIEW_ID,
  SPACE_EXPORT_BUTTON_CLASS,
  SPACE_CLEAR_BUTTON_CLASS,
  SPACE_DELETE_BUTTON_CLASS,
  SPACE_SYNC_BUTTON_CLASS,
  buildSpaceCardId,
  SPACE_DESCRIPTION_EXPAND_BUTTON_CLASS,
  buildSpaceCardDescriptionId,
  TOOLS_BUTTON_CLASS,
  TOOLS_CONTENT_PANE_ID,
} from '../../src/config/selectors';
import { hasMath } from '../../src/utils/math';
import { SPACE_ATOMIC_STRUCTURE, SPACE_APOLLO_11 } from '../fixtures/spaces';
import {
  INPUT_TYPE_PAUSE,
  VISIT_SPACE_PAUSE,
  SAVE_SPACE_PAUSE,
  TOOLTIP_FADE_OUT_PAUSE,
  DEFAULT_GLOBAL_TIMEOUT,
  LOAD_PHASE_PAUSE,
  OPEN_TOOLS_PAUSE,
} from '../constants';
import { USER_GRAASP } from '../fixtures/users';
import { USER_MODES, DEFAULT_USER_MODE } from '../../src/config/constants';
import { checkTextInputAppContainsText } from '../apps/textInputApp';

const PREVIEW = 'preview';
const SAVED = 'saved';

export const openTools = async (client) => {
  const isToolsContentVisible = await (
    await client.$(`#${TOOLS_CONTENT_PANE_ID}`)
  ).isDisplayed();
  if (!isToolsContentVisible) {
    await (await client.$(`.${TOOLS_BUTTON_CLASS}`)).click();
    await client.pause(OPEN_TOOLS_PAUSE);
  }
};

const testTextOfElement = async (client, selector, text) => {
  const el = await client.$(selector);
  const html = await el.getHTML();
  if (hasMath(text)) {
    expect(html).to.include('<span class="katex">');
  } else {
    expect(removeSpace(removeTags(html))).to.include(
      removeSpace(removeTags(text))
    );
  }
};

export const visitSpaceById = async (client, id) => {
  await menuGoToVisitSpace(client);

  // input space id
  const visitInput = await client.$(`#${VISIT_INPUT_ID}`);
  await visitInput.setValue(id);
  await client.pause(INPUT_TYPE_PAUSE);
  const value = await visitInput.getValue();
  expect(value).to.equal(id);

  await (await client.$(`#${VISIT_BUTTON_ID}`)).click();
  await client.pause(VISIT_SPACE_PAUSE);
};

export const visitAndSaveSpaceById = async (client, id) => {
  await visitSpaceById(client, id);

  // save space
  const saveIcon = await client.$(`.${SPACE_SAVE_ICON_CLASS}`);
  await saveIcon.click();

  await client.pause(SAVE_SPACE_PAUSE);
  await client.pause(TOOLTIP_FADE_OUT_PAUSE);
};

// check home phase of given space when preview
export const hasPreviewSpaceHomeLayout = async (
  client,
  { name: spaceName, description: spaceDescription },
  mode = DEFAULT_USER_MODE
) => {
  // space name
  const spaceToolbarSelector = `#${SPACE_TOOLBAR_ID}`;
  const spaceToolbar = await client.$(spaceToolbarSelector);
  const toolbarText = await spaceToolbar.getText();
  expect(toolbarText).to.include(spaceName);

  // space description
  if (spaceDescription && spaceDescription !== '') {
    await testTextOfElement(
      client,
      `#${SPACE_DESCRIPTION_ID}`,
      spaceDescription
    );
  }

  // space preview banner
  await expectElementToExist(client, `#${BANNER_WARNING_PREVIEW_ID}`);

  // space preview button
  const previewButton = await (
    await client.$(`#${SPACE_START_PREVIEW_BUTTON}`)
  ).getText();
  expect(previewButton.toLowerCase()).to.equal('preview');

  // space save icon if teacher
  if (mode === USER_MODES.TEACHER) {
    await expectElementToExist(
      client,
      `${spaceToolbarSelector} .${SPACE_SAVE_ICON_CLASS}`
    );
  }

  // space preview icon
  await expectElementToExist(client, `.${SPACE_PREVIEW_ICON_CLASS}`);
};

// check home phase of given space when saved
export const hasSavedSpaceHomeLayout = async (
  client,
  { name: spaceName, description: spaceDescription },
  userMode
) => {
  // space name
  const spaceToolbarSelector = `#${SPACE_TOOLBAR_ID}`;
  const spaceToolbar = await client.$(spaceToolbarSelector);
  const toolbarText = await spaceToolbar.getText();
  expect(toolbarText).to.include(spaceName);

  // space export icon
  await expectElementToExist(
    client,
    `${spaceToolbarSelector} .${SPACE_EXPORT_BUTTON_CLASS}`
  );

  // space clear icon
  await expectElementToExist(
    client,
    `${spaceToolbarSelector} .${SPACE_CLEAR_BUTTON_CLASS}`
  );

  if (userMode !== USER_MODES.STUDENT) {
    // space delete icon
    await expectElementToExist(
      client,
      `${spaceToolbarSelector} .${SPACE_DELETE_BUTTON_CLASS}`
    );

    // space sync icon
    await expectElementToExist(
      client,
      `${spaceToolbarSelector} .${SPACE_SYNC_BUTTON_CLASS}`
    );
  }

  // space description
  if (spaceDescription && spaceDescription !== '') {
    await testTextOfElement(
      client,
      `#${SPACE_DESCRIPTION_ID}`,
      spaceDescription
    );
  }

  // space start button
  const previewButton = await client.$(`#${SPACE_START_PREVIEW_BUTTON}`);
  const text = await previewButton.getText();
  expect(text.toLowerCase()).to.equal('start');
};

const checkUserInputInApp = async (client, { id, url }, resources = []) => {
  // @TODO differentiate apps with an appId
  let data = '';
  if (resources.length) {
    /* eslint-disable-next-line prefer-destructuring */
    ({ data } = resources[0]);
  }

  switch (url) {
    // text input app
    case 'https://apps.graasp.eu/5acb589d0d5d9464081c2d46/5cde9891226a7d20a8a16697/latest/index.html': {
      await checkTextInputAppContainsText(client, id, data);

      break;
    }
    default: {
      console.log(`app with url : ${url} is not handled`);
    }
  }

  // reset client on parent frame
  await client.switchToFrame(null);
};

// check layout of a given phase
// @TODO check user input - have access to iframe
const hasPhaseLayout = async (
  client,
  { description, items },
  mode,
  resources = []
) => {
  // space description if not empty
  // get innerHTML to retrieve html tags as well
  // remove space to handle trimmed spaces
  if (description && description !== '') {
    await testTextOfElement(client, `#${PHASE_DESCRIPTION_ID}`, description);
  }

  // eslint-disable-block no-await-in-loop
  for (const {
    id,
    content,
    mimeType,
    category,
    url,
    asset,
    appInstance,
  } of items) {
    const itemSelector = `[data-id="${id}"]`;

    // check item exists
    await expectElementToExist(client, itemSelector);

    const urlForMode = mode === PREVIEW ? url : asset;

    // @TODO use constants for category types
    // to reuse constants, use es6 for tests
    switch (category) {
      case 'Resource': {
        switch (mimeType) {
          case 'text/html': {
            await testTextOfElement(client, itemSelector, content);
            break;
          }
          case 'video/quicktime': {
            const videoSource = await client.$(`${itemSelector} video source`);
            const src = await videoSource.getAttribute('src');
            expect(src).to.include(urlForMode);
            break;
          }
          case 'image/png':
          case 'image/jpeg': {
            const img = await client.$(`${itemSelector} img`);
            const src = await img.getAttribute('src');
            expect(src).to.include(urlForMode);
            break;
          }
          default: {
            console.log('Unhandled mimeType: ', mimeType);
          }
        }
        break;
      }
      case 'Application': {
        switch (mode) {
          case PREVIEW: {
            const iframe = await client.$(`${itemSelector} iframe`);
            const src = await iframe.getAttribute('src');
            expect(src).to.include(url);
            await checkUserInputInApp(client, { id, url });
            break;
          }
          case SAVED: {
            const iframe = await client.$(`${itemSelector} iframe`);
            const src = await iframe.getAttribute('src');
            expect(src).to.include(asset);
            if (appInstance) {
              const { id: appInstanceId } = appInstance;
              const filteredResources = resources.filter(
                ({ appInstance: resourcesAppInstanceId }) =>
                  resourcesAppInstanceId === appInstanceId
              );
              await checkUserInputInApp(client, { id, url }, filteredResources);
            }
            break;
          }
          default:
            console.log(`mode: ${mode} is not handled`);
            break;
        }
        break;
      }
      default: {
        console.log(`category: ${category} is not handled`);
        expect(false).to.equal(true);
      }
    }
  }
};

// check phases layout
const checkPhasesLayout = async (client, phases, mode, resources = []) => {
  // check each phase layout
  const lis = await client.$$(`#${PHASE_MENU_LIST_ID} li`);
  lis.shift();
  // remove first element since it is the home (already checked
  // and is not part of the phases' description)
  for (const [idx, li] of lis.entries()) {
    // phase name
    const text = await li.getText();
    expect(text).to.equal(phases[idx].name);

    const liSelector = await client.$(
      `#${PHASE_MENU_LIST_ID} li#${buildPhaseMenuItemId(idx)}`
    );

    // go to phase
    await liSelector.click();
    await client.pause(LOAD_PHASE_PAUSE);

    // check phase content
    await hasPhaseLayout(client, phases[idx], mode, resources);
  }
};

// check space layout when saved
export const hasSavedSpaceLayout = async (
  client,
  { space: { phases, description, name } },
  { resources = [], user = {} } = {}
) => {
  const { mode = DEFAULT_USER_MODE } = user;
  await hasSavedSpaceHomeLayout(client, { description, name }, mode);
  await checkPhasesLayout(client, phases, SAVED, resources);
};

// check space layout when preview
export const hasPreviewSpaceLayout = async (
  client,
  { space: { phases, description, name }, resources = [] },
  { mode }
) => {
  await hasPreviewSpaceHomeLayout(client, { description, name }, mode);
  await checkPhasesLayout(client, phases, PREVIEW, resources);
};

// check a space card layout
export const checkSpaceCardLayout = async (
  client,
  { space: { id, name: spaceName, description: spaceDescription } }
) => {
  const spaceSelector = `#${buildSpaceCardId(id)}`;
  await expectElementToExist(client, spaceSelector);

  // space name
  const name = await client.$(`${spaceSelector} h2`);
  const text = await name.getText();
  expect(text).to.include(spaceName);

  // space description
  if (spaceDescription && spaceDescription !== '') {
    const expandIcon = await client.$(
      `.${SPACE_DESCRIPTION_EXPAND_BUTTON_CLASS}`
    );
    const expandIconText = await expandIcon.getText();
    expect(expandIconText.value).to.exist;

    const cardDesc = await client.$(`#${buildSpaceCardDescriptionId(id)}`);
    const descriptionHtml = await cardDesc.getHTML();
    expect(removeSpace(descriptionHtml)).to.include(
      removeSpace(spaceDescription)
    );
  }

  // space save icon
  await expectElementToExist(
    client,
    `${spaceSelector} .${SPACE_EXPORT_BUTTON_CLASS}`
  );

  // space preview icon
  await expectElementToExist(
    client,
    `${spaceSelector} .${SPACE_DELETE_BUTTON_CLASS}`
  );

  // space preview icon
  await expectElementToExist(
    client,
    `${spaceSelector} .${SPACE_SYNC_BUTTON_CLASS}`
  );
};

describe('Visit Space Scenarios', function () {
  this.timeout(DEFAULT_GLOBAL_TIMEOUT);
  let app;
  let globalUser;

  afterEach(function () {
    return closeApplication(app);
  });

  beforeEach(
    mochaAsync(async () => {
      app = await createApplication();
      globalUser = USER_GRAASP;
      await userSignIn(app.client, globalUser);
    })
  );

  const spaces = [SPACE_APOLLO_11, SPACE_ATOMIC_STRUCTURE];

  spaces.forEach(function (space) {
    const {
      space: { id, name },
    } = space;
    it(
      `Visit space ${name} (${id})`,
      mochaAsync(async () => {
        const { client } = app;

        await visitSpaceById(client, id);

        await hasPreviewSpaceLayout(client, space, globalUser);
      })
    );
  });
});
