import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { withStyles } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import { withTranslation } from 'react-i18next';
import WifiIcon from '@material-ui/icons/Wifi';
import WifiOffIcon from '@material-ui/icons/WifiOff';
import { MuiThemeProvider } from '@material-ui/core/styles';
import Home from './Home';
import VisitSpace from './components/VisitSpace';
import SpacesNearby from './components/SpacesNearby';
import Settings from './components/Settings';
import LoadSpace from './components/LoadSpace';
import SpaceScreen from './components/space/SpaceScreen';
import SyncScreen from './components/space/SyncScreen';
import ExportSelectionScreen from './components/space/export/ExportSelectionScreen';
import LoadSelectionScreen from './components/space/load/LoadSelectionScreen';
import DeveloperScreen from './components/developer/DeveloperScreen';
import Dashboard from './components/dashboard/Dashboard';
import SignInScreen from './components/signin/SignInScreen';
import Authorization from './components/Authorization';
import Classrooms from './components/classrooms/Classrooms';
import ImportDataScreen from './components/classrooms/ImportDataScreen';
import { OnlineTheme, OfflineTheme } from './themes';
import logo from './data/icon.png';
import {
  SETTINGS_PATH,
  SYNC_SPACE_PATH,
  SPACE_PATH,
  HOME_PATH,
  SPACES_NEARBY_PATH,
  VISIT_PATH,
  LOAD_SPACE_PATH,
  DEVELOPER_PATH,
  DASHBOARD_PATH,
  SIGN_IN_PATH,
  SAVED_SPACES_PATH,
  buildExportSelectionPathForSpaceId,
  LOAD_SELECTION_SPACE_PATH,
  CLASSROOMS_PATH,
  buildClassroomPath,
  buildImportDataInClassroomPath,
} from './config/paths';
import {
  getGeolocation,
  getUserFolder,
  getLanguage,
  getDeveloperMode,
  getGeolocationEnabled,
  isAuthenticated,
} from './actions';
import { DEFAULT_LANGUAGE, USER_MODES, PRODUCT_NAME } from './config/constants';
import {
  CONNECTION_MESSAGE_HEADER,
  CONNECTION_OFFLINE_MESSAGE,
  CONNECTION_ONLINE_MESSAGE,
  ERROR_INSTALLING_APP_UPGRADE_MESSAGE,
  ERROR_MESSAGE_HEADER,
  UPDATE_AVAILABLE_MESSAGE,
} from './config/messages';
import './App.css';
import SavedSpaces from './components/SavedSpaces';
import ClassroomScreen from './components/classrooms/ClassroomScreen';
import Tour from './components/common/Tour';
import {
  INSTALL_APP_UPGRADE_CHANNEL,
  GET_APP_UPGRADE_CHANNEL,
} from './config/channels';
import Loader from './components/common/Loader';
import { ERROR_GENERAL } from './config/errors';

const styles = () => ({
  toastrIcon: { marginBottom: '-20px', fontSize: '45px' },
  fullScreen: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export class App extends Component {
  state = { height: 0, isDownloadingUpdate: false };

  static propTypes = {
    dispatchGetGeolocation: PropTypes.func.isRequired,
    dispatchGetUserFolder: PropTypes.func.isRequired,
    dispatchGetLanguage: PropTypes.func.isRequired,
    dispatchGetDeveloperMode: PropTypes.func.isRequired,
    dispatchGetGeolocationEnabled: PropTypes.func.isRequired,
    dispatchIsAuthenticated: PropTypes.func.isRequired,
    lang: PropTypes.string,
    i18n: PropTypes.shape({
      changeLanguage: PropTypes.func.isRequired,
    }).isRequired,
    geolocationEnabled: PropTypes.bool.isRequired,
    classes: PropTypes.shape({
      toastrIcon: PropTypes.string.isRequired,
      fullScreen: PropTypes.string.isRequired,
    }).isRequired,
    connexionStatus: PropTypes.bool.isRequired,
    userMode: PropTypes.oneOf(USER_MODES).isRequired,
    t: PropTypes.func.isRequired,
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
      dispatchIsAuthenticated,
      userMode,
    } = this.props;

    dispatchIsAuthenticated();
    dispatchGetLanguage();
    dispatchGetDeveloperMode();
    dispatchGetUserFolder();
    dispatchGetGeolocationEnabled();

    if (userMode === USER_MODES.TEACHER) {
      this.checkAppUpgrade();
    }
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentDidUpdate({
    lang: prevLang,
    geolocationEnabled: prevGeolocationEnabled,
    dispatchGetGeolocation,
    connexionStatus: prevConnexionStatus,
    userMode: prevUserMode,
  }) {
    const {
      lang,
      i18n,
      geolocationEnabled,
      connexionStatus,
      userMode,
    } = this.props;
    if (lang !== prevLang) {
      i18n.changeLanguage(lang);
    }

    // fetch geolocation only if enabled
    if (geolocationEnabled && geolocationEnabled !== prevGeolocationEnabled) {
      dispatchGetGeolocation();
    }

    // display toastr when connexion status changes
    if (connexionStatus !== prevConnexionStatus) {
      this.triggerConnectionToastr();
    }

    if (userMode === USER_MODES.TEACHER && userMode !== prevUserMode) {
      this.checkAppUpgrade();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  checkAppUpgrade = () => {
    const { t } = this.props;

    // look for app upgrade
    window.ipcRenderer.send(GET_APP_UPGRADE_CHANNEL);

    window.ipcRenderer.once(
      GET_APP_UPGRADE_CHANNEL,
      (event, isUpgradeAvailable) => {
        // if available, ask for download and install
        if (isUpgradeAvailable) {
          // eslint-disable-next-line no-new
          new Notification(PRODUCT_NAME, {
            body: t('A new version is available'),
            icon: logo,
          });

          const toastrConfirmOptions = {
            icon: <img src={logo} alt={t('graasp logo')} />,
            okText: t('Accept'),
            cancelText: t('Ask next time'),
            onOk: () => {
              window.ipcRenderer.send(INSTALL_APP_UPGRADE_CHANNEL, true);
            },
            onCancel: () => {
              // do nothing
            },
          };
          window.ipcRenderer.on(INSTALL_APP_UPGRADE_CHANNEL, (e, payload) => {
            if (payload === ERROR_GENERAL) {
              toastr.error(
                ERROR_MESSAGE_HEADER,
                t(ERROR_INSTALLING_APP_UPGRADE_MESSAGE)
              );
              this.setState({ isDownloadingUpdate: false });
            } else {
              this.setState({ isDownloadingUpdate: true });
            }
          });
          toastr.confirm(t(UPDATE_AVAILABLE_MESSAGE), toastrConfirmOptions);
        }
      }
    );
  };

  updateWindowDimensions = () => {
    this.setState({ height: window.innerHeight });
  };

  triggerConnectionToastr = () => {
    const { classes, connexionStatus, t } = this.props;

    if (connexionStatus) {
      toastr.light(t(CONNECTION_MESSAGE_HEADER), t(CONNECTION_ONLINE_MESSAGE), {
        icon: <WifiIcon className={classes.toastrIcon} />,
      });
    } else {
      toastr.light(
        t(CONNECTION_MESSAGE_HEADER),
        t(CONNECTION_OFFLINE_MESSAGE),
        {
          icon: <WifiOffIcon className={classes.toastrIcon} />,
        }
      );
    }
  };

  render() {
    const { height, isDownloadingUpdate } = this.state;
    const { userMode, connexionStatus, classes, t } = this.props;

    let content = null;
    if (isDownloadingUpdate) {
      content = (
        <>
          <CssBaseline />
          <AppBar>
            <Toolbar />
          </AppBar>
          <main className={classes.fullScreen}>
            {t('Downloading update...')}
            <Loader />
          </main>
        </>
      );
    } else {
      content = (
        <Switch>
          <Route exact path={SIGN_IN_PATH} component={SignInScreen} />
          <Route exact path={HOME_PATH} component={Authorization()(Home)} />
          <Route
            exact
            path={SAVED_SPACES_PATH}
            component={Authorization()(SavedSpaces)}
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
            path={LOAD_SELECTION_SPACE_PATH}
            component={Authorization()(LoadSelectionScreen)}
          />
          <Route exact path={SETTINGS_PATH} component={Settings} />
          <Route
            exact
            path={SYNC_SPACE_PATH}
            component={Authorization()(SyncScreen)}
          />
          <Route
            exact
            path={buildExportSelectionPathForSpaceId()}
            component={Authorization()(ExportSelectionScreen)}
          />
          <Route
            exact
            path={SPACE_PATH}
            component={Authorization()(SpaceScreen)}
          />
          <Route
            exact
            path={DASHBOARD_PATH}
            component={Authorization()(Dashboard)}
          />
          <Route
            exact
            path={buildClassroomPath()}
            component={Authorization([USER_MODES.TEACHER])(ClassroomScreen)}
          />
          <Route
            exact
            path={CLASSROOMS_PATH}
            component={Authorization([USER_MODES.TEACHER])(Classrooms)}
          />
          <Route
            exact
            path={buildImportDataInClassroomPath()}
            component={Authorization([USER_MODES.TEACHER])(ImportDataScreen)}
          />
          <Route
            exact
            path={DEVELOPER_PATH}
            component={Authorization()(DeveloperScreen)}
          />
        </Switch>
      );
    }
    return (
      <MuiThemeProvider
        theme={connexionStatus ? OnlineTheme(userMode) : OfflineTheme}
      >
        <Router>
          <Tour />
          <div className="app" style={{ height }}>
            {content}
          </div>
        </Router>
      </MuiThemeProvider>
    );
  }
}

const mapStateToProps = ({ authentication }) => ({
  lang: authentication.getIn(['user', 'settings', 'lang']),
  geolocationEnabled: authentication.getIn([
    'user',
    'settings',
    'geolocationEnabled',
  ]),
  userMode: authentication.getIn(['user', 'settings', 'userMode']),
});

const mapDispatchToProps = {
  dispatchGetGeolocation: getGeolocation,
  dispatchGetUserFolder: getUserFolder,
  dispatchGetLanguage: getLanguage,
  dispatchGetDeveloperMode: getDeveloperMode,
  dispatchGetGeolocationEnabled: getGeolocationEnabled,
  dispatchIsAuthenticated: isAuthenticated,
};

const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(App);

const StyledApp = withStyles(styles, { withTheme: true })(ConnectedApp);

const TranslatedApp = withTranslation()(StyledApp);

export default TranslatedApp;
