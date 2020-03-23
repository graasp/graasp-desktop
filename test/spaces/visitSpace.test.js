/* eslint-disable no-unused-expressions */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const { expect } = require('chai');
const { removeSpace, removeTags, mochaAsync } = require('../utils');
const { closeApplication, createApplication } = require('../application');
const { menuGoTo } = require('../menu.test');
const {
  SPACE_TOOLBAR_ID,
  PHASE_MENU_LIST_ID,
  VISIT_MAIN_ID,
  VISIT_MENU_ITEM_ID,
  SPACE_START_PREVIEW_BUTTON,
  SPACE_DESCRIPTION_ID,
  SPACE_SAVE_ICON_CLASS,
  SPACE_PREVIEW_ICON_CLASS,
  VISIT_INPUT_ID,
  VISIT_BUTTON_ID,
  PHASE_DESCRIPTION_ID,
  PHASE_MENU_ITEM,
  BANNER_WARNING_PREVIEW_ID,
  SPACE_EXPORT_BUTTON_CLASS,
  SPACE_CLEAR_BUTTON_CLASS,
  SPACE_DELETE_BUTTON_CLASS,
  SPACE_SYNC_BUTTON_CLASS,
  SPACE_CARD_ID_BUILDER,
  SPACE_DESCRIPTION_EXPAND_BUTTON_CLASS,
  SPACE_CARD_DESCRIPTION_ID_BUILDER,
} = require('../../src/config/selectors');
const { SPACE_ATOMIC_STRUCTURE } = require('../fixtures/spaces');
const {
  INPUT_TYPE_PAUSE,
  VISIT_SPACE_PAUSE,
  SAVE_SPACE_PAUSE,
  TOOLTIP_FADE_OUT_PAUSE,
} = require('../constants');

const PREVIEW = 'preview';
const SAVED = 'saved';

const visitSpaceById = async (client, id) => {
  await menuGoTo(client, VISIT_MENU_ITEM_ID, VISIT_MAIN_ID);

  // input space id
  await client.setValue(`#${VISIT_INPUT_ID}`, id);
  await client.pause(INPUT_TYPE_PAUSE);
  const value = await client.getValue(`#${VISIT_INPUT_ID}`);
  expect(value).to.equal(id);

  await client.click(`#${VISIT_BUTTON_ID}`);
  await client.pause(VISIT_SPACE_PAUSE);
};

const visitAndSaveSpaceById = async (client, id) => {
  await visitSpaceById(client, id);

  // save space
  await client.click(`.${SPACE_SAVE_ICON_CLASS}`);

  await client.pause(SAVE_SPACE_PAUSE);
  await client.pause(TOOLTIP_FADE_OUT_PAUSE);
};

// check home phase of given space when preview
const hasPreviewSpaceHomeLayout = async (
  client,
  { name: spaceName, description: spaceDescription }
) => {
  // space name
  const spaceToolbarSelector = `#${SPACE_TOOLBAR_ID}`;
  const toolbarText = await client.getText(spaceToolbarSelector);
  expect(toolbarText).to.include(spaceName);

  // space description
  if (spaceDescription && spaceDescription !== '') {
    const description = await client.getText(`#${SPACE_DESCRIPTION_ID}`);
    expect(removeSpace(description)).to.include(removeSpace(spaceDescription));
  }

  // space preview banner
  const previewBanner = await client.element(`#${BANNER_WARNING_PREVIEW_ID}`);
  expect(previewBanner.value).to.exist;

  // space preview button
  const previewButton = await client.getText(`#${SPACE_START_PREVIEW_BUTTON}`);
  expect(previewButton.toLowerCase()).to.equal('preview');

  // space save icon
  const saveIcon = await client.element(
    `${spaceToolbarSelector} .${SPACE_SAVE_ICON_CLASS}`
  );
  expect(saveIcon.value).to.exist;

  // space preview icon
  const previewIcon = await client.element(`.${SPACE_PREVIEW_ICON_CLASS}`);
  expect(previewIcon.value).to.exist;
};

// check home phase of given space when saved
const hasSavedSpaceHomeLayout = async (
  client,
  { name: spaceName, description: spaceDescription }
) => {
  // space name
  const spaceToolbarSelector = `#${SPACE_TOOLBAR_ID}`;
  const toolbarText = await client.getText(spaceToolbarSelector);
  expect(toolbarText).to.include(spaceName);

  // space save icon
  const exportIcon = await client.element(
    `${spaceToolbarSelector} .${SPACE_EXPORT_BUTTON_CLASS}`
  );
  expect(exportIcon.value).to.exist;

  // space preview icon
  const deleteIcon = await client.element(
    `${spaceToolbarSelector} .${SPACE_DELETE_BUTTON_CLASS}`
  );
  expect(deleteIcon.value).to.exist;

  // space preview icon
  const clearIcon = await client.element(
    `${spaceToolbarSelector} .${SPACE_CLEAR_BUTTON_CLASS}`
  );
  expect(clearIcon.value).to.exist;

  // space preview icon
  const syncIcon = await client.element(
    `${spaceToolbarSelector} .${SPACE_SYNC_BUTTON_CLASS}`
  );
  expect(syncIcon.value).to.exist;

  // space description
  if (spaceDescription && spaceDescription !== '') {
    const description = await client.getText(`#${SPACE_DESCRIPTION_ID}`);
    expect(removeSpace(description)).to.include(removeSpace(spaceDescription));
  }

  // space start button
  const previewButton = await client.getText(`#${SPACE_START_PREVIEW_BUTTON}`);
  expect(previewButton.toLowerCase()).to.equal('start');
};

// check layout of a given phase
// @TODO check user input - have access to iframe
const hasPhaseLayout = async (client, { description, items }, mode) => {
  // space description if not empty
  // get innerHTML to retrieve html tags as well
  // remove space to handle trimmed spaces
  if (description && description !== '') {
    const descriptionHtml = await client.getHTML(`#${PHASE_DESCRIPTION_ID}`);
    expect(removeSpace(removeTags(descriptionHtml))).to.include(
      removeSpace(removeTags(description))
    );
  }

  // eslint-disable-block no-await-in-loop
  for (const { id, content, mimeType, category, url, asset } of items) {
    const itemSelector = `[data-id="${id}"]`;

    // check item exists
    const element = await client.element(itemSelector);
    expect(element.value).to.exist;

    // @TODO use constants for category types
    // to reuse constants, use es6 for tests
    switch (category) {
      case 'Resource': {
        if (mimeType === 'text/html') {
          const text = await client.getHTML(itemSelector);
          // remove space and tags since they are trimmed
          expect(removeSpace(removeTags(text))).to.include(
            removeSpace(removeTags(content))
          );
        }
        break;
      }
      case 'Application': {
        switch (mode) {
          case PREVIEW: {
            const iframe = await client.getHTML(`${itemSelector} iframe`);
            expect(iframe).to.include(url);
            break;
          }
          case SAVED: {
            const iframe = await client.getHTML(`${itemSelector} iframe`);
            expect(iframe).to.include(asset);
            break;
          }
          default:
            console.log(`mode: ${mode} is not handled`);
            break;
        }
        break;
      }
      default: {
        expect(false).to.equal(true);
      }
    }
  }
};

// check phases layout
const checkPhasesLayout = async (client, phases, mode) => {
  // check each phase layout
  const liTextArray = await client.getText(`#${PHASE_MENU_LIST_ID} li`);
  liTextArray.shift();
  // remove first element since it is the home (already checked
  // and is not part of the phases' description)
  for (const [idx, text] of liTextArray.entries()) {
    // phase name
    expect(text).to.equal(phases[idx].name);

    const liSelector = `#${PHASE_MENU_LIST_ID} li#${PHASE_MENU_ITEM}-${idx}`;

    // go to phase
    await client.click(liSelector);
    await client.pause(2000);

    // check phase content
    await hasPhaseLayout(client, phases[idx], mode);
  }
};

// check space layout when saved
const hasSavedSpaceLayout = async (client, { phases, description, name }) => {
  await hasSavedSpaceHomeLayout(client, { description, name });
  await checkPhasesLayout(client, phases, SAVED);
};

// check space layout when preview
const hasPreviewSpaceLayout = async (client, { phases, description, name }) => {
  await hasPreviewSpaceHomeLayout(client, { description, name });
  await checkPhasesLayout(client, phases, PREVIEW);
};

// check a space card layout
const checkSpaceCardLayout = async (
  client,
  { id, name: spaceName, description: spaceDescription }
) => {
  const spaceSelector = `#${SPACE_CARD_ID_BUILDER(id)}`;
  const spaceCard = await client.element(spaceSelector);
  expect(spaceCard.value).to.exist;

  // space name
  const name = await client.getText(`${spaceSelector} h2`);
  expect(name).to.include(spaceName);

  // space description
  if (spaceDescription && spaceDescription !== '') {
    const expandIconSelector = `.${SPACE_DESCRIPTION_EXPAND_BUTTON_CLASS}`;
    const expandIcon = await client.getText(expandIconSelector);
    expect(expandIcon.value).to.exist;

    const descriptionHtml = await client.getHTML(
      `#${SPACE_CARD_DESCRIPTION_ID_BUILDER(id)}`
    );
    expect(removeSpace(descriptionHtml)).to.include(
      removeSpace(spaceDescription)
    );
  }

  // space save icon
  const exportIcon = await client.element(
    `${spaceSelector} .${SPACE_EXPORT_BUTTON_CLASS}`
  );
  expect(exportIcon.value).to.exist;

  // space preview icon
  const deleteIcon = await client.element(
    `${spaceSelector} .${SPACE_DELETE_BUTTON_CLASS}`
  );
  expect(deleteIcon.value).to.exist;

  // space preview icon
  const syncIcon = await client.element(
    `${spaceSelector} .${SPACE_SYNC_BUTTON_CLASS}`
  );
  expect(syncIcon.value).to.exist;
};

describe('Visit Space Scenarios', function() {
  this.timeout(270000);
  let app;

  afterEach(function() {
    return closeApplication(app);
  });

  beforeEach(
    mochaAsync(async () => {
      app = await createApplication();
    })
  );

  it(
    `Visit space ${SPACE_ATOMIC_STRUCTURE.name} (${SPACE_ATOMIC_STRUCTURE.id})`,
    mochaAsync(async () => {
      const { client } = app;

      await visitSpaceById(client, SPACE_ATOMIC_STRUCTURE.id);

      await hasPreviewSpaceLayout(client, SPACE_ATOMIC_STRUCTURE);
    })
  );
});

module.exports = {
  hasPreviewSpaceHomeLayout,
  checkSpaceCardLayout,
  hasPreviewSpaceLayout,
  hasSavedSpaceLayout,
  hasSavedSpaceHomeLayout,
  visitSpaceById,
  visitAndSaveSpaceById,
};
