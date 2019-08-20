const _ = require('lodash');
const request = require('request-promise');
const cheerio = require('cheerio');
const download = require('download');
const providers = require('./config/providers');
const logger = require('./logger');
const mapping = require('./config/mapping');
const { DEFAULT_PROTOCOL } = require('./config/config');
const {
  getExtension,
  isDownloadable,
  generateHash,
  isFileAvailable,
} = require('./utilities');

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

const downloadResource = async ({
  resource,
  absoluteSpacePath,
  lang,
  relativeSpacePath,
}) => {
  if (resource && isDownloadable(resource)) {
    let { url } = resource;

    // check mappings for files
    if (mapping[url]) {
      url = mapping[url];
    }

    // download from proxy url if available
    // eslint-disable-next-line no-await-in-loop
    const downloadUrl = await getDownloadUrl({ url, lang });
    if (downloadUrl) {
      url = downloadUrl;
    }

    // default to https
    if (url.startsWith('//')) {
      url = `https:${url}`;
    }

    // get extension to save file
    const ext = getExtension(resource);

    // only download if extension is present
    if (ext) {
      // generate hash to save file
      const hash = generateHash(resource);
      const fileName = `${hash}.${ext}`;
      const relativeFilePath = `${relativeSpacePath}/${fileName}`;
      const absoluteFilePath = `${absoluteSpacePath}/${fileName}`;

      // eslint-disable-next-line no-await-in-loop
      const fileAvailable = await isFileAvailable(absoluteFilePath);

      // if the file is available, point this resource to its path
      if (!fileAvailable) {
        logger.debug(`downloading ${url}`);
        // eslint-disable-next-line no-await-in-loop
        await download(url, absoluteSpacePath, {
          filename: fileName,
        });
        logger.debug(`downloaded ${url} to ${absoluteSpacePath}/${fileName}`);
      }

      // returning this indicates that resource was downloaded successfully
      return {
        asset: relativeFilePath,
        hash,
      };
    }
    return false;
  }
  return false;
};

const downloadSpaceResources = async ({ lang, space, absoluteSpacePath }) => {
  // make a working copy of the space to save
  const spaceToSave = { ...space };

  const { phases, image, id, items: tools } = spaceToSave;
  const relativeSpacePath = id;

  // if there is a background/thumbnail image, save it
  if (image) {
    const { thumbnailUrl, backgroundUrl } = image;
    const assets = [
      { url: thumbnailUrl, key: 'thumbnailAsset' },
      { url: backgroundUrl, key: 'backgroundAsset' },
    ];

    // eslint-disable-next-line no-restricted-syntax
    for (const asset of assets) {
      let { url } = asset;
      const { key } = asset;
      if (url) {
        // default to https
        if (_.isString(url) && url.startsWith('//')) {
          url = `${DEFAULT_PROTOCOL}:${url}`;
        }

        // get extension to save file
        const ext = getExtension({ url });

        // only download if extension is present
        if (ext) {
          // generate hash to save file
          const hash = generateHash({ url });
          const imageFileName = `${hash}.${ext}`;
          const relativeImagePath = `${relativeSpacePath}/${imageFileName}`;
          const absoluteImagePath = `${absoluteSpacePath}/${imageFileName}`;
          // eslint-disable-next-line no-await-in-loop
          const imageAvailable = await isFileAvailable(absoluteImagePath);
          if (!imageAvailable) {
            logger.debug(`downloading ${url}`);
            // eslint-disable-next-line no-await-in-loop
            await download(url, absoluteSpacePath, {
              filename: imageFileName,
            });
            logger.debug(
              `downloaded ${url} to ${absoluteSpacePath}/${imageFileName}`
            );
          }
          spaceToSave.image[key] = relativeImagePath;
        }
      }
    }
  }

  // if there are top level items, also download them
  if (!_.isEmpty(tools)) {
    for (let i = 0; i < tools.length; i += 1) {
      const resource = tools[i];
      // eslint-disable-next-line no-await-in-loop
      const rvalue = await downloadResource({
        resource,
        absoluteSpacePath,
        lang,
        relativeSpacePath,
      });
      if (rvalue) {
        const { hash, asset } = rvalue;
        spaceToSave.items[i].hash = hash;
        spaceToSave.items[i].asset = asset;
      }
    }
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const phase of phases) {
    const { items = [] } = phase;
    for (let i = 0; i < items.length; i += 1) {
      const resource = items[i];
      // eslint-disable-next-line no-await-in-loop
      const rvalue = await downloadResource({
        resource,
        absoluteSpacePath,
        lang,
        relativeSpacePath,
      });
      if (rvalue) {
        const { hash, asset } = rvalue;
        phase.items[i].hash = hash;
        phase.items[i].asset = asset;
      }
    }
  }
  return spaceToSave;
};

module.exports = {
  getDownloadUrl,
  downloadSpaceResources,
};
