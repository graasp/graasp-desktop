import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router';
import { Map } from 'immutable';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import CssBaseline from '@material-ui/core/CssBaseline/CssBaseline';
import AppBar from '@material-ui/core/AppBar/AppBar';
import Styles from '../../Styles';
import Loader from '../common/Loader';
import Main from '../common/Main';
import StudentsTable from './StudentsTable';
import AddUserInClassroomButton from './AddUserInClassroomButton';
import { getClassroom } from '../../actions';
import ImportDataButton from './ImportDataButton';

const styles = theme => ({
  ...Styles(theme),
  screen: {
    padding: theme.spacing(2),
  },
});

class ClassroomScreen extends Component {
  propTypes = {
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
      screen: PropTypes.string.isRequired,
      button: PropTypes.string.isRequired,
    }).isRequired,
    t: PropTypes.func.isRequired,
    history: PropTypes.shape({
      goBack: PropTypes.func.isRequired,
    }).isRequired,
    userId: PropTypes.string.isRequired,
  };

  static defaultProps = {
    classroom: Map(),
  };

  componentDidMount() {
    const {
      dispatchGetClassroom,
      match: {
        params: { id },
      },
      userId,
    } = this.props;
    dispatchGetClassroom({ id, userId });
  }

  renderBackButton = () => {
    const {
      t,
      classes,
      history: { goBack },
    } = this.props;
    return (
      <Button
        variant="contained"
        onClick={goBack}
        color="primary"
        className={classes.button}
      >
        {t('Back')}
      </Button>
    );
  };

  render() {
    const { activity, classroom, classes, t } = this.props;

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

    const classroomId = classroom.get('id');

    return (
      <Main>
        <div className={classes.screen}>
          <StudentsTable classroom={classroom} />
          <ImportDataButton classroomId={classroomId} />
          <AddUserInClassroomButton classroomId={classroomId} />
          {this.renderBackButton()}
        </div>
      </Main>
    );
  }
}

const mapStateToProps = ({ classroom, authentication }) => ({
  classroom: classroom.get('current'),
  activity: Boolean(classroom.get('activity').size),
  userId: authentication.getIn(['user', 'id']),
});

const mapDispatchToProps = {
  dispatchGetClassroom: getClassroom,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(ClassroomScreen);

const StyledComponent = withStyles(styles, { withTheme: true })(
  ConnectedComponent
);
const TranslatedComponent = withTranslation()(StyledComponent);

export default withRouter(TranslatedComponent);
