import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography/Typography';
import PersonIcon from '@material-ui/icons/Person';
import { withTranslation } from 'react-i18next';
import ListItem from '@material-ui/core/ListItem';
import TeacherIcon from '@material-ui/icons/School';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import {
  DRAWER_HEADER_HEIGHT,
  USER_MODES,
  THEME_COLORS,
  AUTHENTICATED,
} from '../../config/constants';
import {
  DRAWER_HEADER_STUDENT_ICON_ID,
  DRAWER_HEADER_TEACHER_ICON_ID,
} from '../../config/selectors';

const styles = () => ({
  drawerHeader: {
    height: DRAWER_HEADER_HEIGHT,
  },
  username: {
    fontWeight: 'bold',
    fontSize: '1rem',
  },
  secondaryAction: {
    right: '5px',
  },
  teacherColor: {
    color: THEME_COLORS[USER_MODES.TEACHER],
  },
});

const DrawerHeader = ({
  classes,
  theme,
  handleDrawerClose,
  username,
  isTeacher,
  authenticated,
}) => (
  <ListItem
    classes={{ root: classes.drawerHeader }}
    divider
    ContainerComponent="div"
  >
    {authenticated && (
      <>
        <ListItemIcon>
          {isTeacher ? (
            <TeacherIcon
              className={classes.teacherColor}
              id={DRAWER_HEADER_TEACHER_ICON_ID}
            />
          ) : (
            <PersonIcon id={DRAWER_HEADER_STUDENT_ICON_ID} />
          )}
        </ListItemIcon>

        <Tooltip title={username}>
          <Typography
            variant="inherit"
            color="inherit"
            noWrap
            classes={{ root: classes.username }}
          >
            {username}
          </Typography>
        </Tooltip>
      </>
    )}

    <ListItemSecondaryAction classes={{ root: classes.secondaryAction }}>
      <IconButton onClick={handleDrawerClose}>
        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
      </IconButton>
    </ListItemSecondaryAction>
  </ListItem>
);

DrawerHeader.propTypes = {
  classes: PropTypes.shape({
    username: PropTypes.string.isRequired,
    secondaryAction: PropTypes.string.isRequired,
    drawerHeader: PropTypes.string.isRequired,
    teacherColor: PropTypes.string.isRequired,
  }).isRequired,
  theme: PropTypes.shape({
    direction: PropTypes.string.isRequired,
  }).isRequired,
  handleDrawerClose: PropTypes.func.isRequired,
  authenticated: PropTypes.bool.isRequired,
  username: PropTypes.string,
  isTeacher: PropTypes.bool.isRequired,
};

DrawerHeader.defaultProps = {
  username: '',
};

const mapStateToProps = ({ authentication }) => ({
  username: authentication.getIn(['user', 'username']),
  isTeacher:
    authentication.getIn(['user', 'settings', 'userMode']) ===
    USER_MODES.TEACHER,
  authenticated: authentication.get('authenticated') === AUTHENTICATED,
});

const ConnectedComponent = connect(mapStateToProps, null)(DrawerHeader);

const StyledComponent = withStyles(styles, { withTheme: true })(
  ConnectedComponent
);

const TranslatedComponent = withTranslation()(StyledComponent);

export default TranslatedComponent;
