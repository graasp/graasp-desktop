import { SPACE_ATOMIC_STRUCTURE, SPACE_APOLLO_11 } from './spaces';
import { buildSpaceCardId } from '../../src/config/selectors';

// eslint-disable-next-line import/prefer-default-export
export const searchSpacesFixtures = [
  [
    '',
    [SPACE_ATOMIC_STRUCTURE.space.id, SPACE_APOLLO_11.space.id].map((id) =>
      buildSpaceCardId(id)
    ),
  ],
  [
    'a',
    [SPACE_ATOMIC_STRUCTURE.space.id, SPACE_APOLLO_11.space.id].map((id) =>
      buildSpaceCardId(id)
    ),
  ],
  [
    'atomic',
    [SPACE_ATOMIC_STRUCTURE.space.id].map((id) => buildSpaceCardId(id)),
  ],
  ['apollo', [SPACE_APOLLO_11.space.id].map((id) => buildSpaceCardId(id))],
  ['unknown', []],
];
