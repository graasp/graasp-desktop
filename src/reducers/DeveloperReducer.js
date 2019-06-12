import { Map } from 'immutable';
import { GET_DATABASE_SUCCEEDED, SET_DATABASE_SUCCEEDED } from '../types';

const INITIAL_STATE = Map({
  database: null,
});

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case GET_DATABASE_SUCCEEDED:
    case SET_DATABASE_SUCCEEDED:
      return state.set('database', payload);
    default:
      return state;
  }
};
