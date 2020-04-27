import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import InputBase from '@material-ui/core/InputBase';
import { fade, withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import SearchIcon from '@material-ui/icons/Search';
import { setSearchQuery } from '../../actions';
import { SPACE_SEARCH_INPUT_ID } from '../../config/selectors';

const styles = theme => ({
  search: {
    position: 'absolute',
    right: '20px',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginRight: theme.spacing(2),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
});

class SearchSpaceBar extends Component {
  static propTypes = {
    classes: PropTypes.shape({
      search: PropTypes.string.isRequired,
      searchIcon: PropTypes.string.isRequired,
      inputRoot: PropTypes.string.isRequired,
      inputInput: PropTypes.string.isRequired,
    }).isRequired,
    t: PropTypes.func.isRequired,
    dispatchSetSearchQuery: PropTypes.func.isRequired,
    searchQuery: PropTypes.string.isRequired,
  };

  handleOnChange = event => {
    const { dispatchSetSearchQuery } = this.props;
    dispatchSetSearchQuery({ value: event.target.value });
  };

  render() {
    const { classes, t, searchQuery } = this.props;
    return (
      <div className={classes.search}>
        <div className={classes.searchIcon}>
          <SearchIcon />
        </div>
        <InputBase
          id={SPACE_SEARCH_INPUT_ID}
          placeholder={t('Search…')}
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
          value={searchQuery}
          onChange={this.handleOnChange}
          inputProps={{ 'aria-label': 'search' }}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ Space }) => ({
  searchQuery: Space.get('searchQuery'),
});

const mapDispatchToProps = {
  dispatchSetSearchQuery: setSearchQuery,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchSpaceBar);

const StyledComponent = withStyles(styles)(ConnectedComponent);

const TranslatedComponent = withTranslation()(StyledComponent);
export default TranslatedComponent;
