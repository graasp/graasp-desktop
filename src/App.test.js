import React from 'react';
import { shallow } from 'enzyme';
import { App } from './App';

describe('<App />', () => {
  const props = {
    i18n: {
      defaultNS: '',
      changeLanguage: jest.fn(),
    },
    t: jest.fn(),
    dispatchGetContext: jest.fn(),
    dispatchGetAppInstance: jest.fn(),
    dispatchGetAppInstanceResources: jest.fn(),
  };
  const component = shallow(<App {...props} />);
  it('renders correctly', () => {
    expect(component).toMatchSnapshot();
  });
});
