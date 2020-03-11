import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography/Typography';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import { loadSpace } from '../actions/space';
import './LoadSpace.css';
import Styles from '../Styles';
import Loader from './common/Loader';
import Main from './common/Main';
import {
  RESPOND_LOAD_SPACE_PROMPT_CHANNEL,
  SHOW_LOAD_SPACE_PROMPT_CHANNEL,
} from '../config/channels';

class LoadSpace extends Component {
  state = {
    fileLocation: '',
  };

  static propTypes = {
    t: PropTypes.func.isRequired,
    dispatchLoadSpace: PropTypes.func.isRequired,
    theme: PropTypes.shape({ direction: PropTypes.string.isRequired })
      .isRequired,
    activity: PropTypes.bool.isRequired,
    history: PropTypes.shape({ length: PropTypes.number.isRequired })
      .isRequired,
    classes: PropTypes.shape({
      appBar: PropTypes.string.isRequired,
      root: PropTypes.string.isRequired,
      appBarShift: PropTypes.string.isRequired,
      menuButton: PropTypes.string.isRequired,
      hide: PropTypes.string.isRequired,
      drawerHeader: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      contentShift: PropTypes.string.isRequired,
      input: PropTypes.string.isRequired,
      button: PropTypes.string.isRequired,
      formControl: PropTypes.string.isRequired,
    }).isRequired,
  };

  handleFileLocation = event => {
    const fileLocation = event.target ? event.target.value : event;
    this.setState({ fileLocation });
  };

  handleLoad = () => {
    const { fileLocation } = this.state;
    const { dispatchLoadSpace } = this.props;
    dispatchLoadSpace({ fileLocation });
    this.setState({ fileLocation });
  };

  handleBrowse = () => {
    const options = {
      filters: [{ name: 'zip', extensions: ['zip'] }],
    };
    window.ipcRenderer.send(SHOW_LOAD_SPACE_PROMPT_CHANNEL, options);
    window.ipcRenderer.once(
      RESPOND_LOAD_SPACE_PROMPT_CHANNEL,
      (event, filePaths) => {
        if (filePaths && filePaths.length) {
          // currently we select only one file
          this.handleFileLocation(filePaths[0]);
        }
      }
    );
  };

  render() {
    const { classes, activity, t } = this.props;
    const { fileLocation } = this.state;

    if (activity) {
      return (
        <div className={classNames(classes.root, 'LoadSpace')}>
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
    return (
      <Main fullScreen>
        <FormControl className={classes.formControl}>
          <Typography variant="h4" color="inherit" style={{ margin: '2rem' }}>
            {t('Load a Space')}
          </Typography>
          <Button
            variant="contained"
            onClick={this.handleBrowse}
            color="primary"
            className={classes.button}
          >
            {t('Browse')}
          </Button>
          <Input
            required
            onChange={this.handleFileLocation}
            className={classes.input}
            inputProps={{
              'aria-label': 'Description',
            }}
            autoFocus
            value={fileLocation}
            type="text"
          />
          <Button
            variant="contained"
            onClick={this.handleLoad}
            color="primary"
            className={classes.button}
            disabled={!fileLocation.endsWith('.zip')}
          >
            {t('Load')}
          </Button>
        </FormControl>
      </Main>
    );
  }
}

const mapDispatchToProps = {
  dispatchLoadSpace: loadSpace,
};

const mapStateToProps = ({ Space }) => ({
  activity: Boolean(Space.getIn(['current', 'activity']).size),
});

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoadSpace);

const TranslatedComponent = withTranslation()(ConnectedComponent);

const StyledComponent = withStyles(Styles, { withTheme: true })(
  TranslatedComponent
);
export default withRouter(StyledComponent);
