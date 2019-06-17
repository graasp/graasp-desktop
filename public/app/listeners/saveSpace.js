const isOnline = require('is-online');
const download = require('download');
const { VAR_FOLDER, DEFAULT_LANG } = require('../config/config');
const { getDownloadUrl } = require('../download');
const { SAVE_SPACE_CHANNEL } = require('../config/channels');
const {
  ERROR_SPACE_ALREADY_AVAILABLE,
  ERROR_DOWNLOADING_FILE,
} = require('../config/errors');
const logger = require('../logger');
const mapping = require('../config/mapping');
const {
  isFileAvailable,
  getExtension,
  isDownloadable,
  generateHash,
  createSpaceDirectory,
} = require('../utilities');
const { SPACES_COLLECTION } = require('../db');

const saveSpace = (mainWindow, db) => async (event, { space }) => {
  logger.debug('saving space');
  // make a working copy of the space to save
  const spaceToSave = { ...space };
  try {
    // get handle to spaces collection
    const spaces = db.get(SPACES_COLLECTION);
    const { id, language } = space;
    const existingSpace = spaces.find({ id }).value();

    if (existingSpace) {
      return mainWindow.webContents.send(
        SAVE_SPACE_CHANNEL,
        ERROR_SPACE_ALREADY_AVAILABLE
      );
    }

    // only download if connection is available
    const isConnected = await isOnline();
    if (!isConnected) {
      return mainWindow.webContents.send(
        SAVE_SPACE_CHANNEL,
        ERROR_DOWNLOADING_FILE
      );
    }

    // create directory where resources will be stored
    createSpaceDirectory({ id });

    const { phases, image } = spaceToSave;

    const spacePath = id;

    // use language defined in space otherwise fall back on
    // user language, otherwise fall back on the global default
    const userLang = db.get('user.lang').value();
    const lang = language || userLang || DEFAULT_LANG;

    // todo: follow new format
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
          if (url.startsWith('//')) {
            url = `https:${url}`;
          }
          const ext = getExtension({ url });
          const hash = generateHash({ url });
          const imageFileName = `${hash}.${ext}`;
          const imagePath = `${spacePath}/${imageFileName}`;
          const absoluteSpacePath = `${VAR_FOLDER}/${spacePath}`;
          const absoluteImagePath = `${VAR_FOLDER}/${imagePath}`;
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
          spaceToSave.image[key] = imagePath;
        }
      }
    }
    // eslint-disable-next-line no-restricted-syntax
    for (const phase of phases) {
      const { items = [] } = phase;
      for (let i = 0; i < items.length; i += 1) {
        const resource = items[i];
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

          // generate hash and get extension to save file
          const hash = generateHash(resource);
          const ext = getExtension(resource);
          const fileName = `${hash}.${ext}`;
          const filePath = `${spacePath}/${fileName}`;
          const absoluteSpacePath = `${VAR_FOLDER}/${spacePath}`;
          const absoluteFilePath = `${VAR_FOLDER}/${filePath}`;
          phase.items[i].hash = hash;

          // eslint-disable-next-line no-await-in-loop
          const fileAvailable = await isFileAvailable(absoluteFilePath);

          // if the file is available, point this resource to its path
          if (!fileAvailable) {
            logger.debug(`downloading ${url}`);
            // eslint-disable-next-line no-await-in-loop
            await download(url, absoluteSpacePath, {
              filename: fileName,
            });
            logger.debug(
              `downloaded ${url} to ${absoluteSpacePath}/${fileName}`
            );
          }
          phase.items[i].asset = filePath;
        }
      }
    }
    // mark space as saved
    spaceToSave.saved = true;
    spaces.push(spaceToSave).write();
    return mainWindow.webContents.send(SAVE_SPACE_CHANNEL, spaceToSave);
  } catch (err) {
    logger.error(err);
    return mainWindow.webContents.send(SAVE_SPACE_CHANNEL, null);
  }
};

module.exports = saveSpace;
