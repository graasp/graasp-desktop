import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import clsx from 'clsx';
import { List, Set } from 'immutable';
import { withStyles } from '@material-ui/core';
import { withRouter } from 'react-router';
import Grid from '@material-ui/core/Grid/Grid';
import MediaCard from '../common/MediaCard';
import { clearSpace } from '../../actions';
import DefaultThumbnail from '../../data/graasp.jpg';
import { SPACE_CARD_CLASS } from '../../config/selectors';
import NoSpacesAvailable from '../common/NoSpacesAvailable';
import { buildSpacePath } from '../../config/paths';

const styles = (theme) => ({
  grid: {
    margin: theme.spacing(2),
  },
});

class SpaceGrid extends Component {
  static propTypes = {
    folder: PropTypes.string,
    spaces: PropTypes.oneOfType([
      PropTypes.instanceOf(List),
      PropTypes.instanceOf(Set),
    ]).isRequired,
    history: PropTypes.shape({
      length: PropTypes.number.isRequired,
      push: PropTypes.func.isRequired,
    }).isRequired,
    dispatchClearSpace: PropTypes.func.isRequired,
    saved: PropTypes.bool,
    showActions: PropTypes.bool,
    classes: PropTypes.shape({
      leftIcon: PropTypes.string.isRequired,
      grid: PropTypes.string.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    folder: null,
    saved: false,
    showActions: false,
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
    const { spaces, history, saved, showActions, classes } = this.props;

    if (!spaces || !spaces.size) {
      return <NoSpacesAvailable />;
    }

    return (
      <Grid container justify="flex-start" alignItems="center">
        {[...spaces].map((space) => {
          const { id, image = {}, description } = space;
          const { push } = history;

          const viewLink = () => {
            push(buildSpacePath(id, saved));
          };

          return (
            <Grid
              className={clsx(SPACE_CARD_CLASS, classes.grid)}
              key={id}
              item
              spacing={2}
              xs
            >
              <MediaCard
                key={id}
                space={space}
                image={this.generateThumbnail({ image })}
                text={description}
                viewLink={viewLink}
                showActions={showActions}
              />
            </Grid>
          );
        })}
      </Grid>
    );
  }
}

const mapStateToProps = ({ authentication }) => ({
  folder: authentication.getIn(['current', 'folder']),
});

const mapDispatchToProps = {
  dispatchClearSpace: clearSpace,
};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(SpaceGrid);

export default withRouter(withStyles(styles)(ConnectedComponent));
