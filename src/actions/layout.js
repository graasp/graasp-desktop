import { MAX_APP_HEIGHT, MIN_APP_HEIGHT } from '../config/layout';
import { RADIX } from '../config/constants';
import {
  OPEN_TOOLS,
  CLOSE_TOOLS,
  SET_TOOLS_WIDTH,
  SET_SIDE_BAR_IS_OPEN,
} from '../types';

const openTools = () => (dispatch) =>
  dispatch({
    type: OPEN_TOOLS,
  });

const closeTools = () => (dispatch) =>
  dispatch({
    type: CLOSE_TOOLS,
  });

const setToolsWidth = ({ width }) => (dispatch) =>
  dispatch({
    type: SET_TOOLS_WIDTH,
    payload: width,
  });

const setHeight = (id, height) => {
  const heightToSave = Math.max(
    Math.min(height, MAX_APP_HEIGHT),
    MIN_APP_HEIGHT
  );
  localStorage.setItem(id, String(heightToSave));
};

const getHeight = (id) => {
  const height = localStorage.getItem(id);
  if (height) {
    return parseInt(height, RADIX);
  }
  return null;
};

const setSideBarIsOpen = (state) => (dispatch) =>
  dispatch({
    type: SET_SIDE_BAR_IS_OPEN,
    payload: state,
  });

export {
  setHeight,
  getHeight,
  openTools,
  closeTools,
  setToolsWidth,
  setSideBarIsOpen,
};
