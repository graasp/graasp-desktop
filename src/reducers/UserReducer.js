import { Map } from 'immutable';
import { GET_GEOLOCATION_SUCCEEDED } from '../types';

const INITIAL_STATE = Map({
  current: Map({
    geolocation: Map(),
  }),
});

export default (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case GET_GEOLOCATION_SUCCEEDED:
      return state.setIn(['current', 'geolocation'], Map(payload));
    default:
      return state;
  }
};
