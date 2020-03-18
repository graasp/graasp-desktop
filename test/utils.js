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

module.exports = { mochaAsync, removeSpace, removeTags };
