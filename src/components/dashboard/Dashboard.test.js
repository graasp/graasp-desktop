import React from 'react';
import { shallow } from 'enzyme';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import { Dashboard } from './Dashboard';
import { DEFAULT_USER_MODE, USER_MODES } from '../../config/constants';
import {
  DASHBOARD_ACTION_EDITOR_ID,
  DASHBOARD_BAR_CHART_ID,
  DASHBOARD_USER_FILTER_ID,
  DASHBOARD_LINE_CHART_ID,
  DASHBOARD_NO_ACTION_MESSAGE_ID,
  DASHBOARD_PIE_CHART_ID,
  DASHBOARD_SPACE_FILTER_ID,
  DASHBOARD_TOTAL_COUNT_ID,
} from '../../config/selectors';

const sampleUserId = '123456';
const emptyUserId = 'empty';
const sampleUsers = [
  { id: sampleUserId, username: 'bob' },
  { id: 'randomId', username: 'anna' },
  { id: emptyUserId, username: 'cedric' },
];
const sampleSpaces = [{ id: 'spaceId', name: 'spaceName' }];
const sampleActions = [
  { id: 'actionId', user: sampleUserId, spaceId: 'spaceId' },
];
const sampleDatabase = {
  actions: sampleActions,
  users: sampleUsers,
  spaces: sampleSpaces,
};

const createDashboardProps = ({
  userId,
  userMode = DEFAULT_USER_MODE,
  users,
  actions,
  spaces,
} = {}) => {
  return {
    t: jest.fn((text) => text),
    classes: {
      dashboard: '',
      dashboardGridItem: '',
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
      developer: '',
      screenTitle: '',
    },
    theme: {
      direction: '',
    },
    history: {
      replace: jest.fn(),
    },
    i18n: {
      changeLanguage: jest.fn(),
    },
    database: {
      spaces,
      users,
      actions,
    },
    dispatchGetDatabase: jest.fn(),
    userMode,
    userId,
  };
};

describe('<Dashboard />', () => {
  let wrapper;

  describe('default props', () => {
    beforeAll(() => {
      const props = createDashboardProps();
      // eslint-disable-next-line react/jsx-props-no-spreading
      wrapper = shallow(<Dashboard {...props} />);
    });

    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('no actions renders message', () => {
      const typography = wrapper
        .find(Typography)
        .find(`#${DASHBOARD_NO_ACTION_MESSAGE_ID}`);
      expect(typography).toHaveLength(1);
      expect(typography.contains('No action has been recorded.')).toBeTruthy();
    });
  });

  describe('actions is defined', () => {
    describe('userMode = student', () => {
      it('displays no actions if no action exists for given userId', () => {
        const props = createDashboardProps({
          userId: emptyUserId,
          ...sampleDatabase,
        });
        // eslint-disable-next-line react/jsx-props-no-spreading
        wrapper = shallow(<Dashboard {...props} />);
        const typography = wrapper
          .find(Typography)
          .find(`#${DASHBOARD_NO_ACTION_MESSAGE_ID}`);
        expect(typography).toHaveLength(1);
        expect(
          typography.contains('No action has been recorded.')
        ).toBeTruthy();
      });

      it('displays 4 visualizations widgets, editor, space filter for given userId', () => {
        const props = createDashboardProps({
          userId: sampleUserId,
          ...sampleDatabase,
        });
        // eslint-disable-next-line react/jsx-props-no-spreading
        wrapper = shallow(<Dashboard {...props} />);
        const barChart = wrapper.find(`#${DASHBOARD_BAR_CHART_ID}`);
        expect(barChart).toHaveLength(1);
        expect(barChart).toHaveLength(1);
        const lineChart = wrapper.find(`#${DASHBOARD_LINE_CHART_ID}`);
        expect(lineChart).toHaveLength(1);
        const pieChart = wrapper.find(`#${DASHBOARD_PIE_CHART_ID}`);
        expect(pieChart).toHaveLength(1);
        const editor = wrapper.find(`#${DASHBOARD_ACTION_EDITOR_ID}`);
        expect(editor).toHaveLength(1);
        const totalCount = wrapper.find(`#${DASHBOARD_TOTAL_COUNT_ID}`);
        expect(totalCount).toHaveLength(1);

        const spaceFilter = wrapper.find(`#${DASHBOARD_SPACE_FILTER_ID}`);
        expect(spaceFilter).toHaveLength(1);

        const userFilter = wrapper.find(`#${DASHBOARD_USER_FILTER_ID}`);
        expect(userFilter).toHaveLength(0);
      });
    });

    describe(`userMode = teacher`, () => {
      beforeAll(() => {
        const props = createDashboardProps({
          userId: sampleUserId,
          userMode: USER_MODES.TEACHER,
          ...sampleDatabase,
        });
        // eslint-disable-next-line react/jsx-props-no-spreading
        wrapper = shallow(<Dashboard {...props} />);
      });

      it('displays user and space filters', () => {
        const spaceFilter = wrapper.find(`#${DASHBOARD_SPACE_FILTER_ID}`);
        expect(spaceFilter).toHaveLength(1);

        const formControl = wrapper
          .find(FormControl)
          .find(`#${DASHBOARD_USER_FILTER_ID}`);
        const menuItems = formControl.find(MenuItem).map((item) => item.text());

        expect(menuItems).toContain('All Users');
        // eslint-disable-next-line no-restricted-syntax
        for (const user of sampleUsers) {
          expect(menuItems).toContain(user.username);
        }

        expect(menuItems.length).toBe(sampleUsers.length + 1);
      });
    });
  });
});
