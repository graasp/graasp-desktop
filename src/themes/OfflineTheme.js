import { createMuiTheme } from '@material-ui/core/styles';

const OfflineTheme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    secondary: { light: '#5050d2', main: '#5050d2', dark: '#5050d2' },
    primary: { light: '#737373', main: '#737373', dark: '#737373' },
  },
});

export default OfflineTheme;
