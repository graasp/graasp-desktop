import React from 'react';
import { shallow } from 'enzyme';
import ReactQuill from 'react-quill';
import { Text } from './Text';
import * as FIXTURES from '../../test/fixtures/text';

const createTextProps = content => ({
  content,
  style: { color: 'red' },
  className: 'textClass',
});

describe('<Text />', () => {
  describe('trivial cases', () => {
    let wrapper;
    let props;

    beforeAll(() => {
      props = createTextProps('content');
      // eslint-disable-next-line react/jsx-props-no-spreading
      wrapper = shallow(<Text {...props} />);
    });

    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('renders one <div /> with correct style', () => {
      const div = wrapper.find('div');
      expect(div).toHaveLength(1);

      expect(div.prop('style')).toEqual(props.style);
    });

    it('renders one <ReactQuill /> component with correct className and simple content', () => {
      const reactQuill = wrapper.find(ReactQuill);
      expect(reactQuill).toHaveLength(1);

      expect(reactQuill.prop('className')).toEqual(props.className);
      expect(reactQuill.prop('value')).toEqual(props.content);
    });
  });

  describe('with math', () => {
    const cases = [
      ['x^2', FIXTURES.input1, FIXTURES.output1],
      ['quadratic', FIXTURES.quadraticInput, FIXTURES.quadraticOutput],
      ['christoffel', FIXTURES.christoffelInput, FIXTURES.christoffelOutput],
    ];

    it.each(cases)(`renders %s correctly with math`, (name, input, output) => {
      const props = createTextProps(input);
      // eslint-disable-next-line react/jsx-props-no-spreading
      const wrapper = shallow(<Text {...props} />);
      const reactQuill = wrapper.find(ReactQuill);
      expect(reactQuill.prop('value')).toEqual(output);
    });
  });
});
