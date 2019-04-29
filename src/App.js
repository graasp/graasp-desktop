import React, { Component } from 'react';
import ReduxToastr from 'react-redux-toastr';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './Home';
import VisitSpace from './components/VisitSpace';
import SearchSpace from './components/SearchSpace';
import Settings from './components/Settings';
import LoadSpace from './components/LoadSpace';
import SpaceScreen from './components/space/SpaceScreen';
import {
  SETTINGS_PATH,
  SPACE_PATH,
  HOME_PATH,
  SEARCH_SPACE_PATH,
  VISIT_PATH,
  LOAD_SPACE_PATH,
} from './config/paths';

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    primary: { light: '#5348d3', main: '#5348d3', dark: '#5348d3' },
    secondary: { light: '#00b904', main: '#00b904', dark: '#00b904' },
  },
  status: {
    danger: 'red',
  },
});

export class App extends Component {
  state = { height: 0 };

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions = () => {
    this.setState({ height: window.innerHeight - 100 });
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
              <Route exact path={SEARCH_SPACE_PATH} component={SearchSpace} />
              <Route exact path={VISIT_PATH} component={VisitSpace} />
              <Route exact path={LOAD_SPACE_PATH} component={LoadSpace} />
              <Route exact path={SETTINGS_PATH} component={Settings} />
              <Route exact path={SPACE_PATH} component={SpaceScreen} />
            </Switch>
          </div>
        </Router>
      </MuiThemeProvider>
    );
  }
}

export default App;
