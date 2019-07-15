// import { Map, List } from 'immutable';
import {
  FLAG_LOGGING_IN,
  LOGIN_USER_SUCCEEDED,
  GET_AUTHENTICATED_SUCCEEDED,
  LOGOUT_USER_SUCCEEDED,
  FLAG_LOGGING_OUT,
} from '../types';
import { updateActivityList } from './common';
import { INITIAL_STATE, DEFAULT_USER } from './UserReducer';
import { AUTHENTICATED } from '../config/constants';

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case FLAG_LOGGING_IN:
    case FLAG_LOGGING_OUT:
      return state.updateIn(
        ['current', 'activity'],
        updateActivityList(payload)
      );
    case LOGIN_USER_SUCCEEDED:
      return state
        .setIn(['user'], payload)
        .setIn(['authenticated'], AUTHENTICATED);
    case LOGOUT_USER_SUCCEEDED:
      return state
        .setIn(['user'], DEFAULT_USER)
        .setIn(['authenticated'], false);
    case GET_AUTHENTICATED_SUCCEEDED:
      return state.setIn(['authenticated'], payload);
    default:
      return state;
  }
};
