// the following spaces exist on the Graasp platform with precise changes
// ids must be respected, so duplication of the remote space might not work
// with the following fixtures

import { SYNC_CHANGES } from '../../src/config/constants';

const { ADDED, REMOVED, UPDATED, MOVED } = SYNC_CHANGES;
export const SPACE_WITH_ADDITION = {
  space: { id: '5e9edef4dbea5955c7f5bbea', name: 'Space with addition' },
  path: './spaceWithAddition.zip',
};

export const SPACE_WITH_ADDITION_ORIGINAL = {
  id: '5e9edef4dbea5955c7f5bbea',
  name: 'Sync Space with addition',
  description: '<p>I have a space description.</p>',
  category: 'Space',
  offlineSupport: true,
  image: {
    thumbnailUrl:
      '//graasp.eu/pictures/5e9edef4dbea5955c7f5bbea/orig_61002471b71ec0dad89928699baef3a8144741b0.png',
  },
  phases: [
    {
      id: '5e9edf4edbea5955c7f5be03',
      name: 'addition',
      description: '<p>History of gravitational theory</p>',
      category: 'Space',
      items: [
        {
          id: '5e9edf4fdbea5955c7f5be2b',
          name: 'addition.description.html',
          description: '',
          mimeType: 'text/html',
          category: 'Resource',
          url: '//graasp.eu/resources/5e9edf4fdbea5955c7f5be2b/raw',
          hash: 'e4f668eb9c0580a543dbb4dced8804ef',
        },
        {
          id: '5e9edf4fdbea5955c7f5be2e',
          name: 'New Link.url.description.html',
          description: '',
          mimeType: 'text/html',
          category: 'Resource',
          url: '//graasp.eu/resources/5e9edf4fdbea5955c7f5be2e/raw',
          hash: 'a641aecb379239f8239bc67089ae727d',
        },
        {
          id: '5e9ee0f7dbea5955c7f5c0d6',
          name: 'New Link (1)',
          description: '',
          mimeType: 'image/jpeg',
          category: 'Resource',
          url:
            '//graasp.eu/pictures/5e9ee0f7dbea5955c7f5c0d6/large_d3cf4b964d46ae419d82ed325bc00aef42b451b2.jpeg',
          hash: 'b7a10ad3665d51c94c32dadde7597263',
        },
        {
          id: '5e9edf4fdbea5955c7f5be34',
          name: 'text.graasp',
          description: '',
          mimeType: 'text/html',
          category: 'Resource',
          content: '',
        },
        {
          id: '5e9edf4fdbea5955c7f5be37',
          name: 'New Link',
          description: '',
          mimeType: 'image/jpeg',
          category: 'Resource',
          url:
            '//graasp.eu/pictures/5e9edf4fdbea5955c7f5be37/large_36358f683efff4c9393e84baa7aa92756845b7dc.jpeg',
          hash: '404f177f127f24af4754381f01d31849',
        },
      ],
    },
    {
      id: '5e9edf4edbea5955c7f5be06',
      name: 'moving',
      description: '',
      category: 'Space',
      items: [
        {
          id: '5e9edf4fdbea5955c7f5be3a',
          name: 'grwsfd.graasp',
          description: '',
          mimeType: 'text/html',
          category: 'Resource',
          content: '',
        },
        {
          id: '5e9edf4fdbea5955c7f5be3c',
          name: 'moving.description.html',
          description: '',
          mimeType: 'text/html',
          category: 'Resource',
          url: '//graasp.eu/resources/5e9edf4fdbea5955c7f5be3c/raw',
          hash: '13da4261ef34eace1f1c9f87df64a178',
        },
        {
          id: '5e9edf4fdbea5955c7f5be43',
          name: 'Text Input',
          description: '',
          category: 'Application',
          appInstance: {
            settings: null,
            createdAt: '2020-04-21T11:55:59.817Z',
            updatedAt: '2020-04-21T11:55:59.817Z',
            id: '5e9edf4fad9b4d001a0f9ebf',
            resources: [],
          },
          url:
            'https://apps.graasp.eu/5acb589d0d5d9464081c2d46/5cde9891226a7d20a8a16697/latest/index.html',
          hash: 'af246f6f27d0d090bdb63cebddce262c',
        },
        {
          id: '5e9edf4fdbea5955c7f5be48',
          name: 'New Link',
          description: '',
          mimeType: 'image/jpeg',
          category: 'Resource',
          url:
            '//graasp.eu/pictures/5e9edf4fdbea5955c7f5be48/large_bfc82a1ac77fc7b01dc2aafd4b5eafd392e82a29.jpeg',
          hash: 'a596578848840e03bcb5f00a6fc91d95',
        },
        {
          id: '5e9edf4fdbea5955c7f5be46',
          name: 'wfadv.graasp',
          description: '',
          mimeType: 'text/html',
          category: 'Resource',
          content: '',
        },
      ],
    },
    {
      id: '5e9ee10adbea5955c7f5c0f3',
      name: 'new phase',
      description: '',
      category: 'Space',
      items: [
        {
          id: '5e9ee113dbea5955c7f5c101',
          name: 'ewfds.graasp',
          description: '',
          mimeType: 'text/html',
          category: 'Resource',
          content: '<p>a new content</p>',
        },
      ],
    },
    {
      id: '5e9edf4ddbea5955c7f5bdf7',
      name: 'moving phase',
      description: '',
      category: 'Space',
      items: [
        {
          id: '5e9edf4edbea5955c7f5be09',
          name: 'moving phase.description.html',
          description: '',
          mimeType: 'text/html',
          category: 'Resource',
          url: '//graasp.eu/resources/5e9edf4edbea5955c7f5be09/raw',
          hash: 'af1bcd4ea05a747640f35d84a0a71040',
        },
        {
          id: '5e9edf4edbea5955c7f5be0e',
          name: 'New Link.url.description.html',
          description: '',
          mimeType: 'text/html',
          category: 'Resource',
          url: '//graasp.eu/resources/5e9edf4edbea5955c7f5be0e/raw',
          hash: 'f6ccd3771e135256daebaf4e77b769da',
        },
        {
          id: '5e9edf4edbea5955c7f5be10',
          name: 'New Link',
          description: '',
          mimeType: 'image/jpeg',
          category: 'Resource',
          url:
            '//graasp.eu/pictures/5e9edf4edbea5955c7f5be10/large_cbfbd0368e2550fa90f2c3d8fbfac0536e930ff0.jpeg',
          hash: '62d6f5c0334f236fcf7fa184d6c374f1',
        },
      ],
    },
    {
      id: '5e9edf4ddbea5955c7f5bdfa',
      name: 'removal',
      description: '',
      category: 'Space',
      items: [
        {
          id: '5e9edf4edbea5955c7f5be15',
          name: '2D Spring with Mass',
          description: '',
          category: 'Application',
          url:
            'https://gateway.golabz.eu/embed/apps/145fb97e-72ee-4501-b12d-205f1f9c3069/app.html',
          hash: 'ae18b0b0e205a3fea64b7a9990f2eaf1',
        },
        {
          id: '5e9edf4edbea5955c7f5be18',
          name: 'removal.description.html',
          description: '',
          mimeType: 'text/html',
          category: 'Resource',
          url: '//graasp.eu/resources/5e9edf4edbea5955c7f5be18/raw',
          hash: '854c4f9b677af9d1bf5a1e3dc34567e0',
        },
        {
          id: '5e9edf4edbea5955c7f5be1d',
          name: 'text.graasp',
          description: '',
          mimeType: 'text/html',
          category: 'Resource',
          content: '',
        },
      ],
    },
    {
      id: '5e9edf4ddbea5955c7f5be00',
      name: 'removed phase',
      description: '<p>removed phase description</p>',
      category: 'Space',
      items: [
        {
          id: '5e9edf4edbea5955c7f5be25',
          name: 'New Link',
          description: '',
          mimeType: 'image/jpeg',
          category: 'Resource',
          url:
            '//graasp.eu/pictures/5e9edf4edbea5955c7f5be25/large_950c04c60cdfe179a4ac386f1db0e93d09e9a304.jpeg',
          hash: 'c46008686f91a438e58037588f64da35',
        },
        {
          id: '5e9edf4fdbea5955c7f5be28',
          name: 'wefd.graasp',
          description: '',
          mimeType: 'text/html',
          category: 'Resource',
          content: '',
        },
      ],
    },
  ],
  language: 'en',
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

export const SPACE_WITH_REMOVAL_ORIGINAL = {
  id: '5e9efe77f130f510ae709466',
  name: 'Sync Space with Removal',
  description: '',
  category: 'Space',
  offlineSupport: true,
  image: {
    thumbnailUrl:
      '//graasp.eu/pictures/5e9efe77f130f510ae709466/orig_61002471b71ec0dad89928699baef3a8144741b0.png',
  },
  phases: [
    {
      id: '5e9efeadf130f510ae7094af',
      name: 'addition',
      description: '',
      category: 'Space',
      items: [
        {
          id: '5e9efeaef130f510ae7094c9',
          name: 'addition.description.html',
          description: '',
          mimeType: 'text/html',
          category: 'Resource',
          url: '//graasp.eu/resources/5e9efeaef130f510ae7094c9/raw',
          hash: 'c1a8f89e135e74a834ee8711e1c86c12',
        },
        {
          id: '5e9efeaef130f510ae7094cc',
          name: 'New Link.url.description.html',
          description: '',
          mimeType: 'text/html',
          category: 'Resource',
          url: '//graasp.eu/resources/5e9efeaef130f510ae7094cc/raw',
          hash: '80958727d0176f852fd2a36458a2340a',
        },
        {
          id: '5e9efeaef130f510ae7094cf',
          name: 'New Link',
          description: '',
          mimeType: 'image/jpeg',
          category: 'Resource',
          url:
            '//graasp.eu/pictures/5e9efeaef130f510ae7094cf/large_36358f683efff4c9393e84baa7aa92756845b7dc.jpeg',
          hash: '5852ba9f6d9f4d3e62a15b0696c0facc',
        },
        {
          id: '5e9efeaef130f510ae7094d2',
          name: 'text.graasp',
          description: '',
          mimeType: 'text/html',
          category: 'Resource',
          content: '',
        },
      ],
    },
    {
      id: '5e9efeadf130f510ae7094aa',
      name: 'removal',
      description: '',
      category: 'Space',
      items: [
        {
          id: '5e9efeadf130f510ae7094c0',
          name: 'removal.description.html',
          description: '',
          mimeType: 'text/html',
          category: 'Resource',
          url: '//graasp.eu/resources/5e9efeadf130f510ae7094c0/raw',
          hash: '3ddea9bd18227ced2aa66a673912cf90',
        },
      ],
    },
    {
      id: '5e9efeadf130f510ae7094b3',
      name: 'moving',
      description: '',
      category: 'Space',
      items: [
        {
          id: '5e9efeaef130f510ae7094dd',
          name: 'grwsfd.graasp',
          description: '',
          mimeType: 'text/html',
          category: 'Resource',
          content: '',
        },
        {
          id: '5e9efeaff130f510ae7094e1',
          name: 'moving.description.html',
          description: '',
          mimeType: 'text/html',
          category: 'Resource',
          url: '//graasp.eu/resources/5e9efeaff130f510ae7094e1/raw',
          hash: '502df342270936209f2b0ee5bef0ac04',
        },
        {
          id: '5e9efeaff130f510ae7094e6',
          name: 'New Link',
          description: '',
          mimeType: 'image/jpeg',
          category: 'Resource',
          url:
            '//graasp.eu/pictures/5e9efeaff130f510ae7094e6/large_bfc82a1ac77fc7b01dc2aafd4b5eafd392e82a29.jpeg',
          hash: '434038ccbc81aaac60aeebf6be8c4c58',
        },
        {
          id: '5e9efeaff130f510ae7094e4',
          name: 'Text Input',
          description: '',
          category: 'Application',
          appInstance: {
            settings: null,
            createdAt: '2020-04-21T14:09:51.280Z',
            updatedAt: '2020-04-21T14:09:51.280Z',
            id: '5e9efeaf0a3a2a001ad0e31b',
            resources: [],
          },
          url:
            'https://apps.graasp.eu/5acb589d0d5d9464081c2d46/5cde9891226a7d20a8a16697/latest/index.html',
          hash: 'af246f6f27d0d090bdb63cebddce262c',
        },
        {
          id: '5e9efeaff130f510ae7094ea',
          name: 'wfadv.graasp',
          description: '',
          mimeType: 'text/html',
          category: 'Resource',
          content: '',
        },
      ],
    },
  ],
  language: 'fr',
};

export const SPACE_WITH_UPDATE = {
  space: { id: '5e9f0ccde272c3572ddf0524', name: 'Space with update' },
  path: './spaceWithUpdate.zip',
};

export const SPACE_WITH_UPDATE_ORIGINAL = {
  id: '5e9f0ccde272c3572ddf0524',
  name: 'Sync Space with Update',
  description: '',
  category: 'Space',
  offlineSupport: true,
  image: {
    thumbnailUrl:
      '//graasp.eu/pictures/5e9f0ccde272c3572ddf0524/orig_61002471b71ec0dad89928699baef3a8144741b0.png',
  },
  phases: [
    {
      id: '5e9f0cf3e272c3572ddf0597',
      name: 'removal',
      description: '',
      category: 'Space',
      items: [
        {
          id: '5e9f0cf4e272c3572ddf05a6',
          name: '2D Spring with Mass',
          description: '',
          category: 'Application',
          url:
            'https://gateway.golabz.eu/embed/apps/145fb97e-72ee-4501-b12d-205f1f9c3069/app.html',
          hash: 'ae18b0b0e205a3fea64b7a9990f2eaf1',
        },
        {
          id: '5e9f0cf4e272c3572ddf05ac',
          name: 'text.graasp',
          description: '',
          mimeType: 'text/html',
          category: 'Resource',
          content: '',
        },
      ],
    },
    {
      id: '5e9f0cf3e272c3572ddf059a',
      name: 'phase',
      description: '',
      category: 'Space',
      items: [
        {
          id: '5e9f0cf4e272c3572ddf05b8',
          name: 'New Link',
          description: '',
          mimeType: 'image/jpeg',
          category: 'Resource',
          url:
            '//graasp.eu/pictures/5e9f0cf4e272c3572ddf05b8/large_950c04c60cdfe179a4ac386f1db0e93d09e9a304.jpeg',
          hash: '24f88db587be890f99a995b9be92eb42',
        },
      ],
    },
    {
      id: '5e9f0cf4e272c3572ddf059d',
      name: 'addition',
      description: '',
      category: 'Space',
      items: [
        {
          id: '5e9f0cf6e272c3572ddf05cf',
          name: 'New Link',
          description: '',
          mimeType: 'image/jpeg',
          category: 'Resource',
          url:
            '//graasp.eu/pictures/5e9f0cf6e272c3572ddf05cf/large_36358f683efff4c9393e84baa7aa92756845b7dc.jpeg',
          hash: '53fa6b3b0dfd7f4efceddf306bacb43c',
        },
        {
          id: '5e9f0cf6e272c3572ddf05cd',
          name: 'text.graasp',
          description: '',
          mimeType: 'text/html',
          category: 'Resource',
          content: '',
        },
      ],
    },
    {
      id: '5e9f0cf4e272c3572ddf059f',
      name: 'moving',
      description: '',
      category: 'Space',
      items: [
        {
          id: '5e9f0cf4e272c3572ddf05b5',
          name: 'grwsfd.graasp',
          description: '',
          mimeType: 'text/html',
          category: 'Resource',
          content: '',
        },
        {
          id: '5e9f0cf5e272c3572ddf05c0',
          name: 'New Link',
          description: '',
          mimeType: 'image/jpeg',
          category: 'Resource',
          url:
            '//graasp.eu/pictures/5e9f0cf5e272c3572ddf05c0/large_bfc82a1ac77fc7b01dc2aafd4b5eafd392e82a29.jpeg',
          hash: '1e77dc673fa7b6ba3ad8e441c0e83917',
        },
        {
          id: '5e9f0cf5e272c3572ddf05be',
          name: 'Text Input',
          description: '',
          category: 'Application',
          appInstance: {
            settings: null,
            createdAt: '2020-04-21T15:10:45.074Z',
            updatedAt: '2020-04-21T15:10:45.074Z',
            id: '5e9f0cf5c7e3c3001b602117',
            resources: [],
          },
          url:
            'https://apps.graasp.eu/5acb589d0d5d9464081c2d46/5cde9891226a7d20a8a16697/latest/index.html',
          hash: 'af246f6f27d0d090bdb63cebddce262c',
        },
        {
          id: '5e9f0cf6e272c3572ddf05c4',
          name: 'wfadv.graasp',
          description: '',
          mimeType: 'text/html',
          category: 'Resource',
          content: '<p>I added content here.</p>',
        },
      ],
    },
    {
      id: '5e9f0cf4e272c3572ddf05a3',
      name: 'moving phase',
      description: '',
      category: 'Space',
      items: [
        {
          id: '5e9f0cf8e272c3572ddf05d5',
          name: 'New Link',
          description: '',
          mimeType: 'image/jpeg',
          category: 'Resource',
          url:
            '//graasp.eu/pictures/5e9f0cf8e272c3572ddf05d5/large_cbfbd0368e2550fa90f2c3d8fbfac0536e930ff0.jpeg',
          hash: '0c6f9d4a619819cb29c79cf5efc64766',
        },
      ],
    },
  ],
  language: 'fr',
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

export const SPACE_WITH_MOVE_ORIGINAL = {
  id: '5ea003b2e1540856e519cc3e',
  name: 'Sync Space With Move',
  description: '',
  category: 'Space',
  offlineSupport: true,
  image: {
    thumbnailUrl:
      '//graasp.eu/pictures/5ea003b2e1540856e519cc3e/orig_61002471b71ec0dad89928699baef3a8144741b0.png',
  },
  phases: [
    {
      id: '5ea003e1e1540856e519cc93',
      name: 'addition',
      description: '',
      category: 'Space',
      items: [
        {
          id: '5ea003e4e1540856e519ccc9',
          name: 'New Link',
          description: '',
          mimeType: 'image/jpeg',
          category: 'Resource',
          url:
            '//graasp.eu/pictures/5ea003e4e1540856e519ccc9/large_36358f683efff4c9393e84baa7aa92756845b7dc.jpeg',
          hash: 'c6ad2c48804a3e0f93a7a23ab45b687f',
        },
        {
          id: '5ea003e4e1540856e519cccc',
          name: 'text.graasp',
          description: '',
          mimeType: 'text/html',
          category: 'Resource',
          content: '',
        },
      ],
    },
    {
      id: '5ea003e1e1540856e519cc8b',
      name: 'moving phase',
      description: '',
      category: 'Space',
      items: [
        {
          id: '5ea003e2e1540856e519cca4',
          name: 'moving phase.description.html',
          description: '',
          mimeType: 'text/html',
          category: 'Resource',
          url: '//graasp.eu/resources/5ea003e2e1540856e519cca4/raw',
          hash: 'bee9bd8ad05f1685e61572b09eda4cd4',
        },
        {
          id: '5ea003e2e1540856e519ccb1',
          name: 'New Link',
          description: '',
          mimeType: 'image/jpeg',
          category: 'Resource',
          url:
            '//graasp.eu/pictures/5ea003e2e1540856e519ccb1/large_cbfbd0368e2550fa90f2c3d8fbfac0536e930ff0.jpeg',
          hash: 'edc3697a225296a87038b064de877425',
        },
      ],
    },
    {
      id: '5ea003e1e1540856e519cc8e',
      name: 'removal',
      description: '',
      category: 'Space',
      items: [
        {
          id: '5ea003e2e1540856e519ccad',
          name: '2D Spring with Mass',
          description: '',
          category: 'Application',
          url:
            'https://gateway.golabz.eu/embed/apps/145fb97e-72ee-4501-b12d-205f1f9c3069/app.html',
          hash: 'ae18b0b0e205a3fea64b7a9990f2eaf1',
        },
        {
          id: '5ea003e3e1540856e519ccb6',
          name: 'text.graasp',
          description: '',
          mimeType: 'text/html',
          category: 'Resource',
          content: '',
        },
      ],
    },
    {
      id: '5ea003e1e1540856e519cc88',
      name: 'moving',
      description: '',
      category: 'Space',
      items: [
        {
          id: '5ea003e1e1540856e519cc97',
          name: 'grwsfd.graasp',
          description: '',
          mimeType: 'text/html',
          category: 'Resource',
          content: '',
        },
        {
          id: '5ea003e2e1540856e519cca1',
          name: 'wfadv.graasp',
          description: '',
          mimeType: 'text/html',
          category: 'Resource',
          content: '',
        },
        {
          id: '5ea003e1e1540856e519cc99',
          name: 'moving.description.html',
          description: '',
          mimeType: 'text/html',
          category: 'Resource',
          url: '//graasp.eu/resources/5ea003e1e1540856e519cc99/raw',
          hash: 'f8e658bd5018937f693bc42305b099d4',
        },
        {
          id: '5ea003e2e1540856e519cc9e',
          name: 'Text Input',
          description: '',
          category: 'Application',
          appInstance: {
            settings: null,
            createdAt: '2020-04-22T08:44:18.176Z',
            updatedAt: '2020-04-22T08:44:18.176Z',
            id: '5ea003e23a9dcf001a166e1b',
            resources: [],
          },
          url:
            'https://apps.graasp.eu/5acb589d0d5d9464081c2d46/5cde9891226a7d20a8a16697/latest/index.html',
          hash: 'af246f6f27d0d090bdb63cebddce262c',
        },
        {
          id: '5ea003e2e1540856e519cca7',
          name: 'New Link',
          description: '',
          mimeType: 'image/jpeg',
          category: 'Resource',
          url:
            '//graasp.eu/pictures/5ea003e2e1540856e519cca7/large_bfc82a1ac77fc7b01dc2aafd4b5eafd392e82a29.jpeg',
          hash: '0c827b7d7fe60fe9bf4733d870adc4c6',
        },
      ],
    },
  ],
  language: 'fr',
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
  space: {
    items: [
      {
        id: '5ea00b38e1540856e519e067',
        name: 'New Link',
        description: '',
        mimeType: 'image/gif',
        category: 'Resource',
        url:
          '//graasp.eu/pictures/5ea00b38e1540856e519e067/large_d23cd48aa4049625ec1700ce9053413176486271.gif',
        hash: '4d5912fa17b361293eed2f20d69f6bf5',
        asset: '5ea00ac4e1540856e519dfe8/4d5912fa17b361293eed2f20d69f6bf5.gif',
      },
      {
        id: '5ea020efc2531e383719dd9a',
        name: 'epfl.graasp',
        description: '',
        mimeType: 'text/html',
        category: 'Resource',
        content:
          "<p>L'Ecole polytechnique fédérale de Lausanne (EPFL) est un institut de recherche et une université à Lausanne, en Suisse, spécialisé dans les sciences naturelles et l'ingénierie. C'est l'une des deux Ecoles polytechniques fédérales suisses et elle a trois missions principales : l'enseignement, la recherche et le transfert de technologie au plus haut niveau international.</p>",
      },
    ],
    name: 'Sync Space with Tools changed',
    offlineSupport: true,
    phases: [
      {
        id: '5ea00ac4e1540856e519dfeb',
        name: 'Orientation',
        description: '',
        category: 'Space',
        items: [
          {
            id: '5ea00b4ae1540856e519e07b',
            name: 'somecontent.graasp',
            description: '',
            mimeType: 'text/html',
            category: 'Resource',
            content:
              '<p>Located in Switzerland, EPFL is one of Europe’s most vibrant and cosmopolitan science and technology institutions.</p>',
          },
        ],
      },
      {
        id: '5ea00ac5e1540856e519dfee',
        name: 'Conceptualisation',
        description: '',
        category: 'Space',
        items: [
          {
            id: '5ea00b6ae1540856e519e096',
            name: 'dd.graasp',
            description: '',
            mimeType: 'text/html',
            category: 'Resource',
            content:
              '<p>Through five schools and three colleges, EPFL community tackles the biggest challenges of our time through education, research and innovation.</p>',
          },
        ],
      },
      {
        id: '5ea00ac6e1540856e519dff7',
        name: 'Discussion',
        description: '',
        category: 'Space',
        items: [
          {
            id: '5ea00b7ce1540856e519e0df',
            name: 'dd.graasp',
            description: '',
            mimeType: 'text/html',
            category: 'Resource',
            content:
              '<p>At the heart of beautiful Switzerland, EPFL is a world of curiosity, collaboration and learning.</p>',
          },
        ],
      },
    ],
    language: 'en',
    id: '5ea00ac4e1540856e519dfe8',
    image: {
      thumbnailUrl:
        '//graasp.eu/pictures/5ea00ac4e1540856e519dfe8/orig_61002471b71ec0dad89928699baef3a8144741b0.png',
      thumbnailAsset:
        '5ea00ac4e1540856e519dfe8/b7540db8511142fa895fa580e31ec0a0.png',
    },
    description: '',
    category: 'Space',
    saved: true,
  },
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

export const SPACE_WITH_MULTIPLE_CHANGES_ORIGINAL = {
  id: '5ea029f5f851e7716e3722fe',
  name: 'Sync Space with Multiple Changes',
  description: '<p>This space contains many changes.</p>',
  category: 'Space',
  offlineSupport: true,
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
          description:
            '<p>English physicist and mathematician, Sir Isaac Newton</p>',
          mimeType: 'image/jpeg',
          category: 'Resource',
          url:
            '//graasp.eu/pictures/5ea02a30f851e7716e372354/large_36358f683efff4c9393e84baa7aa92756845b7dc.jpeg',
          hash: '05eec0a88c66606d70c016d306d81c1d',
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
        },
        {
          id: '5ea02a3df851e7716e372361',
          name: 'New Link',
          description: '<p>a gravity image</p>',
          mimeType: 'image/jpeg',
          category: 'Resource',
          url:
            '//graasp.eu/pictures/5ea02a3df851e7716e372361/large_bfc82a1ac77fc7b01dc2aafd4b5eafd392e82a29.jpeg',
          hash: '7023ffd8042704ba8f0dec23059400d0',
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
      id: '5ea029fbf851e7716e37230b',
      name: 'Conclusion',
      description: '',
      category: 'Space',
      items: [
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
