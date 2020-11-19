import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { List, Set } from 'immutable';
import { withStyles } from '@material-ui/core';
import { withRouter } from 'react-router';
import Grid from '@material-ui/core/Grid/Grid';
import MediaCard from '../common/MediaCard';
import { clearSpace } from '../../actions';
import DefaultThumbnail from '../../data/graasp.jpg';
import { MIN_CARD_WIDTH } from '../../config/constants';
import { SPACE_CARD_CLASS } from '../../config/selectors';
import NoSpacesAvailable from '../common/NoSpacesAvailable';
import { buildSpacePath } from '../../config/paths';

const styles = {
  leftIcon: {
    marginRight: '0.5rem',
  },
};

class SpaceGrid extends Component {
  state = {
    columnNb: 4,
  };

  static propTypes = {
    folder: PropTypes.string,
    spaces: PropTypes.oneOfType([List, Set]).isRequired,
    history: PropTypes.shape({
      length: PropTypes.number.isRequired,
      push: PropTypes.func.isRequired,
    }).isRequired,
    dispatchClearSpace: PropTypes.func.isRequired,
    saved: PropTypes.bool,
    showActions: PropTypes.bool,
  };

  static defaultProps = {
    folder: null,
    saved: false,
    showActions: false,
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
    this.setState({
      columnNb: Math.floor(window.innerWidth / MIN_CARD_WIDTH) || 1,
    });
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
    const { spaces, history, saved, showActions } = this.props;
    const { columnNb } = this.state;

    const cardMargin = 15;

    // spaces is a set to mapping through it will return a set

    // dispatch cards in columns
    const columnWrapper = {
      items: [],
      updateColumnWrapper(card, index) {
        if (this.items[index]) {
          this.items[index].push(card);
        } else {
          this.items[index] = [card];
        }
      },
    };

    [...spaces].forEach((space, index) => {
      const { id, image = {}, description } = space;
      const { push } = history;

      const viewLink = () => {
        push(buildSpacePath(id, saved));
      };

      const card = (
        <Grid
          className={SPACE_CARD_CLASS}
          key={id}
          item
          style={{ margin: cardMargin }}
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

      columnWrapper.updateColumnWrapper(card, index % columnNb);
    });

    const MediaCards = [];

    columnWrapper.items.forEach((column, i) => {
      MediaCards.push(
        <div
          style={{
            flex: 1,
            flexWrap: 'wrap',
          }}
          // eslint-disable-next-line react/no-array-index-key
          key={`column-${i}`}
        >
          {column}
        </div>
      );
    });

    if (!MediaCards.length) {
      return <NoSpacesAvailable />;
    }
    return (
      <Grid container style={{ display: 'flex' }}>
        {MediaCards}
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
