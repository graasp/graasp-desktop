import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router';
import { Map } from 'immutable';
import PropTypes from 'prop-types';
import Toolbar from '@material-ui/core/Toolbar';
import { withStyles } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline/CssBaseline';
import AppBar from '@material-ui/core/AppBar/AppBar';
import Styles from '../../Styles';
import Loader from '../common/Loader';
import Main from '../common/Main';
import { getClassroom } from '../../actions';

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
    }).isRequired,
    userId: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    classroom: Map(),
  };

  componentDidMount() {
    const {
      dispatchGetClassroom,
      userId,
      match: {
        params: { id },
      },
    } = this.props;
    dispatchGetClassroom({ id, userId });
  }

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

    return (
      <Main>
        {/* // todo : display table from data of current classroom */}
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

const StyledComponent = withStyles(Styles, { withTheme: true })(
  ConnectedComponent
);
const TranslatedComponent = withTranslation()(StyledComponent);

export default withRouter(TranslatedComponent);
