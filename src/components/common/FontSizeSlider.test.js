import React from 'react';
import { shallow } from 'enzyme';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import Input from '@material-ui/core/Input';
import { FontSizeSlider } from './FontSizeSlider';
import { DEFAULT_FONT_SIZE, FONT_SIZE_MIN_VALUE } from '../../config/constants';

const createFontSizeSliderProps = ({ fontSize } = {}) => ({
  dispatchSetFontSize: jest.fn(),
  fontSize,
});

describe('<FontSizeSlider />', () => {
  let wrapper;

  describe('default render', () => {
    beforeAll(() => {
      const props = createFontSizeSliderProps();
      // eslint-disable-next-line react/jsx-props-no-spreading
      wrapper = shallow(<FontSizeSlider {...props} />);
    });

    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('renders one <Slider /> and one <Input /> component with default font size', () => {
      const text = wrapper.find(Typography);
      expect(text).toHaveLength(1);
      expect(text.contains('Font Size')).toBeTruthy();

      const slider = wrapper.find(Slider);
      expect(slider.prop('value')).toBe(DEFAULT_FONT_SIZE);

      const input = wrapper.find(Input);
      expect(input.prop('value')).toBe(DEFAULT_FONT_SIZE);
    });
  });

  describe('correct font size render', () => {
    beforeAll(() => {
      const props = createFontSizeSliderProps({
        fontSize: FONT_SIZE_MIN_VALUE,
      });
      // eslint-disable-next-line react/jsx-props-no-spreading
      wrapper = shallow(<FontSizeSlider {...props} />);
    });

    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('renders one <Slider /> and one <Input /> component with given font size', () => {
      const text = wrapper.find(Typography);
      expect(text).toHaveLength(1);
      expect(text.contains('Font Size')).toBeTruthy();

      const slider = wrapper.find(Slider);
      expect(slider.prop('value')).toBe(FONT_SIZE_MIN_VALUE);

      const input = wrapper.find(Input);
      expect(input.prop('value')).toBe(FONT_SIZE_MIN_VALUE);
    });
  });
});
