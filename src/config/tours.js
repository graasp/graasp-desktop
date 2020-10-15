import {
  PHASE_DRAWER_CLASS,
  SPACE_PREVIEW_ICON_CLASS,
  VISIT_SPACE_BUTTON_CLASS,
  VISIT_SPACE_INPUT_CLASS,
  SETTINGS_ACTIONS_CLASS,
  LANGUAGE_SELECT_ID,
  STUDENT_MODE_SWITCH_ID,
} from './selectors';
import { TOUR_SPACE } from './constants';

const tours = {
  VISIT_SPACE_TOUR: 'visitSpace',
  SETTINGS_TOUR: 'settings',
};

const VISIT_SPACE_TOUR_STEPS = [
  {
    target: `.${VISIT_SPACE_BUTTON_CLASS}`,
    title: 'Welcome to Graasp Desktop!',
    content: "Let's get started by visiting a space and saving it locally.",
    disableBeacon: true,
  },
  {
    target: `.${VISIT_SPACE_INPUT_CLASS}`,
    title: 'Visiting a Space',
    content: `You can visit a space using its URL or ID. For example, let's have a look at space https://graasp.eu/s/${TOUR_SPACE} or simply ${TOUR_SPACE}.`,
    disableBeacon: true,
  },
  {
    target: `.${SPACE_PREVIEW_ICON_CLASS}`,
    title: 'Preview Mode',
    content:
      'When you visit a space, you can preview its contents to see what it looks like. Only teachers can save spaces locally.',
    disableBeacon: true,
  },
  {
    target: `.${PHASE_DRAWER_CLASS}`,
    title: 'Phases',
    content: 'You can navigate within the space by using the menu on the left.',
    disableBeacon: true,
  },
];

const SETTINGS_TOUR_STEPS = [
  {
    target: `#${LANGUAGE_SELECT_ID}`,
    title: 'Language',
    content:
      'You can change the language to any of the ones supported by Graasp Desktop.',
    disableBeacon: true,
  },
  {
    target: `#${STUDENT_MODE_SWITCH_ID}`,
    title: 'Mode',
    content:
      'You can use this switch to toggle between teacher and student modes. You can also activate developer mode for advanced functionality.',
    disableBeacon: true,
  },
  {
    target: `.${SETTINGS_ACTIONS_CLASS}`,
    title: 'Analytics',
    content: 'Track analytics by activating this switch.',
    disableBeacon: true,
  },
];

export { tours, VISIT_SPACE_TOUR_STEPS, SETTINGS_TOUR_STEPS };
