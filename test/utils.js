/* eslint-disable no-unused-expressions */
import { expect } from 'chai';

export const mochaAsync = fn => {
  return done => {
    fn.call().then(done, err => {
      done(err);
    });
  };
};

export const removeSpace = text => {
  return text.replace(/\s/g, '');
};

export const removeTags = html => {
  return html.replace(/<\/?[^>]+(>|$)/g, '');
};

export const createRandomString = () => {
  return Math.random()
    .toString(36)
    .substring(7);
};

export const expectElementToNotExist = async (client, elementSelector) => {
  const found = await client.isExisting(elementSelector);
  expect(found).to.be.false;
};

export const expectAnyElementToExist = async (client, elementSelectors) => {
  const foundElements = [];
  /* eslint-disable-next-line no-restricted-syntax */
  for (const selector of elementSelectors) {
    /* eslint-disable-next-line no-await-in-loop */
    const found = await client.isExisting(selector);
    foundElements.push(found);
  }
  expect(foundElements).to.include(true);
};

export const expectElementToExist = async (client, elementSelector) => {
  const found = await client.isExisting(elementSelector);
  expect(found).to.be.true;
};
