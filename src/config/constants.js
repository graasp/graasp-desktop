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
