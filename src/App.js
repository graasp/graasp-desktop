import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReduxToastr, { toastr } from 'react-redux-toastr';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core';
import { withTranslation } from 'react-i18next';
import { Detector } from 'react-detect-offline';
import WifiIcon from '@material-ui/icons/Wifi';
import WifiOffIcon from '@material-ui/icons/WifiOff';
import Home from './Home';
import VisitSpace from './components/VisitSpace';
import SpacesNearby from './components/SpacesNearby';
import Settings from './components/Settings';
import LoadSpace from './components/LoadSpace';
import SpaceScreen from './components/space/SpaceScreen';
import DeveloperScreen from './components/developer/DeveloperScreen';
import { OnlineTheme, OfflineTheme } from './themes';
import Dashboard from './components/dashboard/Dashboard';
import LoginScreen from './components/login/LoginScreen';
import Authorization from './components/Authorization';
import {
  SETTINGS_PATH,
  SPACE_PATH,
  HOME_PATH,
  SPACES_NEARBY_PATH,
  VISIT_PATH,
  LOAD_SPACE_PATH,
  DEVELOPER_PATH,
  DASHBOARD_PATH,
  LOGIN_PATH,
} from './config/paths';
import {
  getGeolocation,
  getUserFolder,
  getLanguage,
  getDeveloperMode,
  getGeolocationEnabled,
} from './actions';
import { DEFAULT_LANGUAGE } from './config/constants';
import {
  CONNECTION_MESSAGE_HEADER,
  CONNECTION_OFFLINE_MESSAGE,
  CONNECTION_ONLINE_MESSAGE,
} from './config/messages';
import './App.css';

const styles = () => ({
  toastrIcon: { marginBottom: '-20px', fontSize: '45px' },
});

export class App extends Component {
  state = { height: 0 };

  static propTypes = {
    dispatchGetGeolocation: PropTypes.func.isRequired,
    dispatchGetUserFolder: PropTypes.func.isRequired,
    dispatchGetLanguage: PropTypes.func.isRequired,
    dispatchGetDeveloperMode: PropTypes.func.isRequired,
    dispatchGetGeolocationEnabled: PropTypes.func.isRequired,
    lang: PropTypes.string,
    i18n: PropTypes.shape({
      changeLanguage: PropTypes.func.isRequired,
    }).isRequired,
    geolocationEnabled: PropTypes.bool.isRequired,
    classes: PropTypes.shape({
      toastrIcon: PropTypes.string.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    lang: DEFAULT_LANGUAGE,
  };

  constructor(props) {
    super(props);
    const {
      dispatchGetUserFolder,
      dispatchGetLanguage,
      dispatchGetDeveloperMode,
      dispatchGetGeolocationEnabled,
    } = this.props;

    dispatchGetLanguage();
    dispatchGetDeveloperMode();
    dispatchGetUserFolder();
    dispatchGetGeolocationEnabled();
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentDidUpdate({
    lang: prevLang,
    geolocationEnabled: prevGeolocationEnabled,
    dispatchGetGeolocation,
  }) {
    const { lang, i18n, geolocationEnabled } = this.props;
    if (lang !== prevLang) {
      i18n.changeLanguage(lang);
    }

    // fetch geolocation only if enabled
    if (geolocationEnabled && geolocationEnabled !== prevGeolocationEnabled) {
      dispatchGetGeolocation();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions = () => {
    this.setState({ height: window.innerHeight });
  };

  triggerConnectionToastr = online => {
    const { classes } = this.props;

    if (online) {
      toastr.light(CONNECTION_MESSAGE_HEADER, CONNECTION_ONLINE_MESSAGE, {
        icon: <WifiIcon className={classes.toastrIcon} />,
      });
    } else {
      toastr.light(CONNECTION_MESSAGE_HEADER, CONNECTION_OFFLINE_MESSAGE, {
        icon: <WifiOffIcon className={classes.toastrIcon} />,
      });
    }
  };

  render() {
    const { height } = this.state;

    return (
      <Detector
        render={({ online }) => (
          <MuiThemeProvider theme={online ? OnlineTheme : OfflineTheme}>
            {this.triggerConnectionToastr(online)}
            <div>
              <ReduxToastr
                transitionIn="fadeIn"
                preventDuplicates
                transitionOut="fadeOut"
              />
            </div>
            <Router>
              <div className="app" style={{ height }}>
                <Switch>
                  <Route exact path={LOGIN_PATH} component={LoginScreen} />
                  <Route
                    exact
                    path={HOME_PATH}
                    component={Authorization()(Home)}
                  />
                  <Route
                    exact
                    path={SPACES_NEARBY_PATH}
                    component={Authorization()(SpacesNearby)}
                  />
                  <Route
                    exact
                    path={VISIT_PATH}
                    component={Authorization()(VisitSpace)}
                  />
                  <Route
                    exact
                    path={LOAD_SPACE_PATH}
                    component={Authorization()(LoadSpace)}
                  />
                  <Route
                    exact
                    path={SETTINGS_PATH}
                    component={Authorization()(Settings)}
                  />
                  <Route
                    exact
                    path={SPACE_PATH}
                    component={Authorization()(SpaceScreen)}
                  />
                  <Route exact path={DASHBOARD_PATH} component={Dashboard} />
                  <Route
                    exact
                    path={DEVELOPER_PATH}
                    component={DeveloperScreen}
                  />
                  <Route exact path={LOGIN_PATH} component={LoginScreen} />
                </Switch>
              </div>
            </Router>
          </MuiThemeProvider>
        )}
      />
    );
  }
}

const mapStateToProps = ({ Authentication }) => ({
  lang: Authentication.getIn(['user', 'settings', 'lang']),
  geolocationEnabled: Authentication.getIn([
    'user',
    'settings',
    'geolocationEnabled',
  ]),
});

const mapDispatchToProps = {
  dispatchGetGeolocation: getGeolocation,
  dispatchGetUserFolder: getUserFolder,
  dispatchGetLanguage: getLanguage,
  dispatchGetDeveloperMode: getDeveloperMode,
  dispatchGetGeolocationEnabled: getGeolocationEnabled,
};

const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(App);

const StyledApp = withStyles(styles, { withTheme: true })(ConnectedApp);

const TranslatedApp = withTranslation()(StyledApp);

export default TranslatedApp;
