import { combineReducers } from 'redux';
import { reducer as toastr } from 'react-redux-toastr';
import Space from './SpaceReducer';
import Phase from './PhaseReducer';
import User from './UserReducer';
import Developer from './DeveloperReducer';
import layout from './layout';

export default combineReducers({
  // todo: keys should always be camelCase
  Space,
  Phase,
  User,
  Developer,
  layout,
  toastr,
});
