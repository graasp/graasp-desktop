import { createMuiTheme } from '@material-ui/core/styles';
import { THEME_COLORS, DEFAULT_USER_MODE } from '../config/constants';

const OnlineTheme = userMode => {
  // user mode define primary colors
  const themeColor =
    userMode in THEME_COLORS
      ? THEME_COLORS[userMode]
      : THEME_COLORS[DEFAULT_USER_MODE];
  const primary = { light: themeColor, main: themeColor, dark: themeColor };

  return createMuiTheme({
    typography: {
      useNextVariants: true,
    },
    palette: {
      primary,
      secondary: { light: '#ffffff', main: '#ffffff', dark: '#ffffff' },
    },
  });
};

export default OnlineTheme;
