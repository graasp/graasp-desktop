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

export class Teacherboard extends Component {
  static propTypes = {
    classes: PropTypes.shape({
      root: PropTypes.string.isRequired,
    }).isRequired,
    classrooms: PropTypes.instanceOf(Set),
    dispatchGetClassrooms: PropTypes.string.isRequired,
    activity: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    classrooms: Set(),
  };

  componentDidMount() {
    const { dispatchGetClassrooms } = this.props;
    dispatchGetClassrooms();
  }

  render() {
    const { classrooms, activity, classes } = this.props;

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

    return (
      <Main id={CLASSROOMS_MAIN_ID}>
        <ClassroomGrid classrooms={classrooms} />

        <AddClassroomButton />
      </Main>
    );
  }
}

const mapStateToProps = ({ teacherBoard }) => ({
  classrooms: teacherBoard.getIn(['classrooms']),
  activity: Boolean(teacherBoard.getIn(['activity']).length),
});

const mapDispatchToProps = {
  dispatchGetClassrooms: getClassrooms,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(Teacherboard);

const StyledComponent = withStyles(Styles, { withTheme: true })(
  ConnectedComponent
);

const TranslatedComponent = withTranslation()(StyledComponent);

export default withRouter(TranslatedComponent);
