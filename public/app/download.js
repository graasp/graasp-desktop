const _ = require('lodash');
const request = require('request-promise');
const { promisify } = require('util');
const cheerio = require('cheerio');
const extract = require('extract-zip');
const download = require('download');
const providers = require('./config/providers');
const logger = require('./logger');
const mapping = require('./config/mapping');

const {
  DEFAULT_PROTOCOL,
  DEFAULT_LANG,
  APPLICATION,
} = require('./config/config');
const {
  getExtension,
  isDownloadable,
  generateHash,
  isFileAvailable,
} = require('./utilities');

const getDownloadUrl = async ({ url, lang }) => {
  let proxied = false;
  providers.forEach((provider) => {
    if (url.includes(provider)) {
      proxied = true;
    }
  });
  if (!proxied) {
    return false;
  }
  const res = await request(url);
  const $ = cheerio.load(res);

  const proxyUrl = $(`meta[name="download"][language="${lang}"]`).attr('value');
  if (proxyUrl) {
    logger.debug(`proxying from ${proxyUrl}`);
    return proxyUrl;
  }
  // fall back on default language if requested is not available
  const defaultProxyUrl = $(
    `meta[name="download"][language="${DEFAULT_LANG}"]`
  ).attr('value');
  if (defaultProxyUrl) {
    logger.debug(`defaulting to proxying from ${defaultProxyUrl}`);
    return defaultProxyUrl;
  }
  return false;
};

const downloadFile = async ({
  ext,
  hash,
  relativeSpacePath,
  absoluteSpacePath,
  url,
}) => {
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
    logger.debug(`downloaded ${url} to ${absoluteFilePath}`);
  }

  // returning this indicates that resource was downloaded successfully
  return relativeFilePath;
};

const downloadApplication = async ({
  ext,
  relativeSpacePath,
  absoluteSpacePath,
  app,
}) => {
  const { name, url, main } = app;
  // generate hash to save file
  const tmpZipName = `application.${ext}`;
  const tmpZipPath = `${absoluteSpacePath}/${tmpZipName}`;
  const absoluteMainFilePath = `${absoluteSpacePath}/${name}/${main}`;

  // eslint-disable-next-line no-await-in-loop
  const fileAvailable = await isFileAvailable(absoluteMainFilePath);

  // if the file is available, point this resource to its path
  if (!fileAvailable) {
    logger.debug(`downloading application ${url}`);
    // eslint-disable-next-line no-await-in-loop
    await download(url, absoluteSpacePath, {
      filename: tmpZipName,
    });
    logger.debug(`downloaded application ${url} to ${tmpZipPath}`);
  }
  // unzip application files
  try {
    await promisify(extract)(tmpZipPath, {
      dir: `${absoluteSpacePath}/${name}`,
    });
  } catch (e) {
    console.log(e);
    return false;
  }

  // returning this indicates that resource was downloaded successfully
  const relativeMainFilePath = `${relativeSpacePath}/${name}/${main}`;
  return relativeMainFilePath;
};

const downloadResource = async ({
  resource,
  absoluteSpacePath,
  lang,
  relativeSpacePath,
}) => {
  if (resource && isDownloadable(resource)) {
    const { url } = resource;
    let resourceObj = { url };
    // check mappings for files
    if (mapping[url]) {
      resourceObj = mapping[url];
    }

    // download from proxy url if available
    // eslint-disable-next-line no-await-in-loop
    const downloadUrl = await getDownloadUrl({ url: resourceObj.url, lang });
    if (downloadUrl) {
      resourceObj.url = downloadUrl;
    }

    // default to https
    if (resourceObj.url.startsWith('//')) {
      resourceObj.url = `https:${resourceObj.url}`;
    }

    // get extension to save file
    const ext = getExtension({
      url: resourceObj.url,
      mimeType: resource.mimeType,
    });

    if (_.isNil(ext)) {
      return false;
    }

    // generate hash to save file
    const hash = generateHash(resource);
    let asset = null;
    if (ext === 'zip' && resource.category === APPLICATION) {
      asset = await downloadApplication({
        ext,
        relativeSpacePath,
        absoluteSpacePath,
        app: resourceObj,
      });
    }
    // only download if extension is present
    else if (ext) {
      asset = await downloadFile({
        ext,
        hash,
        relativeSpacePath,
        absoluteSpacePath,
        url: resourceObj.url,
      });
    }
    return { asset, hash };
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
