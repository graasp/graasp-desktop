import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import { Online, Offline } from 'react-detect-offline';
import Typography from '@material-ui/core/Typography/Typography';
import CloudIcon from '@material-ui/icons/Cloud';
import CloudOffIcon from '@material-ui/icons/CloudOff';
import { withTranslation } from 'react-i18next';
import ListItem from '@material-ui/core/ListItem';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

const styles = () => ({
  drawerHeader: {
    height: '55px',
  },
  username: {
    fontWeight: 'bold',
    fontSize: '1rem',
  },
  secondaryAction: {
    right: '5px',
  },
});

const DrawerHeader = ({ classes, theme, handleDrawerClose, username }) => {
  return (
    <ListItem
      classes={{ root: classes.drawerHeader }}
      divider
      ContainerComponent="div"
    >
      <ListItemIcon>
        <Online>
          <CloudIcon />
        </Online>
        <Offline>
          <CloudOffIcon />
        </Offline>
      </ListItemIcon>

      <Typography
        variant="inherit"
        color="inherit"
        noWrap
        classes={{ root: classes.username }}
      >
        {username}
      </Typography>

      <ListItemSecondaryAction classes={{ root: classes.secondaryAction }}>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === 'ltr' ? (
            <ChevronLeftIcon />
          ) : (
            <ChevronRightIcon />
          )}
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

DrawerHeader.propTypes = {
  classes: PropTypes.shape({
    username: PropTypes.string.isRequired,
    secondaryAction: PropTypes.string.isRequired,
    drawerHeader: PropTypes.string.isRequired,
  }).isRequired,
  theme: PropTypes.shape({
    direction: PropTypes.string.isRequired,
  }).isRequired,
  handleDrawerClose: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
};

const mapStateToProps = ({ authentication }) => ({
  username: authentication.getIn(['user', 'username']),
});

const ConnectedComponent = connect(mapStateToProps, null)(DrawerHeader);

const StyledComponent = withStyles(styles, { withTheme: true })(
  ConnectedComponent
);

const TranslatedComponent = withTranslation()(StyledComponent);

export default TranslatedComponent;
