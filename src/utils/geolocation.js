const getCurrentPosition = () =>
  new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      position => resolve(position),
      err => reject(err),
      { timeout: 10000 }
    );
  });

export {
  // eslint-disable-next-line import/prefer-default-export
  getCurrentPosition,
};
