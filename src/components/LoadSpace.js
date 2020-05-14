import { toastr } from 'react-redux-toastr';
import React, { Component } from 'react';
import { Map } from 'immutable';
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
import './LoadSpace.css';
import Styles from '../Styles';
import Loader from './common/Loader';
import Main from './common/Main';
import {
  RESPOND_LOAD_SPACE_PROMPT_CHANNEL,
  SHOW_LOAD_SPACE_PROMPT_CHANNEL,
} from '../config/channels';
import {
  LOAD_MAIN_ID,
  LOAD_BROWSE_BUTTON_ID,
  LOAD_SUBMIT_BUTTON_ID,
  LOAD_INPUT_ID,
} from '../config/selectors';
import { LOAD_SELECTION_SPACE_PATH } from '../config/paths';
import { extractFileToLoadSpace } from '../actions';
import { isSpaceUpToDate } from '../utils/syncSpace';
import {
  ERROR_MESSAGE_HEADER,
  ERROR_STUDENT_LOAD_OUT_OF_DATE_SPACE_MESSAGE,
} from '../config/messages';
import { USER_MODES } from '../config/constants';

class LoadSpace extends Component {
  state = {
    fileLocation: '',
  };

  static propTypes = {
    t: PropTypes.func.isRequired,
    dispatchExtractFileToLoadSpace: PropTypes.func.isRequired,
    theme: PropTypes.shape({ direction: PropTypes.string.isRequired })
      .isRequired,
    activity: PropTypes.bool.isRequired,
    history: PropTypes.shape({
      length: PropTypes.number.isRequired,
      push: PropTypes.func.isRequired,
    }).isRequired,
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
    extractPath: PropTypes.string.isRequired,
    isStudent: PropTypes.bool.isRequired,
    space: PropTypes.instanceOf(Map),
    savedSpace: PropTypes.instanceOf(Map),
  };

  static defaultProps = {
    savedSpace: Map(),
    space: Map(),
  };

  componentDidUpdate() {
    // load space from extractpath if it is set
    const {
      extractPath,
      isStudent,
      space,
      savedSpace,
      history: { push },
    } = this.props;

    // space is different if zip space is not empty and the space does not exist locally or
    // there is a difference between currently saved space and space in zip
    // it changes space checkbox as well
    const isSpaceDifferent =
      !space.isEmpty() &&
      (savedSpace.isEmpty() ||
        !isSpaceUpToDate(space.toJS(), savedSpace.toJS()));

    // students cannot add out of date space data
    if (isSpaceDifferent && isStudent) {
      toastr.error(
        ERROR_MESSAGE_HEADER,
        ERROR_STUDENT_LOAD_OUT_OF_DATE_SPACE_MESSAGE
      );
    } else if (extractPath.length) {
      push({
        pathname: LOAD_SELECTION_SPACE_PATH,
        state: { isSpaceDifferent },
      });
    }
  }

  handleFileLocation = event => {
    const fileLocation = event.target ? event.target.value : event;
    this.setState({ fileLocation });
  };

  handleLoad = () => {
    const { fileLocation } = this.state;
    const { dispatchExtractFileToLoadSpace } = this.props;
    dispatchExtractFileToLoadSpace({ fileLocation });
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
      <Main id={LOAD_MAIN_ID} fullScreen>
        <FormControl className={classes.formControl}>
          <Typography variant="h4" color="inherit" style={{ margin: '2rem' }}>
            {t('Load a Space')}
          </Typography>
          <Button
            id={LOAD_BROWSE_BUTTON_ID}
            variant="contained"
            onClick={this.handleBrowse}
            color="primary"
            className={classes.button}
          >
            {t('Browse')}
          </Button>
          <Input
            id={LOAD_INPUT_ID}
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
            id={LOAD_SUBMIT_BUTTON_ID}
            variant="contained"
            onClick={this.handleLoad}
            color="primary"
            className={classes.button}
            disabled={!fileLocation.endsWith('.zip')}
          >
            {t('Submit')}
          </Button>
        </FormControl>
      </Main>
    );
  }
}

const mapDispatchToProps = {
  dispatchExtractFileToLoadSpace: extractFileToLoadSpace,
};

const mapStateToProps = ({ authentication, loadSpace }) => ({
  extractPath: loadSpace.getIn(['extract', 'extractPath']),
  activity: Boolean(loadSpace.getIn(['activity']).size),
  savedSpace: loadSpace.getIn(['extract', 'savedSpace']),
  space: loadSpace.getIn(['extract', 'elements', 'space']),
  isStudent:
    authentication.getIn(['user', 'settings', 'userMode']) ===
    USER_MODES.STUDENT,
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
