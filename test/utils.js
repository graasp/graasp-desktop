const mochaAsync = fn => {
  return done => {
    fn.call().then(done, err => {
      done(err);
    });
  };
};

const removeSpace = text => {
  return text.replace(/\s/g, '');
};

const removeTags = html => {
  return html.replace(/<\/?[^>]+(>|$)/g, '');
};

const createRandomString = () => {
  return Math.random()
    .toString(36)
    .substring(7);
};

export { mochaAsync, removeSpace, removeTags, createRandomString };
