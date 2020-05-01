import { combineReducers } from 'redux';
import { reducer as toastr } from 'react-redux-toastr';
import Space from './SpaceReducer';
import Phase from './PhaseReducer';
import Developer from './DeveloperReducer';
import layout from './layout';
import authentication from './authenticationReducer';
import syncSpace from './syncSpaceReducer';
import loadSpace from './loadSpaceReducer';

export default combineReducers({
  // todo: keys should always be camelCase
  Space,
  Phase,
  Developer,
  layout,
  toastr,
  authentication,
  syncSpace,
  loadSpace,
});
