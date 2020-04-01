import { expect } from 'chai';
import { buildPhaseAppName } from '../../src/config/selectors';
import { INPUT_TYPE_PAUSE, SAVE_USER_INPUT_PAUSE } from '../constants';

const INPUT_TEXT_FIELD_SELECTOR = '#inputTextField';
const SAVE_BUTTON_SELECTOR = 'button';

export const typeInTextInputApp = async (client, id, text) => {
  await client.frame(buildPhaseAppName(id));
  await client.setValue(INPUT_TEXT_FIELD_SELECTOR, text);
  await client.pause(INPUT_TYPE_PAUSE);

  // click on save button
  await client.click(SAVE_BUTTON_SELECTOR);
  await client.pause(SAVE_USER_INPUT_PAUSE);

  // reset client on parent frame
  await client.frame(null);
};

export const checkUserInputInTextInputApp = async (client, id, text) => {
  await client.frame(buildPhaseAppName(id));
  const inputText = await client.getText(INPUT_TEXT_FIELD_SELECTOR);

  expect(inputText).to.equal(text);
  // reset client on parent frame
  await client.frame(null);
};
