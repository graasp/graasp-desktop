const updateActivityList = flag => {
  if (flag) {
    return list => list.push(flag);
  }
  return list => list.pop();
};

export {
  // eslint-disable-next-line import/prefer-default-export
  updateActivityList,
};
