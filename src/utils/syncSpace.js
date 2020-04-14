import _ from 'lodash';
import {
  SYNC_ADDED,
  SYNC_MOVED,
  SYNC_REMOVED,
  SYNC_UPDATED,
  SYNC_BEFORE_MOVED,
} from '../config/constants';

export const diffString = (localStr, remoteStr) => {
  return {
    [SYNC_ADDED]: !localStr && remoteStr,
    [SYNC_REMOVED]: localStr && !remoteStr,
    [SYNC_UPDATED]: localStr && remoteStr && localStr !== remoteStr,
  };
};

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
    // keep if it is not removed or added change status
    correspondingChanges.filter(({ status }) =>
      [SYNC_ADDED, SYNC_REMOVED].includes(status)
    ).length === 0
  );
};

const addDiffToObject = (obj, diff, classes) => {
  const objDiff = diff.filter(({ id }) => id === obj.id);
  return {
    ...obj,
    changes: objDiff,
    className: objDiff.map(({ status }) => classes[status]).join(' '),
  };
};

const getRelativeIdx = (arr, originalIdx, changes) => {
  return arr.slice(0, originalIdx).filter(el => countConditions(changes, el))
    .length;
};

const findDiffInElementArray = (localObj, remoteObj, properties) => {
  const uniqueItemIds = _.union(
    localObj.map(({ id }) => id),
    remoteObj.map(({ id }) => id)
  );

  const movedEls = {};
  const changes = [];

  uniqueItemIds.forEach(id => {
    const localEl = localObj.find(({ id: objectId }) => id === objectId);
    const remoteEl = remoteObj.find(({ id: objectId }) => id === objectId);
    const localOriginalIdx = localObj.indexOf(localEl);
    const remoteOriginalIdx = remoteObj.indexOf(remoteEl);

    // the element was added
    if (_.isEmpty(localEl)) {
      changes.push({
        id,
        status: SYNC_ADDED,
        localIdx: null,
        remoteIdx: remoteOriginalIdx,
      });
    }
    // the element was removed
    else if (_.isEmpty(remoteEl)) {
      changes.push({
        id,
        status: SYNC_REMOVED,
        localIdx: localOriginalIdx,
        remoteIdx: null,
      });
    }
    // exist in both obj
    else if (localEl && remoteEl) {
      // check changes
      // changes are only checked on a subset of properties (some properties only exist in local spaces)
      const filteredlocalEl = _.pick(localEl, properties);
      const filteredremoteEl = _.pick(remoteEl, properties);

      if (!_.isEqual(filteredlocalEl, filteredremoteEl)) {
        changes.push({
          id,
          status: SYNC_UPDATED,
          localIdx: localOriginalIdx,
          remoteIdx: remoteOriginalIdx,
        });
      }

      // check moved
      if (localOriginalIdx !== remoteOriginalIdx) {
        movedEls[id] = [localOriginalIdx, remoteOriginalIdx];
      }
    }
  });

  // item is moved if index is different independently of added / removed els
  Object.entries(movedEls).forEach(
    ([id, [localOriginalIdx, remoteOriginalIdx]]) => {
      const localIdx = getRelativeIdx(localObj, localOriginalIdx, changes);
      const remoteIdx = getRelativeIdx(remoteObj, remoteOriginalIdx, changes);
      if (localIdx !== remoteIdx) {
        changes.push({
          id,
          status: SYNC_MOVED,
          localIdx: localOriginalIdx,
          remoteIdx: remoteOriginalIdx,
        });
      }
    }
  );

  return changes;
};

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
    addDiffToObject(obj, localDiff, classes)
  );
  const remoteObjects = rElements.map(obj =>
    addDiffToObject(obj, remoteDiff, classes)
  );

  const finalObjects = [];
  const blankObj = {};

  let tmp = 0;

  let localObj = localObjects.shift();
  let remoteObj = remoteObjects.shift();

  while (localObj || remoteObj) {
    while (
      localObj &&
      localObj.changes.some(({ status }) =>
        [SYNC_MOVED, SYNC_REMOVED, SYNC_BEFORE_MOVED].includes(status)
      )
    ) {
      finalObjects.push([localObj, blankObj]);
      localObj = localObjects.shift();
    }
    while (
      remoteObj &&
      remoteObj.changes.some(({ status }) =>
        [SYNC_MOVED, SYNC_ADDED].includes(status)
      )
    ) {
      finalObjects.push([blankObj, remoteObj]);
      remoteObj = remoteObjects.shift();
    }

    // updated or no change
    if (localObj && remoteObj && localObj.id === remoteObj.id) {
      if (remoteObj.changes.some(({ status }) => status === SYNC_UPDATED)) {
        finalObjects.push([localObj, remoteObj]);
        localObj = localObjects.shift();
        remoteObj = remoteObjects.shift();
      }
      // no change
      else {
        finalObjects.push([localObj, remoteObj]);
        localObj = localObjects.shift();
        remoteObj = remoteObjects.shift();
      }
    }

    tmp += 1;
    if (tmp > 20) {
      console.log('p I breaaaak');
      break;
    }
  }

  return finalObjects;
};
