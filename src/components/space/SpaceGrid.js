import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import RemoveRedEyeIcon from '@material-ui/icons/RemoveRedEye';
import Button from '@material-ui/core/Button/Button';
import { withStyles } from '@material-ui/core';
import { withRouter } from 'react-router';
import Typography from '@material-ui/core/Typography/Typography';
import Grid from '@material-ui/core/Grid/Grid';
import MediaCard from '../common/MediaCard';
import { clearSpace } from '../../actions';
import DefaultThumbnail from '../../data/graasp.jpg';

class SpaceGrid extends Component {
  static styles = {
    leftIcon: {
      marginRight: '0.5rem',
    },
  };

  static propTypes = {
    folder: PropTypes.string,
    classes: PropTypes.shape({
      leftIcon: PropTypes.string.isRequired,
    }).isRequired,
    spaces: ImmutablePropTypes.setOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
      })
    ).isRequired,
    history: PropTypes.shape({ length: PropTypes.number.isRequired })
      .isRequired,
    dispatchClearSpace: PropTypes.func.isRequired,
  };

  static defaultProps = {
    folder: null,
  };

  componentDidMount() {
    const { dispatchClearSpace } = this.props;
    dispatchClearSpace();
  }

  // show the local background image if exists, otherwise fetch
  // the image from url if provided if not provided then pass
  // the default background image
  generateThumbnail = ({ image }) => {
    const { folder } = this.props;
    const {
      backgroundUrl,
      thumbnailUrl,
      backgroundAsset,
      thumbnailAsset,
    } = image;

    // prioritise assets
    if (folder) {
      if (thumbnailAsset) {
        return `file://${folder}/${thumbnailAsset}`;
      }
      if (backgroundAsset) {
        return `file://${folder}/${backgroundAsset}`;
      }
    }

    // fallback on urls
    if (thumbnailUrl) {
      return thumbnailUrl;
    }
    if (backgroundUrl) {
      return backgroundUrl;
    }

    // if nothing present return default image
    return DefaultThumbnail;
  };

  render() {
    const { spaces, classes, history } = this.props;

    // spaces is a set to mapping through it will return a set
    const MediaCards = spaces.map(space => {
      const { id, name, image = {}, description } = space;
      const { replace } = history;
      const ViewButton = (
        <Button
          variant="contained"
          size="large"
          color="primary"
          id={id}
          onClick={() => replace(`/space/${id}`)}
          fullWidth
        >
          <RemoveRedEyeIcon className={classes.leftIcon} />
          View
        </Button>
      );
      return (
        <Grid key={id} item>
          <MediaCard
            key={id}
            name={name}
            image={this.generateThumbnail({ image })}
            text={description}
            button={ViewButton}
          />
        </Grid>
      );
    });

    if (!MediaCards.size) {
      return (
        <Typography variant="h5" color="inherit">
          No spaces available.
        </Typography>
      );
    }
    return (
      <Grid container spacing={16}>
        {MediaCards}
      </Grid>
    );
  }
}

const mapStateToProps = ({ User }) => ({
  folder: User.getIn(['current', 'folder']),
});

const mapDispatchToProps = {
  dispatchClearSpace: clearSpace,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(SpaceGrid);

export default withRouter(withStyles(SpaceGrid.styles)(ConnectedComponent));
