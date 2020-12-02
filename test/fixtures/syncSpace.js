// the following spaces exist on the Graasp platform with precise changes
// ids must be respected, so duplication of the remote space might not work
// with the following fixtures

import { SYNC_CHANGES } from '../../src/config/constants';

const { ADDED, REMOVED, UPDATED, MOVED } = SYNC_CHANGES;
export const SPACE_WITH_ADDITION = {
  space: { id: '5e9edef4dbea5955c7f5bbea', name: 'Space with addition' },
  path: './spaceWithAddition.zip',
};

export const SPACE_WITH_ADDITION_CHANGES = {
  phases: [
    {
      name: 'addition',
      change: UPDATED,
      items: [{ id: '5e9ee0f7dbea5955c7f5c0d6', change: ADDED }],
    },
    { name: 'moving' },
    {
      name: 'new phase',
      change: ADDED,
      items: [{ id: '5e9ee113dbea5955c7f5c101', change: ADDED }],
    },
    { name: 'moving phase' },
    { name: 'removal' },
  ],
};

export const SPACE_WITH_REMOVAL = {
  space: { id: '5e9efe77f130f510ae709466', name: 'Space with removal' },
  path: './spaceWithRemoval.zip',
};

export const SPACE_WITH_REMOVAL_CHANGES = {
  phases: [
    {
      name: 'addition',
    },
    {
      name: 'moving phase',
      change: REMOVED,
      items: [
        { id: '5e9efeadf130f510ae7094b7', change: REMOVED },
        {
          id: '5e9efeadf130f510ae7094ba',
          change: REMOVED,
        },
        { id: '5e9efeadf130f510ae7094c2', change: REMOVED },
      ],
    },
    {
      name: 'removal',
      change: UPDATED,
      items: [{ id: '5e9efeaef130f510ae7094c6', change: REMOVED }],
    },
    { name: 'moving' },
  ],
};

export const SPACE_WITH_UPDATE = {
  space: { id: '5e9f0ccde272c3572ddf0524', name: 'Space with update' },
  path: './spaceWithUpdate.zip',
};

export const SPACE_WITH_UPDATE_CHANGES = {
  phases: [
    {
      name: 'removal',
    },
    {
      name: 'phase',
      previousName: 'removed phase',
    },
    {
      name: 'addition',
    },
    {
      name: 'moving',
      change: UPDATED,
      items: [{ id: '5e9f0cf6e272c3572ddf05c4', change: UPDATED }],
    },
    { name: 'moving phase' },
  ],
};

export const SPACE_WITH_MOVE = {
  space: { id: '5ea003b2e1540856e519cc3e', name: 'Space with move' },
  path: './spaceWithMove.zip',
};

export const SPACE_WITH_MOVE_CHANGES = {
  phases: [
    {
      name: 'addition',
    },
    {
      name: 'moving phase',
      change: ADDED,
      items: [
        {
          id: '5ea003e2e1540856e519cca4',
          change: ADDED,
        },
        {
          id: '5ea003e2e1540856e519ccb1',
          change: ADDED,
        },
      ],
    },
    {
      name: 'removal',
    },
    {
      name: 'moving',
      change: UPDATED,
      items: [{ id: '5ea003e2e1540856e519cca1', change: MOVED }],
    },
    {
      name: 'moving phase',
      change: REMOVED,
      items: [
        {
          id: '5ea003e2e1540856e519cca4',
          change: REMOVED,
        },
        {
          id: '5ea003e2e1540856e519ccb1',
          change: REMOVED,
        },
      ],
    },
  ],
};

export const SPACE_WITH_TOOLS_UPDATE = {
  space: { id: '5ea00ac4e1540856e519dfe8', name: 'Space with tools updated' },
  path: './spaceWithToolsUpdate.zip',
};

export const SPACE_WITH_TOOLS_UPDATE_CHANGES = {
  items: [
    {
      id: '5ea00b38e1540856e519e067',
      change: REMOVED,
    },
  ],
  phases: [
    {
      name: 'Orientation',
    },
    {
      name: 'Conceptualisation',
    },
    {
      name: 'Discussion',
    },
  ],
};

export const SPACE_WITH_MULTIPLE_CHANGES = {
  path: './spaceWithMultipleChanges.zip',
  space: {
    id: '5ea029f5f851e7716e3722fe',
    name: 'Sync Space with Multiple Changes',
    description: '<p>A description</p>',
    category: 'Space',
    offlineSupport: true,
    image: {
      thumbnailUrl:
        '//graasp.eu/pictures/5ea029f5f851e7716e3722fe/orig_7dedf00a928f7a1b19e1575be54e40c799312178.png',
      thumbnailAsset:
        '5ea029f5f851e7716e3722fe/3959e05d69501458a091fdd1c64e2ad7.png',
    },
    phases: [
      {
        id: '5ea029f9f851e7716e372302',
        name: 'Orientation',
        description: '',
        category: 'Space',
        items: [
          {
            id: '5ea02a30f851e7716e372351',
            name: 'text.graasp',
            description: '',
            mimeType: 'text/html',
            category: 'Resource',
            content: '',
          },
          {
            id: '5ea02a30f851e7716e372354',
            name: 'New Link',
            description: '',
            mimeType: 'image/jpeg',
            category: 'Resource',
            url:
              '//graasp.eu/pictures/5ea02a30f851e7716e372354/large_36358f683efff4c9393e84baa7aa92756845b7dc.jpeg',
            hash: '05eec0a88c66606d70c016d306d81c1d',
            asset:
              '5ea029f5f851e7716e3722fe/05eec0a88c66606d70c016d306d81c1d.jpeg',
          },
        ],
      },
      {
        id: '5ea029faf851e7716e372305',
        name: 'Conceptualisation',
        description: '',
        category: 'Space',
        items: [
          {
            id: '5ea02a3df851e7716e372361',
            name: 'New Link',
            description: '<p>a gravity image</p>',
            mimeType: 'image/jpeg',
            category: 'Resource',
            url:
              '//graasp.eu/pictures/5ea02a3df851e7716e372361/large_bfc82a1ac77fc7b01dc2aafd4b5eafd392e82a29.jpeg',
            hash: '7023ffd8042704ba8f0dec23059400d0',
            asset:
              '5ea029f5f851e7716e3722fe/7023ffd8042704ba8f0dec23059400d0.jpeg',
          },
          {
            id: '5ea02a3df851e7716e372365',
            name: 'wfadv.graasp',
            description: '',
            mimeType: 'text/html',
            category: 'Resource',
            content: '<p>What is the gravity force on Earth?</p>',
          },
          {
            id: '5ea02a3df851e7716e37235f',
            name: 'Text Input',
            description: '',
            category: 'Application',
            appInstance: {
              settings: null,
              createdAt: '2020-04-22T11:27:57.541Z',
              updatedAt: '2020-04-22T11:27:57.541Z',
              id: '5ea02a3d3a9dcf001a167936',
              resources: [],
            },
            url:
              'https://apps.graasp.eu/5acb589d0d5d9464081c2d46/5cde9891226a7d20a8a16697/latest/index.html',
            hash: 'af246f6f27d0d090bdb63cebddce262c',
            asset:
              '5ea029f5f851e7716e3722fe/af246f6f27d0d090bdb63cebddce262c.html',
          },
          {
            id: '5ea02a3df851e7716e372368',
            name: 'grwsfd.graasp',
            description: '',
            mimeType: 'text/html',
            category: 'Resource',
            content: '',
          },
        ],
      },
      {
        id: '5ea029faf851e7716e372308',
        name: 'Investigation',
        description: '',
        category: 'Space',
        items: [
          {
            id: '5ea02a48f851e7716e372377',
            name: 'New Link',
            description: '',
            mimeType: 'image/jpeg',
            category: 'Resource',
            url:
              '//graasp.eu/pictures/5ea02a48f851e7716e372377/large_cbfbd0368e2550fa90f2c3d8fbfac0536e930ff0.jpeg',
            hash: '2e4fc3c9a893aff72b386008d0509659',
            asset:
              '5ea029f5f851e7716e3722fe/2e4fc3c9a893aff72b386008d0509659.jpeg',
          },
        ],
      },
      {
        id: '5ea029fbf851e7716e37230b',
        name: 'Conclusion',
        description: '',
        category: 'Space',
        items: [
          {
            id: '5ea02a6cf851e7716e372389',
            name: '2D Spring with Mass',
            description: '',
            category: 'Application',
            url:
              'https://gateway.golabz.eu/embed/apps/145fb97e-72ee-4501-b12d-205f1f9c3069/app.html',
            hash: 'ae18b0b0e205a3fea64b7a9990f2eaf1',
            asset:
              '5ea029f5f851e7716e3722fe/ae18b0b0e205a3fea64b7a9990f2eaf1.html',
          },
          {
            id: '5ea02a6cf851e7716e37238c',
            name: 'text.graasp',
            description: '',
            mimeType: 'text/html',
            category: 'Resource',
            content: '<p>The final text</p>',
          },
        ],
      },
    ],
    language: 'en',
    saved: true,
  },
};

export const SPACE_WITH_MULTIPLE_CHANGES_CHANGES = {
  image: {
    url: '',
    change: REMOVED,
  },
  description: {
    change: UPDATED,
  },
  phases: [
    {
      id: '5ea029f9f851e7716e372302',
      name: 'Orientation',
      change: UPDATED,
      items: [
        {
          id: '5ea02a30f851e7716e372354',
          change: UPDATED,
        },
      ],
    },
    {
      name: 'Investigation',
      id: '5ea029faf851e7716e372308',
      change: ADDED,
      items: [
        {
          id: '5ea02a48f851e7716e372377',
          change: ADDED,
        },
      ],
    },
    {
      name: 'Conceptualisation',
      id: '5ea029faf851e7716e372305',
      change: UPDATED,
      items: [
        {
          id: '5ea02a3df851e7716e37235f',
          change: MOVED,
        },
      ],
    },
    {
      name: 'Investigation',
      id: '5ea029faf851e7716e372308',
      change: REMOVED,
      items: [
        {
          id: '5ea02a48f851e7716e372377',
          change: REMOVED,
        },
      ],
    },
    {
      name: 'Conclusion',
      id: '5ea029fbf851e7716e37230b',
      change: UPDATED,
      items: [
        {
          id: '5ea02a6cf851e7716e372389',
          change: REMOVED,
        },
      ],
    },
  ],
};
