// import { Map, List } from 'immutable';
import {
  FLAG_SIGNING_IN,
  SIGN_IN_SUCCEEDED,
  IS_AUTHENTICATED_SUCCEEDED,
  SIGN_OUT_SUCCEEDED,
  FLAG_SIGNING_OUT,
} from '../types';
import { updateActivityList } from './common';
import { INITIAL_STATE, DEFAULT_USER } from './UserReducer';
import { AUTHENTICATED } from '../config/constants';

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case FLAG_SIGNING_IN:
    case FLAG_SIGNING_OUT:
      return state.updateIn(
        ['current', 'activity'],
        updateActivityList(payload)
      );
    case SIGN_IN_SUCCEEDED:
      return state
        .setIn(['user'], payload)
        .setIn(['authenticated'], AUTHENTICATED);
    case SIGN_OUT_SUCCEEDED:
      return state
        .setIn(['user'], DEFAULT_USER)
        .setIn(['authenticated'], false);
    case IS_AUTHENTICATED_SUCCEEDED:
      return state.setIn(['authenticated'], payload);
    default:
      return state;
  }
};
