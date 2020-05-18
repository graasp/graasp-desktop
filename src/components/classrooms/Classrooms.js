import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';
import { withRouter } from 'react-router';
import { Set } from 'immutable';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar/AppBar';
import Toolbar from '@material-ui/core/Toolbar/Toolbar';
import PropTypes from 'prop-types';
import Loader from '../common/Loader';
import Main from '../common/Main';
import { getClassrooms } from '../../actions';
import AddClassroomButton from './AddClassroomButton';
import ClassroomGrid from './ClassroomGrid';
import Styles from '../../Styles';
import { CLASSROOMS_MAIN_ID } from '../../config/selectors';

export class Classrooms extends Component {
  static propTypes = {
    classes: PropTypes.shape({
      root: PropTypes.string.isRequired,
    }).isRequired,
    classrooms: PropTypes.instanceOf(Set),
    dispatchGetClassrooms: PropTypes.string.isRequired,
    activity: PropTypes.bool.isRequired,
    userId: PropTypes.string.isRequired,
  };

  static defaultProps = {
    classrooms: Set(),
  };

  componentDidMount() {
    const { dispatchGetClassrooms } = this.props;
    dispatchGetClassrooms();
  }

  render() {
    const { classrooms, activity, classes, userId } = this.props;

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

    const filteredClassrooms = classrooms.filter(
      ({ teacherId }) => teacherId === userId
    );

    return (
      <Main id={CLASSROOMS_MAIN_ID}>
        <ClassroomGrid classrooms={filteredClassrooms} />

        <AddClassroomButton />
      </Main>
    );
  }
}

const mapStateToProps = ({ classroom, authentication }) => ({
  classrooms: classroom.getIn(['classrooms']),
  activity: Boolean(classroom.getIn(['activity']).length),
  userId: authentication.getIn(['user', 'id']),
});

const mapDispatchToProps = {
  dispatchGetClassrooms: getClassrooms,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(Classrooms);

const StyledComponent = withStyles(Styles, { withTheme: true })(
  ConnectedComponent
);

const TranslatedComponent = withTranslation()(StyledComponent);

export default withRouter(TranslatedComponent);
