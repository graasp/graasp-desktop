const updateActivityList = flag => {
  if (flag) {
    return list => list.push(flag);
  }
  return list => list.pop();
};

// eslint-disable-next-line import/prefer-default-export
export { updateActivityList };
