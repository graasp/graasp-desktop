const waitForElement = async ({ selector, time = 500 }) => {
  while (!document.querySelector(selector)) {
    // eslint-disable-next-line no-await-in-loop
    await new Promise(r => setTimeout(r, time));
  }
};

export {
  // eslint-disable-next-line import/prefer-default-export
  waitForElement,
};
