import React from 'react';
import { shallow } from 'enzyme';
import { App } from './App';

window.ipcRenderer = { once: jest.fn(), send: jest.fn() };

describe('<App />', () => {
  const props = {
    i18n: {
      defaultNS: '',
      changeLanguage: jest.fn(),
    },
    t: jest.fn(),
    dispatchGetGeolocation: jest.fn(),
    dispatchGetUserFolder: jest.fn(),
    dispatchGetLanguage: jest.fn(),
    dispatchGetDeveloperMode: jest.fn(),
    dispatchGetGeolocationEnabled: jest.fn(),
    dispatchIsAuthenticated: jest.fn(),
    geolocationEnabled: false,
    classes: {},
  };

  // eslint-disable-next-line react/jsx-props-no-spreading
  const component = shallow(<App {...props} />);
  it('renders correctly', () => {
    expect(component).toMatchSnapshot();
  });
});
