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
export const DEFAULT_STUDENT_MODE = false;
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

// math
export const BLOCK_MATH_DIV = 'p';
export const INLINE_MATH_DIV = 'span';
export const BLOCK_MATH_INDICATOR = '\\[';
export const INLINE_MATH_INDICATOR = '\\(';
export const BLOCK_MATH_REGEX = /(\\\[(.*?)\\])/g;
export const INLINE_MATH_REGEX = /(\\\((.*?)\\\))/g;
export const RADIX = 10;

export const FILTER_ALL_SPACE_ID = 'defaultid';
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
