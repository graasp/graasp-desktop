import { FORM_CONTROL_MIN_WIDTH } from './config/constants';

const drawerWidth = 240;

const Styles = theme => ({
  root: {
    display: 'flex',
    height: '100%',
  },
  fullScreen: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 8px',
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  input: {
    margin: theme.spacing(),
  },
  button: {
    margin: theme.spacing(),
  },
  screenTitle: {
    marginBottom: theme.spacing(2),
  },
  spaceDescription: {
    marginBottom: theme.spacing(3),
  },
  settings: {
    padding: theme.spacing(3),
  },
  developer: {
    padding: theme.spacing(3),
  },
  formControl: {
    margin: theme.spacing(),
    minWidth: FORM_CONTROL_MIN_WIDTH,
  },
  dividerColor: {
    color: 'white',
    backgroundColor: 'white',
    margin: theme.spacing(2),
  },
});

export default Styles;
