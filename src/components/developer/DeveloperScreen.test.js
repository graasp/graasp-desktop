import React from 'react';
import { shallow } from 'enzyme';
import Typography from '@material-ui/core/Typography';
import { DeveloperScreen } from './DeveloperScreen';
import DatabaseEditor from './DatabaseEditor';
import Banner from '../common/Banner';

const createDeveloperScreenProps = () => ({
  t: (text) => text,
  classes: {
    root: '',
    appBar: '',
    appBarShift: '',
    menuButton: '',
    hide: '',
    drawer: '',
    drawerPaper: '',
    drawerHeader: '',
    content: '',
    contentShift: '',
    developer: 'developer',
    screenTitle: 'screenTitle',
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
});

describe('<DeveloperScreen />', () => {
  let wrapper;

  beforeAll(() => {
    const props = createDeveloperScreenProps();
    // eslint-disable-next-line react/jsx-props-no-spreading
    wrapper = shallow(<DeveloperScreen {...props} />);
  });

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('renders one <Typography /> component with text "Developer"', () => {
    const typography = wrapper.find(Typography);
    expect(typography).toHaveLength(1);
    expect(typography.contains('Developer')).toBeTruthy();
  });

  it('renders one <Banner /> component with error', () => {
    const banner = wrapper.find(Banner).find({ type: 'error' });
    expect(banner).toHaveLength(1);
  });

  it('renders one <DatabaseEditor /> component', () => {
    const databaseEditor = wrapper.find(DatabaseEditor);
    expect(databaseEditor).toHaveLength(1);
  });
});
