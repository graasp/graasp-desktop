import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import path from 'path';
import ImmutablePropTypes from 'react-immutable-proptypes';
import RemoveRedEyeIcon from '@material-ui/icons/RemoveRedEye';
import Fab from '@material-ui/core/Fab';
import { withStyles } from '@material-ui/core';
import { withRouter } from 'react-router';
import { withTranslation } from 'react-i18next';
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
    t: PropTypes.func.isRequired,
    saved: PropTypes.bool,

    columnNb: PropTypes.number,
  };

  static defaultProps = {
    folder: null,
    saved: false,

    columnNb: 4,
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
        return path.join(`file://`, folder, thumbnailAsset);
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
    const { spaces, classes, history, saved, t, columnNb } = this.props;

    // spaces is a set to mapping through it will return a set

    const columnWrapper = [];
    for (let i = 0; i < columnNb; i += 1) {
      columnWrapper[`column${i}`] = [];
    }

    let index = 0;
    spaces.forEach(space => {
      const { id, name, image = {}, description } = space;

      console.log('11', this.generateThumbnail({ image }));
      const { replace } = history;
      const ViewButton = (
        <Fab
          variant="extended"
          size="medium"
          color="primary"
          aria-label="Add"
          className={classes.margin}
          styles="box-shadow:0"
          onClick={() => replace(`/space/${id}?saved=${saved}`)}
          id={id}
        >
          <RemoveRedEyeIcon className={classes.leftIcon} />
          {t('View')}
        </Fab>
      );
      const columnIndex = index % columnNb;
      index += 1;
      const card = (
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
      columnWrapper[`column${columnIndex}`].push(card);
    });

    const MediaCards = [];

    for (let i = 0; i < columnNb; i += 1) {
      MediaCards.push(
        <div
          style={{
            flex: 1,
            flexWrap: 'wrap',
          }}
        >
          {columnWrapper[`column${i}`]}
        </div>
      );
    }

    if (!MediaCards.length) {
      return (
        <Typography variant="h5" color="inherit">
          {t('No Spaces Available')}
        </Typography>
      );
    }
    return (
      <Grid container spacing={10} style={{ display: 'flex' }}>
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

const TranslatedComponent = withTranslation()(ConnectedComponent);

export default withRouter(withStyles(SpaceGrid.styles)(TranslatedComponent));
