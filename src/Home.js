import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { withRouter } from 'react-router';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { connect } from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { getSpaces } from './actions';
import SpaceGrid from './components/space/SpaceGrid';
import Styles from './Styles';
import Loader from './components/common/Loader';
import Main from './components/common/Main';
import { HOME_MAIN_ID } from './config/selectors';

class Home extends Component {
  static propTypes = {
    classes: PropTypes.shape({
      root: PropTypes.string.isRequired,
      appBar: PropTypes.string.isRequired,
      appBarShift: PropTypes.string.isRequired,
      menuButton: PropTypes.string.isRequired,
      hide: PropTypes.string.isRequired,
      drawer: PropTypes.string.isRequired,
      drawerPaper: PropTypes.string.isRequired,
      drawerHeader: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      contentShift: PropTypes.string.isRequired,
    }).isRequired,
    theme: PropTypes.shape({ direction: PropTypes.string }).isRequired,
    dispatchGetSpaces: PropTypes.func.isRequired,
    spaces: ImmutablePropTypes.setOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
      })
    ).isRequired,
    activity: PropTypes.bool.isRequired,
    history: PropTypes.shape({ length: PropTypes.number.isRequired })
      .isRequired,
  };

  componentDidMount() {
    const { dispatchGetSpaces } = this.props;
    dispatchGetSpaces();
  }

  render() {
    const { classes, spaces, activity } = this.props;

    if (activity) {
      return (
        <div className={classNames(classes.root)} style={{ height: '100%' }}>
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
      <Main id={HOME_MAIN_ID}>
        <SpaceGrid spaces={spaces} showActions saved />
      </Main>
    );
  }
}

const mapStateToProps = ({ Space }) => ({
  spaces: Space.get('saved'),
  activity: Boolean(Space.getIn(['current', 'activity']).size),
});

const mapDispatchToProps = {
  dispatchGetSpaces: getSpaces,
};

export default withRouter(
  withStyles(Styles, { withTheme: true })(
    connect(mapStateToProps, mapDispatchToProps)(Home)
  )
);
