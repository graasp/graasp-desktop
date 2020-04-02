import { createMuiTheme } from '@material-ui/core/styles';

const OfflineTheme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    primary: { light: '#737373', main: '#737373', dark: '#737373' },
    secondary: { light: '#ffffff', main: '#ffffff', dark: '#ffffff' },
  },
});

export default OfflineTheme;
