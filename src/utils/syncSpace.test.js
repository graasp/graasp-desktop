import {
  filterSpace,
  isSpaceUpToDate,
  diffString,
  countConditions,
  getRelativeIdx,
  createDiffElements,
  findDiffInElementArray,
} from './syncSpace';
import * as FIXTURES from '../test/fixtures/syncSpace';
import {
  SYNC_PHASE_PROPERTIES,
  SYNC_ITEM_PROPERTIES,
  SYNC_CHANGES,
} from '../config/constants';

describe('syncSpace', () => {
  describe('filterSpace', () => {
    it.each(FIXTURES.filterSpace)(
      `returns correct filtered space`,
      (space, filteredSpace) => {
        const rvalue = filterSpace(space);
        expect(rvalue).toEqual(filteredSpace);
      }
    );
  });
  describe('isSpaceUpToDate', () => {
    it.each(FIXTURES.isSpaceUpToDate)(
      `returns whether space is up to date`,
      (localSpace, remoteSpace, isUpToDate) => {
        const rvalue = isSpaceUpToDate(localSpace, remoteSpace);
        expect(rvalue).toEqual(isUpToDate);
      }
    );
  });
  describe('diffString', () => {
    it.each(FIXTURES.diffString)(
      `returns diff object of '%s' and '%s'`,
      (a, b, diff) => {
        const rvalue = diffString(a, b);
        expect(rvalue).toEqual(diff);
      }
    );
  });
  describe('countConditions', () => {
    it.each(FIXTURES.countConditions)(
      `returns whether object is ignored`,
      (changes, id, keepElement) => {
        const rvalue = countConditions(changes, { id });
        expect(rvalue).toEqual(keepElement);
      }
    );
  });
  describe('getRelativeIdx', () => {
    it.each(FIXTURES.getRelativeIdx)(
      `returns relative idx depending on changes`,
      (arr, originalIdx, changes, resultIdx) => {
        const rvalue = getRelativeIdx(arr, originalIdx, changes);
        expect(rvalue).toEqual(resultIdx);
      }
    );
  });
  describe('findDiffInElementArray', () => {
    it.each(FIXTURES.findDiffInElementArrayPhases)(
      `returns diff changes between two phase arrays`,
      (a, b, changes) => {
        const rvalue = findDiffInElementArray(a, b, SYNC_PHASE_PROPERTIES);
        expect(rvalue).toEqual(changes);
      }
    );
    it.each(FIXTURES.findDiffInElementArrayItems)(
      `returns diff changes between two item arrays`,
      (a, b, changes) => {
        const rvalue = findDiffInElementArray(a, b, SYNC_ITEM_PROPERTIES);
        expect(rvalue).toEqual(changes);
      }
    );
  });
  describe('createDiffElements', () => {
    // build classes from existing changes
    const classes = {};
    Object.values(SYNC_CHANGES).forEach((change) => {
      classes[change] = change;
    });

    it.each(FIXTURES.createDiffElementsPhases)(
      `returns diff phases to display`,
      (a, b, result) => {
        const rvalue = createDiffElements(a, b, classes, SYNC_PHASE_PROPERTIES);
        expect(rvalue).toEqual(result);
      }
    );

    it.each(FIXTURES.createDiffElementsItems)(
      `returns diff items to display`,
      (a, b, result) => {
        const rvalue = createDiffElements(a, b, classes, SYNC_ITEM_PROPERTIES);
        expect(rvalue).toEqual(result);
      }
    );
  });
});
