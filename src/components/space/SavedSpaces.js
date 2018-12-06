import React from 'react';
import PropTypes from 'prop-types';
import RemoveRedEyeIcon from '@material-ui/icons/RemoveRedEye';
import Button from '@material-ui/core/Button/Button';
import { withStyles } from '@material-ui/core';
import { withRouter } from 'react-router';
import Typography from '@material-ui/core/Typography/Typography';
import Grid from '@material-ui/core/Grid/Grid';
import MediaCard from '../common/MediaCard';

const SavedSpaces = ({
  spaces,
  classes,
  history,
}) => {
  const MediaCards = spaces.map((space) => {
    const {
      id,
      title,
      image,
      text,
    } = space;
    const { replace } = history;
    return (
      <Grid key={id} item>
        <MediaCard
          key={id}
          title={title}
          image={image}
          text={text}
          button={(
            <Button variant="contained" size="large" color="primary" id={id} onClick={() => replace(`/space/${id}`)}>
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
};

SavedSpaces.propTypes = {
  classes: PropTypes.shape({ appBar: PropTypes.string.isRequired }).isRequired,
  spaces: PropTypes.arrayOf({ id: PropTypes.string.isRequired }).isRequired,
  history: PropTypes.shape({ length: PropTypes.number.isRequired }).isRequired,
};

export default withRouter(withStyles({})(SavedSpaces));
