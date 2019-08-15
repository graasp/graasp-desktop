import { MAX_APP_HEIGHT, MIN_APP_HEIGHT } from '../config/layout';
import { RADIX } from '../config/constants';

const setHeight = (id, height) => {
  const heightToSave = Math.max(
    Math.min(height, MAX_APP_HEIGHT),
    MIN_APP_HEIGHT
  );
  localStorage.setItem(id, String(heightToSave));
};

const getHeight = id => {
  const height = localStorage.getItem(id);
  if (height) {
    return parseInt(height, RADIX);
  }
  return null;
};

export { setHeight, getHeight };
