import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router';
import { toastr } from 'react-redux-toastr';
import Typography from '@material-ui/core/Typography/Typography';
import { Map } from 'immutable';
import Input from '@material-ui/core/Input';
import PropTypes from 'prop-types';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import CssBaseline from '@material-ui/core/CssBaseline/CssBaseline';
import AppBar from '@material-ui/core/AppBar/AppBar';
import Styles from '../../Styles';
import Loader from '../common/Loader';
import Main from '../common/Main';
import {
  ERROR_MESSAGE_HEADER,
  ERROR_GETTING_CLASSROOM_MESSAGE,
} from '../../config/messages';
import {
  getClassroom,
  extractFileToLoadSpaceInClassroom,
  clearLoadSpaceInClassroom,
  loadSpaceInClassroom,
} from '../../actions';
import ImportDataAssignUserForm from './ImportDataAssignUserForm';
import { showBrowsePrompt } from '../../utils/browse';
import { buildClassroomPath, CLASSROOMS_PATH } from '../../config/paths';
import {
  IMPORT_FILEPATH_IN_CLASSROOM_INPUT_ID,
  IMPORT_DATA_IN_CLASSROOM_SUBMIT_BUTTON_ID,
  IMPORT_DATA_IN_CLASSROOM_BACK_BUTTON_ID,
} from '../../config/selectors';

const styles = theme => ({
  ...Styles(theme),
  wrapper: {
    display: 'block',
    textAlign: 'center',
    width: '40%',
  },
  title: {
    margin: `${theme.spacing(3)}px auto`,
  },
  form: {
    display: 'flex',
    margin: '0 auto',
  },
  center: {
    margin: 'auto',
  },
  buttons: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

class ImportDataScreen extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    classroom: PropTypes.instanceOf(Map),
    dispatchGetClassroom: PropTypes.func.isRequired,
    activity: PropTypes.bool.isRequired,
    classes: PropTypes.shape({
      root: PropTypes.string.isRequired,
      button: PropTypes.string.isRequired,
      buttons: PropTypes.string.isRequired,
      wrapper: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      form: PropTypes.string.isRequired,
      center: PropTypes.string.isRequired,
      input: PropTypes.string.isRequired,
    }).isRequired,
    t: PropTypes.func.isRequired,
    history: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
    extractPath: PropTypes.string,
    dispatchClearLoadSpaceInClassroom: PropTypes.func.isRequired,
    dispatchExtractFileToLoadSpaceInClassroom: PropTypes.func.isRequired,
    userId: PropTypes.string.isRequired,
  };

  static defaultProps = {
    classroom: Map(),
    extractPath: '',
  };

  state = {
    fileLocation: '',
  };

  componentDidMount() {
    const {
      dispatchGetClassroom,
      match: {
        params: { id },
      },
      userId,
      history: { replace },
    } = this.props;

    // if id is not defined, return to classrooms
    if (!id) {
      toastr.error(ERROR_MESSAGE_HEADER, ERROR_GETTING_CLASSROOM_MESSAGE);
      replace(CLASSROOMS_PATH);
    } else {
      dispatchGetClassroom({ id, userId });
    }
  }

  componentWillUnmount() {
    const { dispatchClearLoadSpaceInClassroom, extractPath } = this.props;
    dispatchClearLoadSpaceInClassroom({ extractPath });
  }

  handleBrowse = () => {
    showBrowsePrompt(this.handleFileLocation);
  };

  handleFileLocation = event => {
    const fileLocation = event.target ? event.target.value : event;
    this.setState({ fileLocation });
  };

  handleLoad = () => {
    const { fileLocation } = this.state;
    const { dispatchExtractFileToLoadSpaceInClassroom, classroom } = this.props;
    const classroomId = classroom.get('id');
    dispatchExtractFileToLoadSpaceInClassroom({ fileLocation, classroomId });
  };

  handleBack = () => {
    const {
      history: { replace },
      classroom,
    } = this.props;
    replace(buildClassroomPath(classroom.get('id')));
  };

  render() {
    const { activity, classroom, classes, t, extractPath } = this.props;

    const { fileLocation } = this.state;

    if (activity) {
      return (
        <div className={classes.root}>
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

    if (!classroom || classroom.isEmpty()) {
      return <span>{t('Classroom not found')}</span>;
    }

    return (
      <Main fullScreen>
        <div className={classes.wrapper}>
          <Typography
            align="center"
            variant="h4"
            color="inherit"
            className={classes.title}
          >
            {`${t('Import Data to')} ${classroom.get('name')}`}
          </Typography>

          <FormControl className={classes.form}>
            {!extractPath.length ? (
              <>
                <Button
                  variant="contained"
                  onClick={this.handleBrowse}
                  color="primary"
                  className={classes.button}
                >
                  {t('Browse')}
                </Button>
                <Input
                  id={IMPORT_FILEPATH_IN_CLASSROOM_INPUT_ID}
                  required
                  onChange={this.handleFileLocation}
                  className={classes.input}
                  inputProps={{
                    'aria-label': t('Description'),
                  }}
                  autoFocus
                  value={fileLocation}
                  type="text"
                />
                <div className={classes.buttons}>
                  <Button
                    id={IMPORT_DATA_IN_CLASSROOM_BACK_BUTTON_ID}
                    variant="outlined"
                    onClick={this.handleBack}
                    color="primary"
                    className={classes.button}
                  >
                    {t('Back')}
                  </Button>
                  <Button
                    id={IMPORT_DATA_IN_CLASSROOM_SUBMIT_BUTTON_ID}
                    variant="contained"
                    onClick={this.handleLoad}
                    color="primary"
                    className={classes.button}
                    disabled={!fileLocation.endsWith('.zip')}
                  >
                    {t('Submit')}
                  </Button>
                </div>
              </>
            ) : (
              <ImportDataAssignUserForm />
            )}
          </FormControl>
        </div>
      </Main>
    );
  }
}

const mapStateToProps = ({ classroom, authentication }) => ({
  classroom: classroom.getIn(['current', 'classroom']),
  activity: Boolean(classroom.get('activity').size),
  extractPath: classroom.getIn(['current', 'load', 'extract', 'extractPath']),
  userId: authentication.getIn(['user', 'id']),
});

const mapDispatchToProps = {
  dispatchGetClassroom: getClassroom,
  dispatchClearLoadSpaceInClassroom: clearLoadSpaceInClassroom,
  dispatchExtractFileToLoadSpaceInClassroom: extractFileToLoadSpaceInClassroom,
  dispatchLoadSpaceInClassroom: loadSpaceInClassroom,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(ImportDataScreen);

const StyledComponent = withStyles(styles, { withTheme: true })(
  ConnectedComponent
);
const TranslatedComponent = withTranslation()(StyledComponent);

export default withRouter(TranslatedComponent);
