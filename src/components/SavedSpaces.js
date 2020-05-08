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
import { getSpaces } from '../actions';
import SpaceGrid from './space/SpaceGrid';
import Styles from '../Styles';
import Loader from './common/Loader';
import Main from './common/Main';
import { SAVED_SPACES_MAIN_ID } from '../config/selectors';
import { searchSpacesByQuery } from '../utils/search';
import { SAVED_SPACES_PATH } from '../config/paths';

class SavedSpaces extends Component {
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
    searchQuery: PropTypes.string.isRequired,
  };

  state = (() => {
    const { spaces } = this.props;
    return { filteredSpaces: spaces };
  })();

  componentDidMount() {
    const { dispatchGetSpaces } = this.props;
    dispatchGetSpaces();
  }

  componentDidUpdate({ spaces: prevSpaces, searchQuery: prevSearchQuery }) {
    const { spaces, searchQuery } = this.props;
    if (!spaces.equals(prevSpaces) || searchQuery !== prevSearchQuery) {
      this.filterSpacesWithSearchQuery();
    }
  }

  filterSpacesWithSearchQuery = () => {
    const { spaces, searchQuery } = this.props;
    const filteredSpaces = searchSpacesByQuery(spaces, searchQuery);
    this.setState({ filteredSpaces });
  };

  render() {
    const { classes, activity } = this.props;
    const { filteredSpaces } = this.state;

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
      <Main id={SAVED_SPACES_MAIN_ID} showSearch>
        <SpaceGrid spaces={filteredSpaces} showActions saved />
      </Main>
    );
  }
}

const mapStateToProps = ({ Space }) => ({
  spaces: Space.get('saved'),
  searchQuery: Space.getIn(['search', SAVED_SPACES_PATH]),
  activity: Boolean(Space.getIn(['current', 'activity']).size),
});

const mapDispatchToProps = {
  dispatchGetSpaces: getSpaces,
};

export default withRouter(
  withStyles(Styles, { withTheme: true })(
    connect(mapStateToProps, mapDispatchToProps)(SavedSpaces)
  )
);
