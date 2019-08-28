import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReduxToastr from 'react-redux-toastr';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import Home from './Home';
import VisitSpace from './components/VisitSpace';
import SpacesNearby from './components/SpacesNearby';
import Settings from './components/Settings';
import LoadSpace from './components/LoadSpace';
import SpaceScreen from './components/space/SpaceScreen';
import DeveloperScreen from './components/developer/DeveloperScreen';
import {
  SETTINGS_PATH,
  SPACE_PATH,
  HOME_PATH,
  SPACES_NEARBY_PATH,
  VISIT_PATH,
  LOAD_SPACE_PATH,
  DEVELOPER_PATH,
} from './config/paths';
import {
  getGeolocation,
  getUserFolder,
  getLanguage,
  getDeveloperMode,
  getGeolocationEnabled,
} from './actions/user';
import { DEFAULT_LANGUAGE } from './config/constants';
import './App.css';

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    primary: { light: '#5050d2', main: '#5050d2', dark: '#5050d2' },
    secondary: { light: '#eeeeee', main: '#eeeeee', dark: '#eeeeee' },
  },
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

  render() {
    const { height } = this.state;
    return (
      <MuiThemeProvider theme={theme}>
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
              <Route exact path={HOME_PATH} component={Home} />
              <Route exact path={SPACES_NEARBY_PATH} component={SpacesNearby} />
              <Route exact path={VISIT_PATH} component={VisitSpace} />
              <Route exact path={LOAD_SPACE_PATH} component={LoadSpace} />
              <Route exact path={SETTINGS_PATH} component={Settings} />
              <Route exact path={SPACE_PATH} component={SpaceScreen} />
              <Route exact path={DEVELOPER_PATH} component={DeveloperScreen} />
            </Switch>
          </div>
        </Router>
      </MuiThemeProvider>
    );
  }
}

const mapStateToProps = ({ User }) => ({
  lang: User.getIn(['current', 'lang']),
  geolocationEnabled: User.getIn(['current', 'geolocationEnabled']),
});

const mapDispatchToProps = {
  dispatchGetGeolocation: getGeolocation,
  dispatchGetUserFolder: getUserFolder,
  dispatchGetLanguage: getLanguage,
  dispatchGetDeveloperMode: getDeveloperMode,
  dispatchGetGeolocationEnabled: getGeolocationEnabled,
};

const ConnectedApp = connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

const TranslatedApp = withTranslation()(ConnectedApp);

export default TranslatedApp;
