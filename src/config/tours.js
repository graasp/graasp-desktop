import {
  PHASE_DRAWER,
  SPACE_PREVIEW_ICON_CLASS,
  SPACE_SCREEN,
  VISIT_SPACE_BUTTON,
  VISIT_SPACE_INPUT,
  SETTINGS_ACTIONS_CLASS,
  LANGUAGE_SELECT_ID,
  STUDENT_MODE_SWITCH_ID,
} from './selectors';

const tours = {
  VISIT_SPACE_TOUR: 'visitSpace',
  SETTINGS_TOUR: 'settings',
};

const VISIT_SPACE_TOUR_STEPS = [
  {
    target: `.${VISIT_SPACE_BUTTON}`,
    title: 'Welcome to Graasp Desktop!',
    content:
      'Your first step would be visiting a space and importing it. Click NEXT to help you with that',
    disableBeacon: true,
  },
  {
    target: `.${VISIT_SPACE_INPUT}`,
    title: 'Here you can place a link for the space to import',
    content:
      'For example, I will import that for you https://graasp.eu/s/owozgj',
    disableBeacon: true,
  },
  {
    target: `.${SPACE_PREVIEW_ICON_CLASS}`,
    title: 'Here you are viewing the space in preview only.',
    content: 'You can only save the space in teacher mode.',
    disableBeacon: true,
  },
  {
    target: `.${SPACE_SCREEN}`,
    title: 'Here you should be able to preview the space before saving it',
    content: '',
    disableBeacon: true,
  },
  {
    target: `.${PHASE_DRAWER}`,
    title: 'Here you can see a list of the phases within your space',
    content: '',
    disableBeacon: true,
  },
];

const SETTINGS_TOUR_STEPS = [
  {
    target: `#${LANGUAGE_SELECT_ID}`,
    content: 'Change Graasp language to one of our supported languages',
    disableBeacon: true,
  },
  {
    target: `#${STUDENT_MODE_SWITCH_ID}`,
    content: 'Here you change your mode between student/teacher/developer',
    disableBeacon: true,
  },
  {
    target: `.${SETTINGS_ACTIONS_CLASS}`,
    content: 'Here you can enable tracking of actions within spaces',
    disableBeacon: true,
  },
];

export { tours, VISIT_SPACE_TOUR_STEPS, SETTINGS_TOUR_STEPS };
