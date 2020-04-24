import _ from 'lodash';
import {
  SYNC_ADDED,
  SYNC_MOVED,
  SYNC_REMOVED,
  SYNC_UPDATED,
  SYNC_BEFORE_MOVED,
  SYNC_SPACE_PROPERTIES,
  SYNC_ITEM_PROPERTIES,
} from '../config/constants';

const filterSpace = space => {
  const filteredSpace = _.pick(_.cloneDeep(space), SYNC_SPACE_PROPERTIES);

  // remove local space specific keys
  if (filteredSpace.image) {
    delete filteredSpace.image.thumbnailAsset;
  }
  // remove properties in items
  // eslint-disable-next-line no-restricted-syntax
  for (const phase of filteredSpace.phases) {
    phase.items = phase.items.map(item => _.pick(item, SYNC_ITEM_PROPERTIES));
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

const createChangeObj = (id, status, localIdx = null, remoteIdx = null) => ({
  id,
  status,
  localIdx,
  remoteIdx,
});

// compute diff for strings
// return map where keys are the change status with boolean values
export const diffString = (localStr, remoteStr) => {
  return {
    [SYNC_ADDED]: !localStr && remoteStr,
    [SYNC_REMOVED]: localStr && !remoteStr,
    [SYNC_UPDATED]: localStr && remoteStr && localStr !== remoteStr,
  };
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

// utility function to count ignore elements altering order
// added and removed element shouldn't be counted
const countConditions = (changes, { id }) => {
  const correspondingChanges = changes.filter(
    ({ id: itemId }) => itemId === id
  );
  return (
    // keep element if it has no change
    correspondingChanges.length === 0 ||
    // keep if it is not removed, added or moved
    correspondingChanges.filter(
      ({ status }) => [SYNC_ADDED, SYNC_REMOVED, SYNC_MOVED].includes(status) // <- depend on the added order
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
const getRelativeIdx = (arr, originalIdx, changes) => {
  return arr.slice(0, originalIdx).filter(el => countConditions(changes, el))
    .length;
};

// return array of differences between given objects for given properties
const findDiffInElementArray = (localObj, remoteObj, properties) => {
  const uniqueItemIds = _.union(
    localObj.map(({ id }) => id),
    remoteObj.map(({ id }) => id)
  );

  const movedEls = [];
  const changes = [];

  uniqueItemIds.forEach(id => {
    const localEl = localObj.find(({ id: objectId }) => id === objectId);
    const remoteEl = remoteObj.find(({ id: objectId }) => id === objectId);
    const localOriginalIdx = localObj.indexOf(localEl);
    const remoteOriginalIdx = remoteObj.indexOf(remoteEl);

    // the element was added
    if (_.isEmpty(localEl)) {
      changes.push(createChangeObj(id, SYNC_ADDED, null, remoteOriginalIdx));
    }
    // the element was removed
    else if (_.isEmpty(remoteEl)) {
      changes.push(createChangeObj(id, SYNC_REMOVED, localOriginalIdx, null));
    }
    // exist in both obj
    else if (localEl && remoteEl) {
      // check changes
      // changes are only checked on a subset of properties (some properties only exist in local spaces)
      const filteredlocalEl = _.pick(localEl, properties);
      const filteredremoteEl = _.pick(remoteEl, properties);

      if (!_.isEqual(filteredlocalEl, filteredremoteEl)) {
        changes.push(
          createChangeObj(id, SYNC_UPDATED, localOriginalIdx, remoteOriginalIdx)
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
          createChangeObj(id, SYNC_MOVED, localOriginalIdx, remoteOriginalIdx)
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
  const diff = findDiffInElementArray(lElements, rElements, properties);

  // append changes in elements
  // some statuses are only present in local or remote elements
  const localDiff = diff.filter(({ status }) =>
    [SYNC_REMOVED, SYNC_MOVED].includes(status)
  );
  const remoteDiff = diff.filter(({ status }) =>
    [SYNC_UPDATED, SYNC_MOVED, SYNC_ADDED].includes(status)
  );
  const localObjects = lElements.map(obj =>
    applyDiffToObject(obj, localDiff, classes)
  );
  const remoteObjects = rElements.map(obj =>
    applyDiffToObject(obj, remoteDiff, classes)
  );

  const finalObjects = [];
  const blankObj = {};

  let securityLoopNb = 0;

  let localObj = localObjects.shift();
  let remoteObj = remoteObjects.shift();

  while (localObj || remoteObj) {
    // add blank object for moved/removed local elements
    while (
      localObj &&
      localObj.changes.some(({ status }) =>
        [SYNC_MOVED, SYNC_REMOVED, SYNC_BEFORE_MOVED].includes(status)
      )
    ) {
      finalObjects.push([localObj, blankObj]);
      localObj = localObjects.shift();
    }

    // add blank object for added/moved remote elements
    while (
      remoteObj &&
      remoteObj.changes.some(({ status }) =>
        [SYNC_MOVED, SYNC_ADDED].includes(status)
      )
    ) {
      finalObjects.push([blankObj, remoteObj]);
      remoteObj = remoteObjects.shift();
    }

    // when local and remote ids matched, it is either updated or not changed
    if (localObj && remoteObj && localObj.id === remoteObj.id) {
      finalObjects.push([localObj, remoteObj]);
      localObj = localObjects.shift();
      remoteObj = remoteObjects.shift();
    }

    securityLoopNb += 1;
    if (securityLoopNb > 50) {
      throw new Error('An error occurred');
    }
  }

  return finalObjects;
};
