import { SPACE_ATOMIC_STRUCTURE_PATH, SPACE_ATOMIC_STRUCTURE } from './spaces';
import { SPACE_APOLLO_11_PATH, SPACE_APOLLO_11 } from './spaces/apollo11';
import { buildSpaceCardId } from '../../src/config/selectors';

// eslint-disable-next-line import/prefer-default-export
export const searchSpacesFixtures = [
  [
    [SPACE_ATOMIC_STRUCTURE_PATH, SPACE_APOLLO_11_PATH],
    '',
    [SPACE_ATOMIC_STRUCTURE.space.id, SPACE_APOLLO_11.space.id].map((id) =>
      buildSpaceCardId(id)
    ),
  ],
  [
    [SPACE_ATOMIC_STRUCTURE_PATH, SPACE_APOLLO_11_PATH],
    'a',
    [SPACE_ATOMIC_STRUCTURE.space.id, SPACE_APOLLO_11.space.id].map((id) =>
      buildSpaceCardId(id)
    ),
  ],
  [
    [SPACE_ATOMIC_STRUCTURE_PATH, SPACE_APOLLO_11_PATH],
    'atomic',
    [SPACE_ATOMIC_STRUCTURE.space.id].map((id) => buildSpaceCardId(id)),
  ],
  [
    [SPACE_ATOMIC_STRUCTURE_PATH, SPACE_APOLLO_11_PATH],
    'apollo',
    [SPACE_APOLLO_11.space.id].map((id) => buildSpaceCardId(id)),
  ],
  [[SPACE_ATOMIC_STRUCTURE_PATH, SPACE_APOLLO_11_PATH], 'unknown', []],
];
