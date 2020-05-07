import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import clsx from 'clsx';
import FavoriteBorderIcon from '@material-ui/icons/StarBorder';
import FavoriteIcon from '@material-ui/icons/Star';
import IconButton from '@material-ui/core/IconButton/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core';
import Styles from '../../Styles';
import { setSpaceAsFavorite } from '../../actions';
import { SPACE_FAVORITE_BUTTON_CLASS } from '../../config/selectors';

const styles = theme => ({
  ...Styles(theme),
  isFavorite: {
    '& svg': {
      fill: 'gold',
      stroke: '#FFB600',
    },
  },
});

class FavoriteButton extends Component {
  static propTypes = {
    space: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
    classes: PropTypes.shape({
      appBar: PropTypes.string.isRequired,
      button: PropTypes.string.isRequired,
      isFavorite: PropTypes.string.isRequired,
    }).isRequired,
    t: PropTypes.func.isRequired,
    spaceId: PropTypes.string.isRequired,
    dispatchSetSpaceAsFavorite: PropTypes.func.isRequired,
    favoriteSpaces: PropTypes.instanceOf(List).isRequired,
  };

  handleOnClick = isFavorite => {
    const { spaceId, dispatchSetSpaceAsFavorite } = this.props;
    dispatchSetSpaceAsFavorite({
      favorite: !isFavorite,
      spaceId,
    });
  };

  render() {
    const { classes, t, favoriteSpaces, spaceId } = this.props;

    const isFavorite = favoriteSpaces.includes(spaceId);

    return (
      <Tooltip title={t('Add this Space to your Favorite Spaces')}>
        <IconButton
          color="inherit"
          onClick={() => this.handleOnClick(isFavorite)}
          className={clsx(
            classes.button,
            { [classes.isFavorite]: isFavorite },
            SPACE_FAVORITE_BUTTON_CLASS
          )}
        >
          {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
      </Tooltip>
    );
  }
}

const mapStateToProps = ({ authentication }) => ({
  favoriteSpaces: authentication.getIn(['user', 'favoriteSpaces']),
});

const mapDispatchToProps = {
  dispatchSetSpaceAsFavorite: setSpaceAsFavorite,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(FavoriteButton);

const StyledComponent = withStyles(styles, { withTheme: true })(
  ConnectedComponent
);

const TranslatedComponent = withTranslation()(StyledComponent);

export default TranslatedComponent;
