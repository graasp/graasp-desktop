import { createMuiTheme } from '@material-ui/core/styles';

const OnlineTheme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    primary: { light: '#5050d2', main: '#5050d2', dark: '#5050d2' },
    secondary: { light: '#737373', main: '#737373', dark: '#737373' },
  },
});

export default OnlineTheme;
