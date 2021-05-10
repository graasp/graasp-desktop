// eslint-disable-next-line import/no-extraneous-dependencies
window.ipcRenderer = require('electron').ipcRenderer;

// mock fetch to provide local space definitions
if (process.env.CI || process.env.NODE_ENV === 'test') {
  const spaces = JSON.parse(process.env?.API_DATABASE) || [];

  // mock GET spaces calls
  window.fetch = async (url) => {
    // detects an object id (of a space) in the url
    const objectIdRegex = new RegExp(/[a-f\d]{24}/i);
    const id = url.match(objectIdRegex)?.[0];
    const content = spaces.find(({ id: sId }) => sId === id);
    const myBlob = new Blob([JSON.stringify(content)], {
      type: 'application/json',
    });
    return new Response(myBlob);
  };
}
