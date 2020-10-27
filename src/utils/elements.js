const waitForElement = async ({ selector, time = 500, maxWait = 10000 }) => {
  let waited = 0;
  while (!document.querySelector(selector) && waited !== maxWait) {
    // eslint-disable-next-line no-await-in-loop
    await new Promise((r) => setTimeout(r, time));
    waited += time;
  }
  return waited !== maxWait;
};

export {
  // eslint-disable-next-line import/prefer-default-export
  waitForElement,
};
