import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DeleteButton from '../space/DeleteButton';

const styles = theme => ({
  card: {
    maxWidth: 345,
    minWidth: 345,
    margin: 'auto',
    marginBottom: 15,
  },
  media: {
    height: 300,
  },
  leftIcon: {
    marginRight: theme.spacing(),
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
});

const MediaCard = props => {
  const { classes, name, image, text, button, id } = props;
  const [expanded, setExpanded] = React.useState(false);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card className={classes.card}>
      <CardMedia className={classes.media} image={image} title={name} />

      <CardContent>
        <Typography variant="h5" component="h2">
          {name}
        </Typography>
      </CardContent>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography
            component="p"
            dangerouslySetInnerHTML={{ __html: text }}
          />
        </CardContent>
      </Collapse>

      <CardActions disableSpacing>
        {button}

        <DeleteButton id={id} />

        {text && (
          <IconButton
            className={clsx(classes.expand, {
              [classes.expandOpen]: expanded,
            })}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="Show more"
          >
            <ExpandMoreIcon />
          </IconButton>
        )}
      </CardActions>
    </Card>
  );
};

MediaCard.propTypes = {
  classes: PropTypes.shape({ media: PropTypes.string.isRequired }).isRequired,
  name: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  text: PropTypes.string,
  button: PropTypes.node.isRequired,
  id: PropTypes.string.isRequired,
};

MediaCard.defaultProps = {
  text: '',
};

export default withStyles(styles)(MediaCard);
