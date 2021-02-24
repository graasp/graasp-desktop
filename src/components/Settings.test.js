import React from 'react';
import { shallow } from 'enzyme';
import Typography from '@material-ui/core/Typography';
import { Settings } from './Settings';
import LanguageSelect from './common/LanguageSelect';
import DeveloperSwitch from './common/DeveloperSwitch';
import FontSizeSlider from './common/FontSizeSlider';
import { USER_MODES } from '../config/constants';

const createSettingsProps = () => ({
  t: (text) => text,
  classes: {
    appBar: '',
    root: '',
    appBarShift: '',
    menuButton: '',
    hide: '',
    drawer: '',
    drawerPaper: '',
    drawerHeader: '',
    content: '',
    contentShift: '',
    settings: '',
    divider: '',
  },
  theme: {
    direction: 'ltr',
  },
  history: {
    replace: jest.fn(),
  },
  i18n: {
    changeLanguage: jest.fn(),
  },
  userMode: USER_MODES.TEACHER,
  authenticated: true,
});

describe('<Settings />', () => {
  let wrapper;

  beforeAll(() => {
    const props = createSettingsProps();
    // eslint-disable-next-line react/jsx-props-no-spreading
    wrapper = shallow(<Settings {...props} />);
  });

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('renders one <Typography /> component with text Settings', () => {
    const typography = wrapper.find(Typography).find({ variant: 'h4' });
    expect(typography).toHaveLength(1);
    expect(typography.contains('Settings')).toBeTruthy();
  });

  it('renders one <LanguageSelect /> component', () => {
    expect(wrapper.find(LanguageSelect)).toHaveLength(1);
  });

  it('renders one <DeveloperSwitch /> component', () => {
    expect(wrapper.find(DeveloperSwitch)).toHaveLength(1);
  });

  it('renders one <FontSizeSlider /> component', () => {
    expect(wrapper.find(FontSizeSlider)).toHaveLength(1);
  });
});
