import React from 'react';
import { shallow } from 'enzyme';
import ReactJson from 'react-json-view';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { DatabaseEditor } from './DatabaseEditor';
import Loader from '../common/Loader';

const sampleDatabase = {
  user: { name: 'name' },
  spaces: [{}],
};

const createDatabaseEditorProps = database => {
  return {
    t: text => text,
    classes: {
      button: '',
    },
    dispatchGetDatabase: jest.fn(),
    dispatchSetDatabase: jest.fn(),
    database,
  };
};

describe('<DatabaseEditor />', () => {
  describe('<DatabaseEditor /> renders', () => {
    let props;
    let wrapper;

    beforeAll(() => {
      props = createDatabaseEditorProps(sampleDatabase);
      // eslint-disable-next-line react/jsx-props-no-spreading
      wrapper = shallow(<DatabaseEditor {...props} />);
    });

    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('renders one <Typography /> component with text "Manually Edit the Database"', () => {
      const typography = wrapper.find(Typography);
      expect(typography).toHaveLength(1);
      expect(typography.contains('Manually Edit the Database')).toBeTruthy();
    });

    it('renders one <Button /> component with text "Use Sample Database"', () => {
      const button = wrapper.find(Button);
      expect(button).toHaveLength(1);
      expect(button.contains('Use Sample Database')).toBeTruthy();
    });

    it('renders one <ReactJson /> component with sample database', () => {
      const reactJson = wrapper.find(ReactJson);
      expect(reactJson).toHaveLength(1);
      expect(reactJson.prop('src')).toEqual(props.database);
    });
  });

  describe.each([undefined, {}])(
    '<DatabaseEditor /> on undefined or empty database',
    database => {
      let wrapper;

      it('renders <Loader />', () => {
        const props = createDatabaseEditorProps(database);
        // eslint-disable-next-line react/jsx-props-no-spreading
        wrapper = shallow(<DatabaseEditor {...props} />);
        expect(wrapper.find(Loader)).toHaveLength(1);
      });
    }
  );
});
