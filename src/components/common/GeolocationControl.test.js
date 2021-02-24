/**
 * @deprecated
 */

import React from 'react';
import { shallow } from 'enzyme';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { GeolocationControl } from './GeolocationControl';
import Loader from './Loader';
import { CONTROL_TYPES } from '../../config/constants';

const createGeolocationControlProps = (
  geolocationEnabled,
  controlType,
  activity = false
) => ({
  geolocationEnabled,
  activity,
  t: (text) => text,
  dispatchGetGeolocationEnabled: jest.fn(),
  dispatchSetGeolocationEnabled: jest.fn(),
  classes: {
    formControl: '',
    button: '',
  },
  controlType,
});

describe('<GeolocationControl />', () => {
  const geolocationValues = [false, true];

  describe.each(geolocationValues)(
    '<GeolocationControl /> as switch',
    (geolocationEnabled) => {
      let wrapper;

      beforeAll(() => {
        const props = createGeolocationControlProps(
          geolocationEnabled,
          CONTROL_TYPES.SWITCH
        );
        // eslint-disable-next-line react/jsx-props-no-spreading
        wrapper = shallow(<GeolocationControl {...props} />);
      });

      it('renders correctly', () => {
        expect(wrapper).toMatchSnapshot();
      });

      it('renders one <FormControlLabel /> component with text Settings', () => {
        const formControlLabel = wrapper.find(FormControlLabel);
        expect(formControlLabel).toHaveLength(1);
        expect(formControlLabel.prop('label')).toEqual('Geolocation Enabled');
        expect(formControlLabel.prop('control').props.value).toBe(
          geolocationEnabled
        );
      });
    }
  );

  describe.each(geolocationValues)(
    '<GeolocationControl /> as button',
    (geolocationEnabled) => {
      let wrapper;

      beforeAll(() => {
        const props = createGeolocationControlProps(
          geolocationEnabled,
          CONTROL_TYPES.BUTTON
        );
        // eslint-disable-next-line react/jsx-props-no-spreading
        wrapper = shallow(<GeolocationControl {...props} />);
      });

      it('renders correctly', () => {
        expect(wrapper).toMatchSnapshot();
      });

      it('renders one <FormControlLabel /> component with text "Enable Geolocation"', () => {
        const button = wrapper.find(Button);
        expect(button).toHaveLength(1);
        expect(button.contains('Enable Geolocation')).toBeTruthy();
      });
    }
  );

  describe.each([
    [true, CONTROL_TYPES.BUTTON],
    [true, CONTROL_TYPES.SWITCH],
    [false, CONTROL_TYPES.SWITCH],
    [false, CONTROL_TYPES.BUTTON],
  ])(
    '<GeolocationControl /> on activity',
    (geolocationEnabled, controlType) => {
      let wrapper;

      it('renders <Loader />', () => {
        const props = createGeolocationControlProps(
          geolocationEnabled,
          controlType,
          true
        );
        // eslint-disable-next-line react/jsx-props-no-spreading
        wrapper = shallow(<GeolocationControl {...props} />);
        expect(wrapper.find(Loader)).toHaveLength(1);
      });
    }
  );
});
