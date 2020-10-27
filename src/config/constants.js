// phase item types
export const TEXT = 'text/html';
export const VIDEO = new RegExp('video/*');
export const IMAGE = new RegExp('image/*');
export const RESOURCE = 'Resource';
export const APPLICATION = 'Application';
export const IFRAME = 'application/octet-stream';
export const DEFAULT_RADIUS = 50;
export const DEFAULT_LANGUAGE = 'en';
export const DEFAULT_DEVELOPER_MODE = false;
export const DEFAULT_GEOLOCATION_ENABLED = false;
export const USER_MODES = {
  STUDENT: 'student',
  TEACHER: 'teacher',
};
export const DEFAULT_USER_MODE = USER_MODES.STUDENT;
export const THEME_COLORS = {
  [DEFAULT_USER_MODE]: '#5050d2',
  [USER_MODES.STUDENT]: '#5050d2',
  [USER_MODES.TEACHER]: '#3A31AF',
};
export const ACCENT_COLORS = [
  '#5050d2',
  '#6edbd3',
  '#e36bd6',
  '#fcfbf8',
  '#efb642',
];
export const SHORT_ID_LENGTH = 6;
export const LONG_ID_LENGTH = 24;
export const SMART_GATEWAY_HOST = 'gateway.golabz.eu';
export const SMART_GATEWAY_QUERY_STRING_DIVIDER = '#';
export const CONTROL_TYPES = {
  BUTTON: 'BUTTON',
  SWITCH: 'SWITCH',
};
export const MIN_CARD_WIDTH = 345;
export const DEFAULT_PROTOCOL = 'https';

export const DEFAULT_ACTION_ACCESSIBILITY = false;
export const DEFAULT_ACTIONS_AS_ENABLED = true;

// math
export const BLOCK_MATH_DIV = 'p';
export const INLINE_MATH_DIV = 'span';
export const BLOCK_MATH_INDICATOR = '\\[';
export const INLINE_MATH_INDICATOR = '\\(';
export const BLOCK_MATH_REGEX = /(\\\[(.*?)\\])/g;
export const INLINE_MATH_REGEX = /(\\\((.*?)\\\))/g;
export const RADIX = 10;

export const SELECT_ALL_SPACES_ID = 'allSpacesSelectId';
export const SELECT_ALL_USERS_ID = 'allUsersSelectId';
export const DEFAULT_AUTHENTICATION = false;
export const AUTHENTICATED = 'authenticated';

export const SYNC_CHANGES = {
  ADDED: 'added',
  REMOVED: 'removed',
  MOVED: 'moved',
  UPDATED: 'updated',
};

const DIFF_COLORS = {
  [SYNC_CHANGES.ADDED]: '#ddffde',
  [SYNC_CHANGES.REMOVED]: '#fddedb',
  [SYNC_CHANGES.UPDATED]: '#f9edc5',
  [SYNC_CHANGES.MOVED]: 'lightgrey',
};

export const DIFF_STYLES = {
  [SYNC_CHANGES.UPDATED]: {
    background: DIFF_COLORS[SYNC_CHANGES.UPDATED],
  },
  [SYNC_CHANGES.REMOVED]: {
    background: DIFF_COLORS[SYNC_CHANGES.REMOVED],
  },
  [SYNC_CHANGES.ADDED]: {
    background: DIFF_COLORS[SYNC_CHANGES.ADDED],
  },
  [SYNC_CHANGES.MOVED]: {
    background: DIFF_COLORS[SYNC_CHANGES.MOVED],
  },
};

export const SYNC_MODES = {
  ADVANCED: 'advanced',
  VISUAL: 'visual',
};
export const DEFAULT_SYNC_MODE = SYNC_MODES.VISUAL;
export const SYNC_SPACE_PROPERTIES = [
  'name',
  'image',
  'description',
  'phases',
  'items',
];
export const SYNC_PHASE_PROPERTIES = ['name', 'image', 'description', 'items'];

// item property to keep when comparing them, id is kept during process
export const SYNC_ITEM_PROPERTIES = ['name', 'description', 'content'];

export const SECURITY_LOOP_THRESHOLD = 50;

export const FORM_CONTROL_MIN_WIDTH = 120;

// this value exists in app/public/config/config.js as well
export const MAX_RECENT_SPACES = 5;

export const TABLE_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
};

export const TABLE_HEAD_CELL_IDS = {
  USERNAME: 'username',
  OPERATIONS: 'operations',
};

export const ROWS_PER_PAGE_OPTIONS = [5, 10, 25];
export const TABLE_ROW_HEIGHT = 43;

export const DRAWER_HEADER_HEIGHT = 55;

export const ACTION_VERBS = {
  LOGIN: 'login',
  LOGOUT: 'logout',
};

// tour
export const TOUR_DELAY_750 = 750;
export const TOUR_DELAY_500 = 500;
export const TOUR_Z_INDEX = 10000;
export const TOUR_SPACE = 'owozgj';
export const EXAMPLE_VISIT_SPACE_LINK = `/space/${TOUR_SPACE}`;
