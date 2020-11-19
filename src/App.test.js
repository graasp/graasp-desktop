import React from 'react';
import { shallow } from 'enzyme';
import { App } from './App';
import { DEFAULT_USER_MODE } from './config/constants';

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
    classes: {
      toastrIcon: '',
      fullScreen: '',
    },
    userMode: DEFAULT_USER_MODE,
    connexionStatus: true,
  };

  // eslint-disable-next-line react/jsx-props-no-spreading
  const component = shallow(<App {...props} />);
  it('renders correctly', () => {
    expect(component).toMatchSnapshot();
  });
});
