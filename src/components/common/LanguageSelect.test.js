import React from 'react';
import { shallow } from 'enzyme';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { LanguageSelect } from './LanguageSelect';
import { langs } from '../../config/i18n';
import Loader from './Loader';

const createLanguageSelectProps = (lang, activity = false) => {
  return {
    activity,
    i18n: {
      changeLanguage: jest.fn(),
    },
    lang,
    t: text => text,
    dispatchSetLanguage: jest.fn(),
    dispatchGetLanguage: jest.fn(),
    classes: {
      formControl: '',
    },
  };
};

describe('<LanguageSelect />', () => {
  const langValues = ['en', 'fr', 'de'];

  describe.each(langValues)('<LanguageSelect /> renders', lang => {
    let wrapper;

    beforeAll(() => {
      const props = createLanguageSelectProps(lang);
      // eslint-disable-next-line react/jsx-props-no-spreading
      wrapper = shallow(<LanguageSelect {...props} />);
    });

    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('renders one <InputLabel /> component with text "Language"', () => {
      const inputLabel = wrapper.find(InputLabel);
      expect(inputLabel).toHaveLength(1);
      expect(inputLabel.contains('Language')).toBeTruthy();
    });

    it('renders one <Select /> component with correct language value', () => {
      const select = wrapper.find(Select);
      expect(select).toHaveLength(1);

      // check select displays all langs
      Object.keys(langs).forEach(langKey => {
        const menuItem = select.find(MenuItem).find({ value: langKey });
        expect(menuItem).toHaveLength(1);
        expect(menuItem.contains(langs[langKey])).toBeTruthy();
      });

      expect(select.prop('value')).toEqual(lang);
    });
  });

  describe.each(langValues)('<LanguageSelect /> on activity', lang => {
    it('renders <Loader />', () => {
      const props = createLanguageSelectProps(lang, true);
      // eslint-disable-next-line react/jsx-props-no-spreading
      const wrapper = shallow(<LanguageSelect {...props} />);
      expect(wrapper.find(Loader)).toHaveLength(1);
    });
  });
});
