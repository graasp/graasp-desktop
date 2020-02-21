import React from 'react';
import { shallow } from 'enzyme';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import List from '@material-ui/core/List';
import { Online } from 'react-detect-offline';
import { MainMenu } from './MainMenu';
import {
  HOME_PATH,
  SPACES_NEARBY_PATH,
  VISIT_PATH,
  LOAD_SPACE_PATH,
  SETTINGS_PATH,
  DEVELOPER_PATH,
} from '../../config/paths';

const createMainMenuProps = (developerMode, path) => {
  return {
    t: text => text,
    developerMode,
    history: { replace: jest.fn() },
    match: { path },
  };
};
describe('<MainMenu />', () => {
  describe('<MainMenu /> with developerMode = false', () => {
    let wrapper;

    beforeAll(() => {
      const props = createMainMenuProps(false, HOME_PATH);
      // eslint-disable-next-line react/jsx-props-no-spreading
      wrapper = shallow(<MainMenu {...props} />);
    });

    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('renders one <List /> component', () => {
      expect(wrapper.find(List)).toHaveLength(1);
    });

    it('renders one <Online /> component containing 2 <MenuItems />', () => {
      expect(wrapper.find(Online)).toHaveLength(1);
      expect(wrapper.find(Online).find(MenuItem)).toHaveLength(2);
    });

    it('renders five <MenuItem /> components', () => {
      expect(wrapper.find(MenuItem)).toHaveLength(5);
    });

    it('renders five <MenuItem /> components with unique icons', () => {
      const menuItems = wrapper.find(MenuItem);
      expect(menuItems).toHaveLength(5);

      const icons = menuItems.find(ListItemIcon);
      expect(icons).toHaveLength(5);

      const uniqueIcons = icons
        .map(icon => icon.dive())
        .filter((item, i, ar) => ar.indexOf(item) === i);
      expect(icons.length).toBe(uniqueIcons.length);
    });
  });

  describe('<MainMenu /> with developerMode = true', () => {
    let wrapper;

    beforeAll(() => {
      const props = createMainMenuProps(true, HOME_PATH);
      // eslint-disable-next-line react/jsx-props-no-spreading
      wrapper = shallow(<MainMenu {...props} />);
    });

    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('renders one <List /> component', () => {
      expect(wrapper.find(List)).toHaveLength(1);
    });

    it('renders one <Online /> component containing 2 <MenuItems />', () => {
      expect(wrapper.find(Online)).toHaveLength(1);
      expect(wrapper.find(Online).find(MenuItem)).toHaveLength(2);
    });

    it('renders six <MenuItem /> components', () => {
      expect(wrapper.find(MenuItem)).toHaveLength(6);
    });

    it('renders six <MenuItem /> components with unique icons', () => {
      const menuItems = wrapper.find(MenuItem);
      expect(menuItems).toHaveLength(6);

      const icons = menuItems.find(ListItemIcon);
      expect(icons).toHaveLength(6);

      const uniqueIcons = icons
        .map(icon => icon.dive())
        .filter((item, i, ar) => ar.indexOf(item) === i);
      expect(icons.length).toBe(uniqueIcons.length);
    });
  });

  describe.each([
    [true, HOME_PATH, 'Saved Spaces'],
    [true, SPACES_NEARBY_PATH, 'Spaces Nearby'],
    [true, VISIT_PATH, 'Visit a Space'],
    [true, LOAD_SPACE_PATH, 'Load'],
    [true, SETTINGS_PATH, 'Settings'],
    [true, DEVELOPER_PATH, 'Developer'],
  ])('<MainMenu /> selects one MenuItem', (developerMode, path, text) => {
    it(`select path=${path} (developerMode = ${developerMode})`, () => {
      const props = createMainMenuProps(developerMode, path);
      // eslint-disable-next-line react/jsx-props-no-spreading
      const wrapper = shallow(<MainMenu {...props} />);
      const selectedMenuItem = wrapper.find({ selected: true });
      expect(selectedMenuItem).toHaveLength(1);
      expect(selectedMenuItem.find(ListItemText).prop('primary')).toEqual(text);
    });
  });
});
