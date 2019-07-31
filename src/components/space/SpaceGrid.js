import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import path from 'path';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core';
import { withRouter } from 'react-router';
import { withTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography/Typography';
import Grid from '@material-ui/core/Grid/Grid';
import PlayArrow from '@material-ui/icons/PlayArrow';
import MediaCard from '../common/MediaCard';
import { clearSpace } from '../../actions';
import DefaultThumbnail from '../../data/graasp.jpg';

class SpaceGrid extends Component {
  static styles = {
    leftIcon: {
      marginRight: '0.5rem',
    },
  };

  state = {
    columnNb: 4,
  };

  static propTypes = {
    folder: PropTypes.string,
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
  };

  static defaultProps = {
    folder: null,
    saved: false,
  };

  componentDidMount() {
    this.updateColumnNb();
    window.addEventListener('resize', this.updateColumnNb);

    const { dispatchClearSpace } = this.props;
    dispatchClearSpace();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateColumnNb);
  }

  updateColumnNb = () => {
    // @TODO use mediaCard min width
    this.setState({ columnNb: Math.floor(window.innerWidth / 390) || 1 });
  };

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
    const { spaces, history, saved, t } = this.props;
    const { columnNb } = this.state;

    const cardMargin = 15;

    // spaces is a set to mapping through it will return a set

    const columnWrapper = [];
    for (let i = 0; i < columnNb; i += 1) {
      columnWrapper[`column${i}`] = [];
    }

    [...spaces].forEach((space, index) => {
      const { id, image = {}, description } = space;
      const { replace } = history;
      const ViewButton = (
        <Tooltip title={t('View')}>
          <Fab
            size="large"
            color="primary"
            aria-label="Add"
            styles="box-shadow:0"
            onClick={() => replace(`/space/${id}?saved=${saved}`)}
            id={id}
          >
            <PlayArrow fontSize="large" />
          </Fab>
        </Tooltip>
      );
      const columnIndex = index % columnNb;
      const card = (
        <Grid key={id} item style={{ margin: cardMargin }}>
          <MediaCard
            key={id}
            space={space}
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
      <Grid
        container
        spacing={10}
        style={{ display: 'flex', padding: cardMargin * 2 }}
      >
        {MediaCards}
      </Grid>
    );
  }
}

const mapStateToProps = ({ User, Space }) => ({
  folder: User.getIn(['current', 'folder']),
  deleted: Space.getIn(['current', 'deleted']),
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
