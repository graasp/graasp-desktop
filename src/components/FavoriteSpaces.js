import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Set, List } from 'immutable';
import { withRouter } from 'react-router';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Styles from '../Styles';
import SpaceGrid from './space/SpaceGrid';
import Loader from './common/Loader';
import Main from './common/Main';
import { SPACES_NEARBY_MAIN_ID } from '../config/selectors';
import { searchSpacesByQuery } from '../utils/search';
import { getSpaces } from '../actions';

class FavoriteSpaces extends Component {
  static propTypes = {
    classes: PropTypes.shape({
      root: PropTypes.string.isRequired,
      appBarShift: PropTypes.string.isRequired,
      menuButton: PropTypes.string.isRequired,
      hide: PropTypes.string.isRequired,
      drawer: PropTypes.string.isRequired,
      drawerPaper: PropTypes.string.isRequired,
      drawerHeader: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      contentShift: PropTypes.string.isRequired,
      settings: PropTypes.string.isRequired,
    }).isRequired,
    theme: PropTypes.shape({
      direction: PropTypes.string.isRequired,
    }).isRequired,
    history: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
    spaces: PropTypes.instanceOf(Set).isRequired,
    activity: PropTypes.bool,
    favoriteSpaces: PropTypes.instanceOf(List).isRequired,
    searchQuery: PropTypes.string.isRequired,
    dispatchGetSpaces: PropTypes.func.isRequired,
  };

  static defaultProps = {
    activity: false,
  };

  state = {
    filteredSpaces: Set(),
  };

  async componentDidMount() {
    const { dispatchGetSpaces } = this.props;
    await dispatchGetSpaces();
  }

  componentDidUpdate({
    spaces: prevSpaces,
    searchQuery: prevSearchQuery,
    favoriteSpaces: prevFavoriteSpaces,
  }) {
    const { spaces, searchQuery, favoriteSpaces } = this.props;
    if (
      !spaces.equals(prevSpaces) ||
      searchQuery !== prevSearchQuery ||
      !favoriteSpaces.equals(prevFavoriteSpaces)
    ) {
      this.filterSpaces();
    }
  }

  filterSpaces = () => {
    const { spaces, searchQuery, favoriteSpaces } = this.props;
    let filteredSpaces = searchSpacesByQuery(spaces, searchQuery);
    filteredSpaces = filteredSpaces.filter(({ id }) =>
      favoriteSpaces.includes(id)
    );
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
      <Main
        showSearch
        handleOnSearch={this.handleOnSearch}
        id={SPACES_NEARBY_MAIN_ID}
      >
        <SpaceGrid spaces={filteredSpaces} showActions saved />
      </Main>
    );
  }
}

const mapStateToProps = ({ authentication, Space }) => ({
  searchQuery: Space.get('searchQuery'),
  activity: Boolean(Space.getIn(['current', 'activity']).size),
  favoriteSpaces: authentication.getIn(['user', 'favoriteSpaces']),
  spaces: Space.get('saved'),
});

const mapDispatchToProps = {
  dispatchGetSpaces: getSpaces,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(FavoriteSpaces);

const StyledComponent = withStyles(Styles, { withTheme: true })(
  ConnectedComponent
);

export default withRouter(StyledComponent);
