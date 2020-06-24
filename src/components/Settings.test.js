import React from 'react';
import { shallow } from 'enzyme';
import Typography from '@material-ui/core/Typography';
import { Settings } from './Settings';
import LanguageSelect from './common/LanguageSelect';
import DeveloperSwitch from './common/DeveloperSwitch';
import GeolocationControl from './common/GeolocationControl';
import { USER_MODES } from '../config/constants';

const createSettingsProps = () => {
  return {
    t: text => text,
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
  };
};

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
    const typography = wrapper.find(Typography);
    expect(typography).toHaveLength(1);
    expect(typography.contains('Settings')).toBeTruthy();
  });

  it('renders one <LanguageSelect /> component', () => {
    expect(wrapper.find(LanguageSelect)).toHaveLength(1);
  });

  it('renders one <DeveloperSwitch /> component', () => {
    expect(wrapper.find(DeveloperSwitch)).toHaveLength(1);
  });

  it('renders one <GeolocationControl /> component', () => {
    expect(wrapper.find(GeolocationControl)).toHaveLength(1);
  });
});
