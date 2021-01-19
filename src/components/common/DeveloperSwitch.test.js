import React from 'react';
import { shallow } from 'enzyme';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { DeveloperSwitch } from './DeveloperSwitch';
import Loader from './Loader';

const createDeveloperSwitchProps = (developerMode, activity = false) => ({
  developerMode,
  activity,
  t: (text) => text,
  dispatchGetDeveloperMode: jest.fn(),
  dispatchSetDeveloperMode: jest.fn(),
  classes: {
    formControl: '',
  },
});

const developerModeValues = [false, true];

describe('<DeveloperSwitch />', () => {
  describe.each(developerModeValues)(
    '<DeveloperSwitch /> renders',
    (developerMode) => {
      let wrapper;

      beforeAll(() => {
        const props = createDeveloperSwitchProps(developerMode);
        // eslint-disable-next-line react/jsx-props-no-spreading
        wrapper = shallow(<DeveloperSwitch {...props} />);
      });

      it('renders correctly', () => {
        expect(wrapper).toMatchSnapshot();
      });

      it('renders one <FormControlLabel /> component with text "Developer Mode" and right value', () => {
        const formControlLabel = wrapper.find(FormControlLabel);
        expect(formControlLabel).toHaveLength(1);
        expect(formControlLabel.prop('label')).toEqual('Developer Mode');
        expect(formControlLabel.prop('control').props.value).toBe(
          developerMode
        );
      });
    }
  );

  describe.each(developerModeValues)(
    '<DeveloperSwitch /> on activity',
    (developerMode) => {
      let wrapper;

      it('renders <Loader />', () => {
        const props = createDeveloperSwitchProps(developerMode, true);
        // eslint-disable-next-line react/jsx-props-no-spreading
        wrapper = shallow(<DeveloperSwitch {...props} />);
        expect(wrapper.find(Loader)).toHaveLength(1);
      });
    }
  );
});
