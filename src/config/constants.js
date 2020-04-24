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

export const SYNC_ADDED = 'added';
export const SYNC_REMOVED = 'removed';
export const SYNC_MOVED = 'moved';
export const SYNC_BEFORE_MOVED = 'beforeMoved';
export const SYNC_UPDATED = 'updated';

const DIFF_COLORS = {
  [SYNC_ADDED]: '#ddffde',
  [SYNC_REMOVED]: '#fddedb',
  [SYNC_UPDATED]: '#f9edc5',
  [SYNC_MOVED]: 'lightgrey',
};

export const DIFF_STYLES = {
  [SYNC_UPDATED]: {
    background: DIFF_COLORS[SYNC_UPDATED],
  },
  [SYNC_REMOVED]: {
    background: DIFF_COLORS[SYNC_REMOVED],
  },
  [SYNC_ADDED]: {
    background: DIFF_COLORS[SYNC_ADDED],
  },
  [SYNC_MOVED]: {
    background: DIFF_COLORS[SYNC_MOVED],
  },
  [SYNC_BEFORE_MOVED]: {
    background: DIFF_COLORS[SYNC_MOVED],
    opacity: 0.5,
  },
};

export const DEFAULT_SYNC_ADVANCED_MODE = false;
export const SYNC_SPACE_PROPERTIES = [
  'name',
  'image',
  'description',
  'phases',
  'items',
];
export const SYNC_ITEM_PROPERTIES = ['name', 'description', 'content'];
