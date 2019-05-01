const mime = require('mime-types');
const md5 = require('md5');
const {
  DOWNLOADABLE_MIME_TYPES,
  APPLICATION,
  RESOURCE,
} = require('./config/config');

const getExtension = ({ url, mimeType }) => {
  // default to mime type
  if (mimeType) {
    return mime.extension(mimeType);
  }
  return url.match(/[^\\]*\.(\w+)$/)[1];
};

const isDownloadable = resource => {
  const { category, mimeType, url } = resource;
  // can only download resources with url from where to download them
  if (!url) {
    return false;
  }
  switch (category) {
    case RESOURCE:
      return DOWNLOADABLE_MIME_TYPES.includes(mimeType);
    case APPLICATION:
      // todo: add offline application flag
      return true;
    default:
      return false;
  }
};

const generateHash = resource => {
  const { hash, url } = resource;
  if (hash) {
    return hash;
  }
  // todo: hash should always come from backend
  // assume that if hash of url is the same, it's the same file
  // however, this will prevent the resource from being updated
  return md5(url);
};

module.exports = { getExtension, isDownloadable, generateHash };
