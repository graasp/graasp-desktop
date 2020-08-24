import _ from 'lodash';
import {
  SYNC_CHANGES,
  SYNC_SPACE_PROPERTIES,
  SYNC_ITEM_PROPERTIES,
  SECURITY_LOOP_THRESHOLD,
} from '../config/constants';

const { ADDED, REMOVED, UPDATED, MOVED } = SYNC_CHANGES;

export const filterSpace = space => {
  const filteredSpace = _.pick(_.cloneDeep(space), SYNC_SPACE_PROPERTIES);

  // remove local space specific keys
  if (filteredSpace.image) {
    delete filteredSpace.image.thumbnailAsset;
  }
  // remove properties in items
  // eslint-disable-next-line no-restricted-syntax
  for (const phase of filteredSpace.phases) {
    if (!_.isEmpty(phase.items)) {
      phase.items = phase.items.map(item => _.pick(item, SYNC_ITEM_PROPERTIES));
    }
  }

  return filteredSpace;
};

// return whether a change exist in the space
// we want to detect changes only in some properties
export const isSpaceUpToDate = (localSpace, remoteSpace) => {
  const filteredLocalSpace = filterSpace(localSpace);
  const filteredRemoteSpace = filterSpace(remoteSpace);

  return _.isEqual(filteredLocalSpace, filteredRemoteSpace);
};

/** return whether the localSpace is different from the remoteSpace
 * handle immutable spaces
 * @param {immutable Map} localSpace : saved space in local database,
 * @param {immutable Map} remoteSpace: space to load
 */
export const isSpaceDifferent = (localSpace, remoteSpace) => {
  // space is different if remoteSpace is not empty and the localSpace does not exist locally or
  // there is a difference between localSpace and remoteSpace
  return (
    !remoteSpace.isEmpty() &&
    (localSpace.isEmpty() ||
      !isSpaceUpToDate(localSpace.toJS(), remoteSpace.toJS()))
  );
};

/** change object creator
 * @param {String} status : type of change
 * @param {Number} localIdx: index position in the local space, interesting for move change
 * @param {Number} remoteIdx: index position in the remote space, interesting for move change
 */

export const createChangeObj = (
  id,
  status,
  localIdx = null,
  remoteIdx = null
) => ({
  id,
  status,
  localIdx,
  remoteIdx,
});

export const createDiffObject = (added, removed, updated) => ({
  [ADDED]: added,
  [REMOVED]: removed,
  [UPDATED]: updated,
});

// compute diff for strings
// return map where keys are the change status with boolean values
// empty string to non-empty string is an added change
// non-empty string to empty string is a removed change
export const diffString = (localStr, remoteStr) => {
  // undefined and null values are changed to empty string
  let a = localStr;
  if (!a) {
    a = '';
  }
  let b = remoteStr;
  if (!b) {
    b = '';
  }

  const isLocalStringNotEmpty = a.length > 0;
  const isRemoteStringNotEmpty = b.length > 0;

  return createDiffObject(
    !isLocalStringNotEmpty && isRemoteStringNotEmpty,
    isLocalStringNotEmpty && !isRemoteStringNotEmpty,
    isLocalStringNotEmpty && isRemoteStringNotEmpty && localStr !== remoteStr
  );
};

// create a phase using tools
// utility to process tools as a phase
export const createToolsPhase = tools => {
  return {
    id: 'tools-id',
    name: 'Tools',
    items: tools,
  };
};

// return whether the element should be ignored
export const countConditions = (changes, { id }) => {
  const correspondingChanges = changes.filter(
    ({ id: itemId }) => itemId === id
  );
  return (
    // keep element if it has no change
    correspondingChanges.length === 0 ||
    // keep if it is not removed, added or moved
    correspondingChanges.filter(
      ({ status }) => [ADDED, REMOVED, MOVED].includes(status) // <- depend on the added order
    ).length === 0
  );
};

// add diff information in corresponding objects
// compute corresponding classes from changes status
const applyDiffToObject = (obj, diff, classes) => {
  const objDiff = diff.filter(({ id }) => id === obj.id);
  return {
    ...obj,
    changes: objDiff,
    className: objDiff.map(({ status }) => classes[status]).join(' '),
  };
};

// get relative index in object array
// utility to detect moved changes and report it on further changes
// ex: an added element does not move next elements
export const getRelativeIdx = (arr, originalIdx, changes) => {
  return arr.slice(0, originalIdx).filter(el => countConditions(changes, el))
    .length;
};

// return array of differences between given objects for given properties
export const findDiffInElementArray = (localObj, remoteObj, properties) => {
  const uniqueItemIds = _.union(
    localObj.map(({ id }) => id),
    remoteObj.map(({ id }) => id)
  );

  const movedEls = [];
  const changes = [];

  uniqueItemIds.forEach(id => {
    // compare same id elements
    const localEl = localObj.find(({ id: objectId }) => id === objectId);
    const remoteEl = remoteObj.find(({ id: objectId }) => id === objectId);
    const localOriginalIdx = localObj.indexOf(localEl);
    const remoteOriginalIdx = remoteObj.indexOf(remoteEl);

    // the element was added
    if (_.isEmpty(localEl)) {
      changes.push(createChangeObj(id, ADDED, null, remoteOriginalIdx));
    }
    // the element was removed
    else if (_.isEmpty(remoteEl)) {
      changes.push(createChangeObj(id, REMOVED, localOriginalIdx, null));
    }
    // exist in both obj
    else if (localEl && remoteEl) {
      // check changes
      // changes are only checked on a subset of properties (some properties only exist in local spaces)
      const filteredlocalEl = _.pick(localEl, properties);
      const filteredremoteEl = _.pick(remoteEl, properties);

      if (!_.isEqual(filteredlocalEl, filteredremoteEl)) {
        changes.push(
          createChangeObj(id, UPDATED, localOriginalIdx, remoteOriginalIdx)
        );
      }

      // check moved
      if (localOriginalIdx !== remoteOriginalIdx) {
        movedEls.push({ id, localOriginalIdx, remoteOriginalIdx });
      }
    }
  });

  // begin from end of local list to compare in order
  movedEls
    .sort(({ localOriginalIdx: a }, { localOriginalIdx: b }) => b - a)
    // item is moved if index is different independently of added / removed elements
    .forEach(({ id, localOriginalIdx, remoteOriginalIdx }) => {
      const localIdx = getRelativeIdx(localObj, localOriginalIdx, changes);
      const remoteIdx = getRelativeIdx(remoteObj, remoteOriginalIdx, changes);
      if (localIdx !== remoteIdx) {
        changes.push(
          createChangeObj(id, MOVED, localOriginalIdx, remoteOriginalIdx)
        );
      }
    });

  return changes;
};

// find diff between local and remote elements
// return a zipped array with [localElement, remoteElement]
// where we append blank elements
export const createDiffElements = (
  lElements,
  rElements,
  classes,
  properties
) => {
  // get diff array of both elements
  const diff = findDiffInElementArray(lElements, rElements, properties);

  // append changes in elements
  // some statuses are only present in local or remote elements
  const localDiff = diff.filter(({ status }) =>
    [REMOVED, MOVED].includes(status)
  );
  const remoteDiff = diff.filter(({ status }) =>
    [UPDATED, MOVED, ADDED].includes(status)
  );
  const localObjects = lElements.map(obj =>
    applyDiffToObject(obj, localDiff, classes)
  );
  const remoteObjects = rElements.map(obj =>
    applyDiffToObject(obj, remoteDiff, classes)
  );

  // construct merged diff elements: two columns for before/after
  const finalObjects = [];
  const blankObj = {};

  let securityLoopNb = 0;
  let securityLoopLocalNb = 0;
  let securityLoopRemoteNb = 0;

  let localObj = localObjects.shift();
  let remoteObj = remoteObjects.shift();

  while (localObj || remoteObj) {
    // add blank object for moved/removed local elements
    while (
      localObj &&
      localObj.changes.some(({ status }) => [MOVED, REMOVED].includes(status))
    ) {
      finalObjects.push([localObj, blankObj]);
      localObj = localObjects.shift();

      // security for infinite loop
      securityLoopLocalNb += 1;
      if (securityLoopLocalNb > SECURITY_LOOP_THRESHOLD) {
        throw new Error(
          'The syncing diff process stopped because it was in an infinite loop.'
        );
      }
    }

    // add blank object for added/moved remote elements
    while (
      remoteObj &&
      remoteObj.changes.some(({ status }) => [MOVED, ADDED].includes(status))
    ) {
      finalObjects.push([blankObj, remoteObj]);
      remoteObj = remoteObjects.shift();

      // security for infinite loop
      securityLoopRemoteNb += 1;
      if (securityLoopRemoteNb > SECURITY_LOOP_THRESHOLD) {
        throw new Error(
          'The syncing diff process stopped because it was in an infinite loop.'
        );
      }
    }

    // when local and remote ids match, it is either updated or not changed
    if (localObj && remoteObj && localObj.id === remoteObj.id) {
      finalObjects.push([localObj, remoteObj]);
      localObj = localObjects.shift();
      remoteObj = remoteObjects.shift();
    }

    // security for infinite loop
    securityLoopNb += 1;
    if (securityLoopNb > SECURITY_LOOP_THRESHOLD) {
      throw new Error(
        'The syncing diff process stopped because it was in an infinite loop.'
      );
    }
  }

  return finalObjects;
};
