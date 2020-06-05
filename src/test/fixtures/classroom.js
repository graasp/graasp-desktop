// eslint-disable-next-line import/prefer-default-export
export const isClassroomNameValidFixtures = [
  [undefined, false],
  [null, false],
  [false, false],
  [true, false],
  [1, false],
  ['', false],
  [' ', false],
  ['  ', false],
  ['a', true],
  ['a b', true],
  ['name', true],
  [' name ', true],
  ['my classroom name', true],
];
