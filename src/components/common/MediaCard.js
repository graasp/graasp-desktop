import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  card: {
    maxWidth: 345,
    minWidth: 300,
  },
  media: {
    height: 300,
  },
  leftIcon: {
    marginRight: theme.spacing(),
  },
});

const MediaCard = props => {
  const { classes, name, image, text, button } = props;
  return (
    <Card className={classes.card}>
      <CardMedia className={classes.media} image={image} title={name} />
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2">
          {name}
        </Typography>
        <Typography component="p" dangerouslySetInnerHTML={{ __html: text }} />
      </CardContent>
      <CardActions>{button}</CardActions>
    </Card>
  );
};

MediaCard.propTypes = {
  classes: PropTypes.shape({ media: PropTypes.string.isRequired }).isRequired,
  name: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  text: PropTypes.string,
  button: PropTypes.node.isRequired,
};

MediaCard.defaultProps = {
  text: '',
};

export default withStyles(styles)(MediaCard);
