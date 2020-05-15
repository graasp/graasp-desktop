import {
  SHOW_LOAD_SPACE_PROMPT_CHANNEL,
  RESPOND_LOAD_SPACE_PROMPT_CHANNEL,
} from '../config/channels';

// eslint-disable-next-line import/prefer-default-export
export const showBrowsePrompt = handleFileLocation => {
  const options = {
    filters: [{ name: 'zip', extensions: ['zip'] }],
  };
  window.ipcRenderer.send(SHOW_LOAD_SPACE_PROMPT_CHANNEL, options);
  window.ipcRenderer.once(
    RESPOND_LOAD_SPACE_PROMPT_CHANNEL,
    (event, filePaths) => {
      if (filePaths && filePaths.length) {
        // currently we select only one file
        handleFileLocation(filePaths[0]);
      }
    }
  );
};
