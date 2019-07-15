import { reducer as toastr } from 'react-redux-toastr';
import Space from './SpaceReducer';
import Phase from './PhaseReducer';
import User from './UserReducer';
import Developer from './DeveloperReducer';
import Authentication from './AuthenticationReducer';

const reducers = {
  Space,
  Phase,
  User,
  Developer,
  Authentication,
  toastr,
};

export default reducers;
