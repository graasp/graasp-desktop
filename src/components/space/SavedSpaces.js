import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import RemoveRedEyeIcon from '@material-ui/icons/RemoveRedEye';
import Button from '@material-ui/core/Button/Button';
import { withStyles } from '@material-ui/core';
import { withRouter } from 'react-router';
import Typography from '@material-ui/core/Typography/Typography';
import Grid from '@material-ui/core/Grid/Grid';
import MediaCard from '../common/MediaCard';
import { clearSpace } from '../../actions';

class SavedSpaces extends Component {
  componentDidMount() {
    const { dispatchClearSpace } = this.props;
    dispatchClearSpace();
  }

  render() {
    const {
      spaces,
      classes,
      history,
    } = this.props;
    const MediaCards = spaces.map((space) => {
      const {
        id,
        title,
        image,
        text,
      } = space;
      const { replace } = history;
      return (
        <Grid key={Number(id)} item>
          <MediaCard
            key={Number(id)}
            title={title}
            image={image}
            text={text}
            button={(
              <Button
                variant="contained"
                size="large"
                color="primary"
                id={Number(id)}
                onClick={() => replace(`/space/${id}`)}
              >
                <RemoveRedEyeIcon className={classes.leftIcon} style={{ marginRight: '0.5rem' }} />
                View
              </Button>
            )}
          />
        </Grid>
      );
    });
    if (MediaCards.length === 0) {
      return (
        <Typography variant="h5" color="inherit" align="center">
          No saved spaces available
        </Typography>
      );
    }
    return (
      <Grid container className={classes.demo} spacing={16}>
        {MediaCards}
      </Grid>
    );
  }
}

const mapDispatchToProps = {
  dispatchClearSpace: clearSpace,
};

SavedSpaces.propTypes = {
  classes: PropTypes.shape({ appBar: PropTypes.string.isRequired }).isRequired,
  spaces: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string.isRequired })).isRequired,
  history: PropTypes.shape({ length: PropTypes.number.isRequired }).isRequired,
  dispatchClearSpace: PropTypes.func.isRequired,
};

export default withRouter(withStyles({})(connect(null, mapDispatchToProps)(SavedSpaces)));
