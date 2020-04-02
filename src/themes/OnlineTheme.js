import { createMuiTheme } from '@material-ui/core/styles';

const OnlineTheme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    primary: { light: '#5050d2', main: '#5050d2', dark: '#5050d2' },
    secondary: { light: '#ffffff', main: '#ffffff', dark: '#ffffff' },
  },
});

export default OnlineTheme;
