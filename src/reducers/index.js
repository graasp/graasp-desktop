import { combineReducers } from 'redux';
import { reducer as toastr } from 'react-redux-toastr';
import Space from './SpaceReducer';
import Phase from './PhaseReducer';
import User from './UserReducer';
import Developer from './DeveloperReducer';

export default combineReducers({
  Space,
  Phase,
  User,
  Developer,
  toastr,
});
