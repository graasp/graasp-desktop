const request = require('request-promise');
const cheerio = require('cheerio');
const providers = require('./config/providers');

const getDownloadUrl = async ({ url, lang }) => {
  let proxied = false;
  providers.forEach(provider => {
    if (url.includes(provider)) {
      proxied = true;
    }
  });
  if (!proxied) {
    return false;
  }
  const res = await request(url);
  const $ = cheerio.load(res);
  const elem = $(`meta[name="download"][language="${lang}"]`);
  if (elem) {
    return elem.attr('value');
  }
  // todo: fall back on another language if requested is not available?
  return false;
};

module.exports = {
  getDownloadUrl,
};
