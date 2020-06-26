import React from 'react';
import { shallow } from 'enzyme';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import List from '@material-ui/core/List';
import { Online, Offline } from 'react-detect-offline';
import { MainMenu } from './MainMenu';
import {
  HOME_PATH,
  SPACES_NEARBY_PATH,
  VISIT_PATH,
  LOAD_SPACE_PATH,
  SETTINGS_PATH,
  DEVELOPER_PATH,
  DASHBOARD_PATH,
  SAVED_SPACES_PATH,
} from '../../config/paths';

const MENUITEM_OFFLINE_NUMBER = 2;
const MENUITEM_OFFLINE_ONLINE_COUNT = 11;

const createMainMenuProps = (developerMode, path, authenticated = true) => {
  return {
    t: text => text,
    developerMode,
    history: { replace: jest.fn() },
    match: { path },
    authenticated,
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

    it(`renders ${MENUITEM_OFFLINE_NUMBER} online/offline <MenuItem /> components`, () => {
      expect(wrapper.find(Online)).toHaveLength(MENUITEM_OFFLINE_NUMBER);
      expect(wrapper.find(Online).find(MenuItem)).toHaveLength(
        MENUITEM_OFFLINE_NUMBER
      );
      expect(wrapper.find(Offline)).toHaveLength(MENUITEM_OFFLINE_NUMBER);
      expect(wrapper.find(Offline).find(MenuItem)).toHaveLength(
        MENUITEM_OFFLINE_NUMBER
      );
    });

    it(`renders ${MENUITEM_OFFLINE_ONLINE_COUNT} <MenuItem /> components`, () => {
      expect(wrapper.find(MenuItem)).toHaveLength(
        MENUITEM_OFFLINE_ONLINE_COUNT
      );
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

    it(`renders ${MENUITEM_OFFLINE_NUMBER} online/offline <MenuItem /> components`, () => {
      expect(wrapper.find(Online)).toHaveLength(MENUITEM_OFFLINE_NUMBER);
      expect(wrapper.find(Online).find(MenuItem)).toHaveLength(
        MENUITEM_OFFLINE_NUMBER
      );
      expect(wrapper.find(Offline)).toHaveLength(MENUITEM_OFFLINE_NUMBER);
      expect(wrapper.find(Offline).find(MenuItem)).toHaveLength(
        MENUITEM_OFFLINE_NUMBER
      );
    });

    it(`renders ${MENUITEM_OFFLINE_ONLINE_COUNT +
      1} <MenuItem /> components`, () => {
      expect(wrapper.find(MenuItem)).toHaveLength(
        MENUITEM_OFFLINE_ONLINE_COUNT + 1
      );
    });
  });

  describe.each([
    [true, HOME_PATH, 'Home'],
    [true, SAVED_SPACES_PATH, 'Saved Spaces'],
    [true, SPACES_NEARBY_PATH, 'Spaces Nearby'],
    [true, VISIT_PATH, 'Visit a Space'],
    [true, LOAD_SPACE_PATH, 'Load'],
    [true, SETTINGS_PATH, 'Settings'],
    [true, DEVELOPER_PATH, 'Developer'],
    [true, DASHBOARD_PATH, 'Dashboard'],
  ])('<MainMenu /> selects one MenuItem', (developerMode, path, text) => {
    it(`select path=${path} (developerMode = ${developerMode})`, () => {
      const props = createMainMenuProps(developerMode, path);
      // eslint-disable-next-line react/jsx-props-no-spreading
      const wrapper = shallow(<MainMenu {...props} />);
      const selectedMenuItem = wrapper.find({ selected: true });
      expect(selectedMenuItem.length).toBeLessThanOrEqual(2);
      expect(
        selectedMenuItem.map(menuItem =>
          menuItem.find(ListItemText).prop('primary')
        )
      ).toEqual(Array(selectedMenuItem.length).fill(text));
    });
  });
});
