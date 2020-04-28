import { List } from 'immutable';

const updateActivityList = flag => {
  if (flag) {
    return list => list.push(flag);
  }
  return list => list.pop();
};

const updateFavoriteSpaces = ({ favorite, spaceId }) => favoriteSpaces => {
  const tmp = new Set(favoriteSpaces);
  if (favorite) {
    tmp.add(spaceId);
  } else {
    tmp.delete(spaceId);
  }
  return List(tmp);
};

export { updateActivityList, updateFavoriteSpaces };
