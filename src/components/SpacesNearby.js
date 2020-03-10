import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Map, Set } from 'immutable';
import { withRouter } from 'react-router';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Styles from '../Styles';
import { getSpacesNearby } from '../actions';
import SpaceGrid from './space/SpaceGrid';
import Loader from './common/Loader';
import GeolocationControl from './common/GeolocationControl';
import { CONTROL_TYPES } from '../config/constants';
import Main from './common/Main';
import { SPACES_NEARBY_MAIN_ID } from '../config/selectors';

class SpacesNearby extends Component {
  static propTypes = {
    classes: PropTypes.shape({
      root: PropTypes.string.isRequired,
      appBarShift: PropTypes.string.isRequired,
      menuButton: PropTypes.string.isRequired,
      hide: PropTypes.string.isRequired,
      drawer: PropTypes.string.isRequired,
      drawerPaper: PropTypes.string.isRequired,
      drawerHeader: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      contentShift: PropTypes.string.isRequired,
      settings: PropTypes.string.isRequired,
    }).isRequired,
    theme: PropTypes.shape({
      direction: PropTypes.string.isRequired,
    }).isRequired,
    history: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
    dispatchGetSpacesNearby: PropTypes.func.isRequired,
    geolocation: PropTypes.instanceOf(Map),
    spaces: PropTypes.instanceOf(Set).isRequired,
    activity: PropTypes.bool,
    geolocationEnabled: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    geolocation: Map(),
    activity: false,
  };

  constructor(props) {
    super(props);
    this.getSpacesNearby();
  }

  componentDidUpdate({ geolocation: prevGeolocation }) {
    const { geolocation } = this.props;
    if (!geolocation.equals(prevGeolocation)) {
      this.getSpacesNearby();
    }
  }

  getSpacesNearby = () => {
    const { dispatchGetSpacesNearby, geolocation } = this.props;
    if (!geolocation.isEmpty()) {
      const {
        coords: { latitude, longitude },
      } = geolocation.toJS();
      dispatchGetSpacesNearby({
        latitude,
        longitude,
      });
    }
  };

  render() {
    const { classes, spaces, activity, geolocationEnabled } = this.props;

    if (activity) {
      return (
        <div className={classNames(classes.root)} style={{ height: '100%' }}>
          <CssBaseline />
          <AppBar position="fixed">
            <Toolbar />
          </AppBar>
          <main className="Main">
            <Loader />
          </main>
        </div>
      );
    }

    const geolocationContent = geolocationEnabled ? (
      <SpaceGrid spaces={spaces} />
    ) : (
      <div className="Main">
        <GeolocationControl controlType={CONTROL_TYPES.BUTTON} />
      </div>
    );

    return <Main id={SPACES_NEARBY_MAIN_ID}>{geolocationContent}</Main>;
  }
}

const mapStateToProps = ({ Authentication, Space }) => ({
  geolocation: Authentication.getIn(['user', 'settings', 'geolocation']),
  spaces: Space.getIn(['nearby', 'content']),
  activity: Boolean(Space.getIn(['nearby', 'activity']).size),
  geolocationEnabled: Authentication.getIn([
    'user',
    'settings',
    'geolocationEnabled',
  ]),
});

const mapDispatchToProps = {
  dispatchGetSpacesNearby: getSpacesNearby,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(SpacesNearby);

const StyledComponent = withStyles(Styles, { withTheme: true })(
  ConnectedComponent
);

export default withRouter(StyledComponent);
