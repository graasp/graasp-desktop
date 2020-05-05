import { Map, List } from 'immutable';
import {
  FLAG_EXPORTING_SPACE,
  CLEAR_EXPORT_SPACE,
  SET_EXPORT_SPACE,
  FLAG_SETTING_EXPORT_SPACE,
  EXPORT_SPACE_SUCCESS,
  FLAG_CLEARING_EXPORT_SPACE,
} from '../types';
import { updateActivityList } from './common';

export const EXPORT_SPACE_STATUS = {
  IDLE: 'idle',
  PENDING: 'pending',
  SUCCESS: 'success',
};

const INITIAL_STATE = Map({
  activity: List(),
  status: EXPORT_SPACE_STATUS.IDLE,
  space: Map(),
});

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case FLAG_EXPORTING_SPACE:
    case FLAG_SETTING_EXPORT_SPACE:
    case FLAG_CLEARING_EXPORT_SPACE:
      return state.updateIn(['activity'], updateActivityList(payload));
    case SET_EXPORT_SPACE:
      return state
        .setIn(['space'], Map(payload.space))
        .setIn(['status'], EXPORT_SPACE_STATUS.PENDING);
    case EXPORT_SPACE_SUCCESS:
      return state.setIn(['status'], EXPORT_SPACE_STATUS.SUCCESS);
    case CLEAR_EXPORT_SPACE:
      return state
        .setIn(['status'], EXPORT_SPACE_STATUS.IDLE)
        .setIn(['space'], Map());
    default:
      return state;
  }
};
