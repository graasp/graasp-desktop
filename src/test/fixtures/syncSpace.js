import { createDiffObject, createChangeObj } from '../../utils/syncSpace';
import { SYNC_CHANGES } from '../../config/constants';

const { ADDED, REMOVED, UPDATED, MOVED } = SYNC_CHANGES;

const createItem = (
  id,
  name = '',
  description = '',
  content = '',
  changes,
  className
) => {
  const tmp = {
    id,
    name,
    content,
    description,
  };

  if (changes) {
    tmp.changes = changes;
  }

  if (className !== undefined) {
    tmp.className = className;
  }

  return tmp;
};

const createPhase = (
  id,
  name,
  description = '',
  items = [],
  changes,
  className
) => {
  const tmp = {
    id,
    name,

    description,
    items,
  };

  if (changes) {
    tmp.changes = changes;
  }

  if (className !== undefined) {
    tmp.className = className;
  }

  return tmp;
};

export const filterSpace = [
  [
    { name: 'spacename', id: 'spaceId', phases: [] },
    { name: 'spacename', phases: [] },
  ],
  [
    {
      name: 'spacename',
      id: 'spaceId',
      phases: [
        {
          name: 'phase name',
          id: 'phaseid',
          description: 'phasedescription',
          offlineSupport: true,
          items: [],
        },
      ],
    },
    {
      name: 'spacename',
      phases: [
        {
          name: 'phase name',
          id: 'phaseid',
          description: 'phasedescription',
          offlineSupport: true,
          items: [],
        },
      ],
    },
  ],
  [
    {
      name: 'spacename',
      id: 'spaceId',
      offlineSupport: true,
      phases: [
        {
          name: 'phase name',
          id: 'phaseid',
          description: 'phasedescription',
          items: [
            {
              category: 'Resource',
              content:
                '<p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.</p>',
              description: '',
              id: '5cce86096e2aaf40bad2d0fd',
              mimeType: 'text/html',
              name: 'sample.graasp',
            },

            {
              category: 'Resource',
              description: '',
              hash: '093f8bb0e21e19bfe62d0a7880d5f985',
              id: '9cce87b96e2aaf30bad2d127',
              mimeType: 'image/jpeg',
              name: 'Sample.jpg',
              url: 'https://d28t6ykz01qrod.cloudfront.net/epfl/bg.jpg',
            },
            {
              category: 'Application',
              description: '',
              hash: 'af246f6f27d0d090bdb63cebddce262c',
              id: '5de2c2e23b209c1877b3dc80',
              name: 'Input Box',
              url:
                'https://apps.graasp.eu/5acb589d0d5d9464081c2d46/5cde9891226a7d20a8a16697/latest/index.html',
              asset: '',
              appInstance: {
                id: '5ce2c2e23a209c1877b3dc80',
                settings: {
                  headerVisible: false,
                },
                resources: [],
                createdAt: '2019-05-21T17:06:29.683Z',
                updatedAt: '2019-05-24T13:24:05.073Z',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'spacename',
      phases: [
        {
          name: 'phase name',
          id: 'phaseid',
          description: 'phasedescription',
          items: [
            {
              content:
                '<p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.</p>',
              description: '',
              name: 'sample.graasp',
            },

            {
              description: '',
              name: 'Sample.jpg',
            },
            {
              description: '',
              name: 'Input Box',
            },
          ],
        },
      ],
    },
  ],
  [
    {
      name: 'spacename',
      id: 'spaceId',
      offlineSupport: true,
      phases: [
        {
          name: 'phase name',
          id: 'phaseid',
          description: 'phasedescription',
          items: [
            {
              category: 'Resource',
              content:
                '<p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.</p>',
              description: '',
              id: '5cce86096e2aaf40bad2d0fd',
              mimeType: 'text/html',
              name: 'sample.graasp',
            },
            {
              category: 'Application',
              description: '',
              hash: 'af246f6f27d0d090bdb63cebddce262c',
              id: '5de2c2e23b209c1877b3dc80',
              name: 'Input Box',
              url:
                'https://apps.graasp.eu/5acb589d0d5d9464081c2d46/5cde9891226a7d20a8a16697/latest/index.html',
              asset: '',
              appInstance: {
                id: '5ce2c2e23a209c1877b3dc80',
                settings: {
                  headerVisible: false,
                },
                resources: [],
                createdAt: '2019-05-21T17:06:29.683Z',
                updatedAt: '2019-05-24T13:24:05.073Z',
              },
            },
          ],
        },
        {
          name: 'phase name1',
          id: 'phaseid1',
          description: 'phasedescription1',
          items: [
            {
              content:
                '<p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.</p>',
              description: '',
              name: 'sample.graasp',
              id: '5cce86096e2aaf40bad2d0fd',
              mimeType: 'text/html',
            },
            {
              description: 'desc',
              name: 'Input Box',
              id: '5de2c2e23b209c1877b3dc80',
              url:
                'https://apps.graasp.eu/5acb589d0d5d9464081c2d46/5cde9891226a7d20a8a16697/latest/index.html',
              asset: '',
              appInstance: {
                id: '5ce2c2e23a209c1877b3dc80',
                settings: {
                  headerVisible: false,
                },
                resources: [],
                createdAt: '2019-05-21T17:06:29.683Z',
                updatedAt: '2019-05-24T13:24:05.073Z',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'spacename',
      phases: [
        {
          name: 'phase name',
          id: 'phaseid',
          description: 'phasedescription',
          items: [
            {
              content:
                '<p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.</p>',
              description: '',
              name: 'sample.graasp',
            },
            {
              description: '',
              name: 'Input Box',
            },
          ],
        },
        {
          name: 'phase name1',
          id: 'phaseid1',
          description: 'phasedescription1',
          items: [
            {
              content:
                '<p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.</p>',
              description: '',
              name: 'sample.graasp',
            },
            {
              description: 'desc',
              name: 'Input Box',
            },
          ],
        },
      ],
    },
  ],
  [
    {
      id: '5e53c63b52b801158124d7d2',
      name: 'Developer Space',
      description:
        '<p>This is a developer space, content does not make sense altogether. </p>',
      category: 'Space',
      offlineSupport: true,
      image: {
        thumbnailUrl:
          '//graasp.eu/pictures/5e53c63b52b801158124d7d2/orig_8f0a480e50e17ee088a0bed3f043f1147b6028cf.jpeg',
      },
      phases: [
        {
          id: '5e53c63c52b801158124d7de',
          name: 'math',
          description:
            '<p>% \\f is defined as f(#1) using the macro</p><p>\\f{x} = \\int</p>',
          category: 'Space',
          items: [
            {
              id: '5e53c7ee52b801158124d82b',
              name: 'katex.graasp',
              description: '',
              mimeType: 'text/html',
              category: 'Resource',
              content:
                '<p>% \\f is defined as f(#1) using the macro</p><p>\\f{x} = \\int_{-\\infty}^\\infty<br>    \\hat \\f\\xi\\,e^{2 \\pi i \\xi x}<br>    \\,d\\xi</p>',
            },
          ],
        },
        {
          id: '5e53c63b52b801158124d7d5',
          name: 'Documents',
          description: '<p>This phase contains documents.</p>',
          category: 'Space',
          items: [
            {
              id: '5e53c67d52b801158124d7f7',
              name: 'text.txt',
              description: '',
              mimeType: 'text/plain',
              category: 'Resource',
              url: '//graasp.eu/resources/5e53c67d52b801158124d7f7/raw',
              hash: '016d9805d6c9ab0a558e9f4f8f46c993',
            },
            {
              id: '5e53c66f52b801158124d7f4',
              name: 'graasp.graasp',
              description: '',
              mimeType: 'text/html',
              category: 'Resource',
              content: '<p>I am a graasp created element.</p>',
            },
          ],
        },
        {
          id: '5e53c63b52b801158124d7d8',
          name: 'images',
          description:
            '<p>This phase contains images from different sources. changes</p>',
          category: 'Space',
          items: [
            {
              id: '5e53c72c52b801158124d80f',
              name: 'New Link (1)',
              description:
                '<p>This image is imported using its URL link. change</p>',
              mimeType: 'image/jpeg',
              category: 'Resource',
              url:
                '//graasp.eu/pictures/5e53c72c52b801158124d80f/large_b33871f4fef2219f9a60647884fe7882253f2e72.jpeg',
              hash: '1f6486f2166d0775bdf9de6ddca20328',
            },
          ],
        },
      ],
      language: 'en',
    },
    {
      name: 'Developer Space',
      description:
        '<p>This is a developer space, content does not make sense altogether. </p>',
      image: {
        thumbnailUrl:
          '//graasp.eu/pictures/5e53c63b52b801158124d7d2/orig_8f0a480e50e17ee088a0bed3f043f1147b6028cf.jpeg',
      },
      phases: [
        {
          id: '5e53c63c52b801158124d7de',
          name: 'math',
          category: 'Space',
          description:
            '<p>% \\f is defined as f(#1) using the macro</p><p>\\f{x} = \\int</p>',
          items: [
            {
              name: 'katex.graasp',
              description: '',
              content:
                '<p>% \\f is defined as f(#1) using the macro</p><p>\\f{x} = \\int_{-\\infty}^\\infty<br>    \\hat \\f\\xi\\,e^{2 \\pi i \\xi x}<br>    \\,d\\xi</p>',
            },
          ],
        },
        {
          id: '5e53c63b52b801158124d7d5',
          name: 'Documents',
          category: 'Space',
          description: '<p>This phase contains documents.</p>',
          items: [
            {
              name: 'text.txt',
              description: '',
            },
            {
              name: 'graasp.graasp',
              description: '',
              content: '<p>I am a graasp created element.</p>',
            },
          ],
        },
        {
          id: '5e53c63b52b801158124d7d8',
          name: 'images',
          category: 'Space',
          description:
            '<p>This phase contains images from different sources. changes</p>',
          items: [
            {
              name: 'New Link (1)',
              description:
                '<p>This image is imported using its URL link. change</p>',
            },
          ],
        },
      ],
    },
  ],
];

export const isSpaceUpToDate = [
  [
    {
      name: 'spacename',
      id: 'spaceId',
      phases: [{ id: 'phaseid', items: [] }],
    },
    {
      name: 'spacename',
      id: 'spaceId',
      phases: [{ id: 'phaseid', items: [] }],
    },
    true,
  ],
  [
    {
      name: 'spacename',
      id: 'spaceId',
      phases: [
        {
          id: 'phaseid',
          items: [
            {
              id: 'itemid',
              name: 'itemname',
              content: 'content',
            },
          ],
        },
      ],
    },
    {
      name: 'spacename',
      id: 'spaceId',
      phases: [
        {
          id: 'phaseid',
          items: [
            {
              id: 'itemid',
              name: 'itemname',
              content: 'content changed',
            },
          ],
        },
      ],
    },
    false,
  ],
  [
    {
      name: 'spacename',
      id: 'spaceId',
      phases: [
        {
          id: 'phaseid',
          items: [
            {
              id: 'itemid',
              name: 'itemname',
              content: 'content',
            },
          ],
        },
      ],
    },
    {
      name: 'spacename',
      id: 'spaceId',
      phases: [
        {
          id: 'phaseid',
          items: [
            {
              id: 'itemid',
              name: 'itemname',
              content: 'content',
            },
            {
              id: 'newitemid',
              name: 'newitemname',
              content: 'new content',
            },
          ],
        },
      ],
    },
    false,
  ],
  [
    {
      name: 'spacename',
      id: 'spaceId',
      phases: [
        {
          id: 'phaseid',
          items: [
            {
              id: 'itemid',
              name: 'itemname',
              content: 'content',
            },
            {
              id: 'newitemid',
              name: 'newitemname',
              content: 'new content',
            },
          ],
        },
      ],
    },
    {
      name: 'spacename',
      id: 'spaceId',
      phases: [
        {
          id: 'phaseid',
          items: [
            {
              id: 'newitemid',
              name: 'newitemname',
              content: 'new content',
            },
            {
              id: 'itemid',
              name: 'itemname',
              content: 'content',
            },
          ],
        },
      ],
    },
    false,
  ],
  [
    {
      id: '5e53c63b52b801158124d7d2',
      name: 'Developer Space',
      description:
        '<p>This is a developer space, content does not make sense altogether. </p>',
      category: 'Space',
      offlineSupport: true,
      image: {
        thumbnailUrl:
          '//graasp.eu/pictures/5e53c63b52b801158124d7d2/orig_8f0a480e50e17ee088a0bed3f043f1147b6028cf.jpeg',
      },
      phases: [
        {
          id: '5e53c63c52b801158124d7de',
          name: 'math',
          description:
            '<p>% \\f is defined as f(#1) using the macro</p><p>\\f{x} = \\int</p>',
          category: 'Space',
          items: [
            {
              id: '5e53c7ee52b801158124d82b',
              name: 'katex.graasp',
              description: '',
              mimeType: 'text/html',
              category: 'Resource',
              content:
                '<p>% \\f is defined as f(#1) using the macro</p><p>\\f{x} = \\int_{-\\infty}^\\infty<br>    \\hat \\f\\xi\\,e^{2 \\pi i \\xi x}<br>    \\,d\\xi</p>',
            },
          ],
        },
        {
          id: '5e53c63b52b801158124d7d5',
          name: 'Documents',
          description: '<p>This phase contains documents.</p>',
          category: 'Space',
          items: [
            {
              id: '5e53c67d52b801158124d7f7',
              name: 'text.txt',
              description: '',
              mimeType: 'text/plain',
              category: 'Resource',
              url: '//graasp.eu/resources/5e53c67d52b801158124d7f7/raw',
              hash: '016d9805d6c9ab0a558e9f4f8f46c993',
            },
            {
              id: '5e53c66f52b801158124d7f4',
              name: 'graasp.graasp',
              description: '',
              mimeType: 'text/html',
              category: 'Resource',
              content: '<p>I am a graasp created element.</p>',
            },
          ],
        },
        {
          id: '5e53c63b52b801158124d7d8',
          name: 'images',
          description:
            '<p>This phase contains images from different sources. changes</p>',
          category: 'Space',
          items: [
            {
              id: '5e53c72c52b801158124d80f',
              name: 'New Link (1)',
              description:
                '<p>This image is imported using its URL link. change</p>',
              mimeType: 'image/jpeg',
              category: 'Resource',
              url:
                '//graasp.eu/pictures/5e53c72c52b801158124d80f/large_b33871f4fef2219f9a60647884fe7882253f2e72.jpeg',
              hash: '1f6486f2166d0775bdf9de6ddca20328',
            },
          ],
        },
      ],
      language: 'en',
    },
    {
      id: '5e53c63b52b801158124d7d2',
      name: 'Developer Space',
      description:
        '<p>This is a developer space, content does not make sense altogether. </p>',
      category: 'Space',
      offlineSupport: true,
      image: {
        thumbnailUrl:
          '//graasp.eu/pictures/5e53c63b52b801158124d7d2/orig_8f0a480e50e17ee088a0bed3f043f1147b6028cf.jpeg',
      },
      phases: [
        {
          id: '5e53c63c52b801158124d7de',
          name: 'math',
          description:
            '<p>% \\f is defined as f(#1) using the macro</p><p>\\f{x} = \\int</p>',
          category: 'Space',
          items: [
            {
              id: '5e53c7ee52b801158124d82b',
              name: 'katex.graasp',
              description: '',
              mimeType: 'text/html',
              category: 'Resource',
              content:
                '<p>% \\f is defined as f(#1) using the macro</p><p>\\f{x} = \\int_{-\\infty}^\\infty<br>    \\hat \\f\\xi\\,e^{2 \\pi i \\xi x}<br>    \\,d\\xi</p>',
            },
          ],
        },
        {
          id: '5e53c63b52b801158124d7d5',
          name: 'Documents',
          description: '<p>This phase contains documents.</p>',
          category: 'Space',
          items: [
            {
              id: '5e53c67d52b801158124d7f7',
              name: 'text.txt',
              description: '',
              mimeType: 'text/plain',
              category: 'Resource',
              url: '//graasp.eu/resources/5e53c67d52b801158124d7f7/raw',
              hash: '016d9805d6c9ab0a558e9f4f8f46c993',
            },
            {
              id: '5e53c66f52b801158124d7f4',
              name: 'graasp.graasp',
              description: '',
              mimeType: 'text/html',
              category: 'Resource',
              content: '<p>I am a graasp created element.</p>',
            },
          ],
        },
        {
          id: '5e53c63b52b801158124d7d8',
          name: 'images',
          description:
            '<p>This phase contains images from different sources. changes</p>',
          category: 'Space',
          items: [
            {
              id: '5e53c72c52b801158124d80f',
              name: 'New Link (1)',
              description:
                '<p>This image is imported using its URL link. change</p>',
              mimeType: 'image/jpeg',
              category: 'Resource',
              url:
                '//graasp.eu/pictures/5e53c72c52b801158124d80f/large_b33871f4fef2219f9a60647884fe7882253f2e72.jpeg',
              hash: '1f6486f2166d0775bdf9de6ddca20328',
            },
          ],
        },
      ],
      language: 'en',
    },
    true,
  ],
  [
    {
      id: '5e53c63b52b801158124d7d2',
      name: 'Developer Space',
      description:
        '<p>This is a developer space, content does not make sense altogether. </p>',
      category: 'Space',
      offlineSupport: true,
      image: {
        thumbnailUrl:
          '//graasp.eu/pictures/5e53c63b52b801158124d7d2/orig_8f0a480e50e17ee088a0bed3f043f1147b6028cf.jpeg',
      },
      phases: [
        {
          id: '5e53c63c52b801158124d7de',
          name: 'math',
          description:
            '<p>% \\f is defined as f(#1) using the macro</p><p>\\f{x} = \\int</p>',
          category: 'Space',
          items: [
            {
              id: '5e53c7ee52b801158124d82b',
              name: 'katex.graasp',
              description: '',
              mimeType: 'text/html',
              category: 'Resource',
              content:
                '<p>% \\f is defined as f(#1) using the macro</p><p>\\f{x} = \\int_{-\\infty}^\\infty<br>    \\hat \\f\\xi\\,e^{2 \\pi i \\xi x}<br>    \\,d\\xi</p>',
            },
          ],
        },
        {
          id: '5e53c63b52b801158124d7d5',
          name: 'Documents',
          description: '<p>This phase contains documents.</p>',
          category: 'Space',
          items: [
            {
              id: '5e53c67d52b801158124d7f7',
              name: 'text.txt',
              description: '',
              mimeType: 'text/plain',
              category: 'Resource',
              url: '//graasp.eu/resources/5e53c67d52b801158124d7f7/raw',
              hash: '016d9805d6c9ab0a558e9f4f8f46c993',
            },
            {
              id: '5e53c66f52b801158124d7f4',
              name: 'graasp.graasp',
              description: '',
              mimeType: 'text/html',
              category: 'Resource',
              content: '<p>I am a graasp created element.</p>',
            },
          ],
        },
        {
          id: '5e53c63b52b801158124d7d8',
          name: 'images',
          description:
            '<p>This phase contains images from different sources. changes</p>',
          category: 'Space',
          items: [
            {
              id: '5e53c72c52b801158124d80f',
              name: 'New Link (1)',
              description:
                '<p>This image is imported using its URL link. change</p>',
              mimeType: 'image/jpeg',
              category: 'Resource',
              url:
                '//graasp.eu/pictures/5e53c72c52b801158124d80f/large_b33871f4fef2219f9a60647884fe7882253f2e72.jpeg',
              hash: '1f6486f2166d0775bdf9de6ddca20328',
            },
          ],
        },
      ],
      language: 'en',
    },
    {
      id: '5e53c63b52b801158124d7d2',
      name: 'Developer Space',
      description:
        '<p>This is a developer space, content does not make sense altogether. </p>',
      category: 'Space',
      offlineSupport: true,
      image: {
        thumbnailUrl:
          '//graasp.eu/pictures/5e53c63b52b801158124d7d2/orig_8f0a480e50e17ee088a0bed3f043f1147b6028cf.jpeg',
      },
      phases: [
        {
          id: '5e53c63c52b801158124d7de',
          name: 'math',
          description:
            '<p>% \\f is defined as f(#1) using the macro</p><p>\\f{x} = \\int</p>',
          category: 'Space',
          items: [
            {
              id: '5e53c7ee52b801158124d82b',
              name: 'katex.graasp',
              description: '',
              mimeType: 'text/html',
              category: 'Resource',
              content:
                '<p>% \\f is defined as f(#1) using the macro</p><p>\\f{x} = \\int_{-\\infty}^\\infty<br>    \\hat \\f\\xi\\,e^{2 \\pi i \\xi x}<br>    \\,d\\xi</p>',
            },
          ],
        },
        {
          id: '5e53c63b52b801158124d7d5',
          name: 'Documents',
          description: '<p>This phase contains documents.</p>',
          category: 'Space',
          items: [
            {
              id: '5e53c67d52b801158124d7f7',
              name: 'text.txt',
              description: '',
              mimeType: 'text/plain',
              category: 'Resource',
              url: '//graasp.eu/resources/5e53c67d52b801158124d7f7/raw',
              hash: '016d9805d6c9ab0a558e9f4f8f46c993',
            },
            {
              id: '5e53c66f52b801158124d7f4',
              name: 'graasp.graasp',
              description: '',
              mimeType: 'text/html',
              category: 'Resource',
              content: '<p>I am a graasp created element.</p>',
            },
          ],
        },
        {
          id: '5e53c63b52b801158124d7d8',
          name: 'images',
          description:
            '<p>This phase contains images from different sources. changes</p>',
          category: 'Space',
          items: [],
        },
      ],
      language: 'en',
    },
    false,
  ],
];

export const diffString = [
  [undefined, undefined, createDiffObject(false, false, false)],
  [null, null, createDiffObject(false, false, false)],
  ['', '', createDiffObject(false, false, false)],
  ['a', 'a', createDiffObject(false, false, false)],
  ['a', 'b', createDiffObject(false, false, true)],
  ['a', 'ab', createDiffObject(false, false, true)],
  ['a', undefined, createDiffObject(false, true, false)],
  ['a', null, createDiffObject(false, true, false)],
  ['a', '', createDiffObject(false, true, false)],
  ['', 'ab', createDiffObject(true, false, false)],
  [undefined, 'ab', createDiffObject(true, false, false)],
  [null, 'ab', createDiffObject(true, false, false)],
];

export const countConditions = [
  [[createChangeObj(1, ADDED)], 1, false],
  [[createChangeObj(1, REMOVED)], 1, false],
  [[createChangeObj(1, MOVED)], 1, false],
  [[createChangeObj(1, UPDATED)], 1, true],
  [[], 1, true],
  [[createChangeObj(2, UPDATED)], 1, true],
  [[createChangeObj(2, MOVED)], 1, true],
  [[createChangeObj(2, ADDED)], 1, true],
  [[createChangeObj(1, UPDATED), createChangeObj(2, UPDATED)], 1, true],
  [
    [
      createChangeObj(1, MOVED),
      createChangeObj(1, UPDATED),
      createChangeObj(2, UPDATED),
    ],
    1,
    false,
  ],
  [[createChangeObj(1, REMOVED), createChangeObj(2, UPDATED)], 1, false],
];

export const getRelativeIdx = [
  [
    [
      createItem(0),
      createItem(1),
      createItem(2),
      createItem(3),
      createItem(4),
      createItem(5),
    ],
    4,
    [createChangeObj(1, MOVED)],
    3,
  ],
  [
    [
      createItem(0),
      createItem(1),
      createItem(2),
      createItem(3),
      createItem(4),
      createItem(5),
    ],
    2,
    [createChangeObj(4, MOVED)],
    2,
  ],
  [
    [
      createItem(0),
      createItem(1),
      createItem(2),
      createItem(3),
      createItem(4),
      createItem(5),
    ],
    4,
    [createChangeObj(1, REMOVED)],
    3,
  ],
  [
    [
      createItem(0),
      createItem(1),
      createItem(2),
      createItem(3),
      createItem(4),
      createItem(5),
    ],
    2,
    [createChangeObj(4, REMOVED)],
    2,
  ],
  [
    [
      createItem(0),
      createItem(1),
      createItem(2),
      createItem(3),
      createItem(4),
      createItem(5),
    ],
    4,
    [createChangeObj(1, ADDED)],
    3,
  ],
  [
    [
      createItem(0),
      createItem(1),
      createItem(2),
      createItem(3),
      createItem(4),
      createItem(5),
    ],
    2,
    [createChangeObj(4, ADDED)],
    2,
  ],
  [
    [
      createItem(0),
      createItem(1),
      createItem(2),
      createItem(3),
      createItem(4),
      createItem(5),
    ],
    4,
    [createChangeObj(1, UPDATED)],
    4,
  ],
  [
    [
      createItem(0),
      createItem(1),
      createItem(2),
      createItem(3),
      createItem(4),
      createItem(5),
    ],
    2,
    [createChangeObj(4, UPDATED)],
    2,
  ],
  [
    [
      createItem(0),
      createItem(1),
      createItem(2),
      createItem(3),
      createItem(4),
      createItem(5),
    ],
    4,
    [createChangeObj(2, UPDATED), createChangeObj(3, MOVED)],
    3,
  ],
  [
    [
      createItem(0),
      createItem(1),
      createItem(2),
      createItem(3),
      createItem(4),
      createItem(5),
    ],
    4,
    [createChangeObj(2, ADDED), createChangeObj(3, MOVED)],
    2,
  ],
  [
    [
      createItem(0),
      createItem(1),
      createItem(2),
      createItem(3),
      createItem(4),
      createItem(5),
    ],
    4,
    [
      createChangeObj(2, ADDED),
      createChangeObj(1, UPDATED),
      createChangeObj(3, MOVED),
    ],
    2,
  ],
  [
    [
      createItem(0),
      createItem(1),
      createItem(2),
      createItem(3),
      createItem(4),
      createItem(5),
    ],
    4,
    [
      createChangeObj(2, ADDED),
      createChangeObj(1, UPDATED),
      createChangeObj(3, UPDATED),
    ],
    3,
  ],
  [
    [
      createItem(0),
      createItem(1),
      createItem(2),
      createItem(3),
      createItem(4),
      createItem(5),
    ],
    4,
    [
      createChangeObj(1, ADDED),
      createChangeObj(2, ADDED),
      createChangeObj(3, MOVED),
    ],
    1,
  ],
  [
    [
      createItem(0),
      createItem(1),
      createItem(2),
      createItem(3),
      createItem(4),
      createItem(5),
    ],
    4,
    [
      createChangeObj(2, ADDED),
      createChangeObj(1, UPDATED),
      createChangeObj(3, UPDATED),
      createChangeObj(5, ADDED),
    ],
    3,
  ],
];

export const findDiffInElementArrayPhases = [
  [[createPhase(0, 'phasename')], [createPhase(0, 'phasename')], []],
  [
    [createPhase(0, 'phasename')],
    [createPhase(0, 'phasename1')],
    [createChangeObj(0, UPDATED, 0, 0)],
  ],
  [
    [createPhase(0, 'phasename', 'description', [{ id: 1 }])],
    [createPhase(0, 'phasename', 'description', [{ id: 2 }])],
    [createChangeObj(0, UPDATED, 0, 0)],
  ],
  [
    [createPhase(0, 'phasename', 'description', [{ id: 1 }])],
    [createPhase(0, 'phasename', 'description', [{ id: 1 }, { id: 2 }])],
    [createChangeObj(0, UPDATED, 0, 0)],
  ],
  [
    [createPhase(0, 'phasename', 'description')],
    [createPhase(0, 'phasename', 'description1')],
    [createChangeObj(0, UPDATED, 0, 0)],
  ],
  [
    [
      createPhase(1, 'phasename', 'description'),
      createPhase(0, 'phasename', 'description'),
    ],
    [
      createPhase(1, 'phasename', 'description'),
      createPhase(0, 'phasename', 'description1'),
    ],
    [createChangeObj(0, UPDATED, 1, 1)],
  ],
  [[createPhase(0, 'phasename')], [], [createChangeObj(0, REMOVED, 0, null)]],
  [[], [createPhase(0, 'phasename')], [createChangeObj(0, ADDED, null, 0)]],
  [
    [createPhase(1, 'phasename')],
    [createPhase(0, 'phasename')],
    [createChangeObj(1, REMOVED, 0, null), createChangeObj(0, ADDED, null, 0)],
  ],
  [
    [createPhase(0, 'phasename', 'description')],
    [createPhase(0, 'phasename', 'description')],
    [],
  ],
  [
    [
      createPhase(0, 'phasename', 'description'),
      createPhase(1, 'phasename', 'description'),
    ],
    [createPhase(1, 'phasename', 'description')],
    [createChangeObj(0, REMOVED, 0, null)],
  ],
  [
    [
      createPhase(0, 'phasename', 'description'),
      createPhase(1, 'phasename', 'description'),
    ],
    [createPhase(0, 'phasename', 'description')],
    [createChangeObj(1, REMOVED, 1, null)],
  ],
  [
    [
      createPhase(0, 'phasename', 'description'),
      createPhase(1, 'phasename', 'description'),
    ],
    [
      createPhase(0, 'phasename', 'description'),
      createPhase(1, 'phasename', 'description'),
    ],
    [],
  ],
  [
    [
      createPhase(0, 'phasename', 'description'),
      createPhase(1, 'phasename', 'description'),
      createPhase(2, 'phasename', 'description'),
    ],
    [
      createPhase(0, 'phasename', 'description'),
      createPhase(2, 'phasename', 'description'),
      createPhase(1, 'phasename', 'description'),
    ],
    [createChangeObj(2, MOVED, 2, 1)],
  ],
  [
    [
      createPhase(0, 'phasename', 'description'),
      createPhase(1, 'phasename', 'description'),
      createPhase(2, 'phasename', 'description'),
    ],
    [
      createPhase(0, 'phasename', 'description'),
      createPhase(2, 'phasenameupdate', 'description'),
      createPhase(1, 'phasename', 'description'),
    ],
    [createChangeObj(2, UPDATED, 2, 1), createChangeObj(2, MOVED, 2, 1)],
  ],
  [
    [
      createPhase(0, 'phasename', 'description'),
      createPhase(1, 'phasename', 'description'),
      createPhase(2, 'phasename', 'description'),
      createPhase(3, 'phasename', 'description'),
    ],
    [
      createPhase(0, 'phasename', 'description'),
      createPhase(2, 'phasenameupdate', 'description'),
      createPhase(3, 'phasename', 'description'),
      createPhase(1, 'phasename', 'description'),
    ],
    [
      createChangeObj(2, UPDATED, 2, 1),
      createChangeObj(3, MOVED, 3, 2),
      createChangeObj(2, MOVED, 2, 1),
    ],
  ],

  [
    [
      createPhase(3, 'phasename', 'description'),
      createPhase(0, 'phasename', 'description'),
      createPhase(2, 'phasename', 'description'),
      createPhase(1, 'phasename', 'description'),
    ],
    [
      createPhase(0, 'phasename', 'description'),
      createPhase(3, 'phasename', 'description'),
      createPhase(1, 'phasename', 'description'),
      createPhase(2, 'phasename', 'description'),
    ],

    [createChangeObj(1, MOVED, 3, 2), createChangeObj(0, MOVED, 1, 0)],
  ],
  [
    [
      createPhase(0, 'phasename', 'description'),
      createPhase(1, 'phasename', 'description'),
      createPhase(2, 'phasename', 'description'),
      createPhase(3, 'phasename', 'description'),
      createPhase(4, 'phasename', 'description'),
      createPhase(5, 'phasename', 'description'),
    ],
    [
      createPhase(4, 'phasename', 'description'),
      createPhase(0, 'phasename', 'description'),
      createPhase(2, 'phasename', 'description'),
      createPhase(3, 'phasename', 'description'),
      createPhase(1, 'phasename', 'description'),
      createPhase(5, 'phasename', 'description'),
    ],

    [createChangeObj(4, MOVED, 4, 0), createChangeObj(1, MOVED, 1, 4)],
  ],
  [
    [
      createPhase(0, 'phasename', 'description'),
      createPhase(1, 'phasename', 'description'),
    ],
    [
      createPhase(0, 'phasename', 'description'),
      createPhase(2, 'phasenameupdate', 'description'),
      createPhase(1, 'phasename', 'description'),
    ],
    [createChangeObj(2, ADDED, null, 1)],
  ],
];
export const findDiffInElementArrayItems = [
  [[createItem(0, 'itemname')], [createItem(0, 'itemname')], []],
  [
    [createItem(0, 'itemname')],
    [createItem(0, 'itemname1')],
    [createChangeObj(0, UPDATED, 0, 0)],
  ],
  [
    [createItem(0, 'itemname', 'description')],
    [createItem(0, 'itemname', 'description1')],
    [createChangeObj(0, UPDATED, 0, 0)],
  ],
  [
    [
      createItem(1, 'itemname', 'description'),
      createItem(0, 'itemname', 'description'),
    ],
    [
      createItem(1, 'itemname', 'description'),
      createItem(0, 'itemname', 'description1'),
    ],
    [createChangeObj(0, UPDATED, 1, 1)],
  ],
  [[createItem(0, 'itemname')], [], [createChangeObj(0, REMOVED, 0, null)]],
  [[], [createItem(0, 'itemname')], [createChangeObj(0, ADDED, null, 0)]],
  [
    [createItem(1, 'itemname')],
    [createItem(0, 'itemname')],
    [createChangeObj(1, REMOVED, 0, null), createChangeObj(0, ADDED, null, 0)],
  ],
  [
    [createItem(0, 'itemname', 'description')],
    [createItem(0, 'itemname', 'description')],
    [],
  ],
  [
    [
      createItem(0, 'itemname', 'description'),
      createItem(1, 'itemname', 'description'),
    ],
    [createItem(1, 'itemname', 'description')],
    [createChangeObj(0, REMOVED, 0, null)],
  ],
  [
    [
      createItem(0, 'itemname', 'description'),
      createItem(1, 'itemname', 'description'),
    ],
    [createItem(0, 'itemname', 'description')],
    [createChangeObj(1, REMOVED, 1, null)],
  ],
  [
    [
      createItem(0, 'itemname', 'description'),
      createItem(1, 'itemname', 'description'),
    ],
    [
      createItem(0, 'itemname', 'description'),
      createItem(1, 'itemname', 'description'),
    ],
    [],
  ],
  [
    [
      createItem(0, 'itemname', 'description'),
      createItem(1, 'itemname', 'description'),
      createItem(2, 'itemname', 'description'),
    ],
    [
      createItem(0, 'itemname', 'description'),
      createItem(2, 'itemname', 'description'),
      createItem(1, 'itemname', 'description'),
    ],
    [createChangeObj(2, MOVED, 2, 1)],
  ],
  [
    [
      createItem(0, 'itemname', 'description'),
      createItem(1, 'itemname', 'description'),
      createItem(2, 'itemname', 'description'),
    ],
    [
      createItem(0, 'itemname', 'description'),
      createItem(2, 'itemnameupdate', 'description'),
      createItem(1, 'itemname', 'description'),
    ],
    [createChangeObj(2, UPDATED, 2, 1), createChangeObj(2, MOVED, 2, 1)],
  ],
  [
    [
      createItem(0, 'itemname', 'description'),
      createItem(1, 'itemname', 'description'),
      createItem(2, 'itemname', 'description'),
      createItem(3, 'itemname', 'description'),
    ],
    [
      createItem(0, 'itemname', 'description'),
      createItem(2, 'itemnameupdate', 'description'),
      createItem(3, 'itemname', 'description'),
      createItem(1, 'itemname', 'description'),
    ],
    [
      createChangeObj(2, UPDATED, 2, 1),
      createChangeObj(3, MOVED, 3, 2),
      createChangeObj(2, MOVED, 2, 1),
    ],
  ],

  [
    [
      createItem(3, 'itemname', 'description'),
      createItem(0, 'itemname', 'description'),
      createItem(2, 'itemname', 'description'),
      createItem(1, 'itemname', 'description'),
    ],
    [
      createItem(0, 'itemname', 'description'),
      createItem(3, 'itemname', 'description'),
      createItem(1, 'itemname', 'description'),
      createItem(2, 'itemname', 'description'),
    ],

    [createChangeObj(1, MOVED, 3, 2), createChangeObj(0, MOVED, 1, 0)],
  ],
  [
    [
      createItem(0, 'itemname', 'description'),
      createItem(1, 'itemname', 'description'),
      createItem(2, 'itemname', 'description'),
      createItem(3, 'itemname', 'description'),
      createItem(4, 'itemname', 'description'),
      createItem(5, 'itemname', 'description'),
    ],
    [
      createItem(4, 'itemname', 'description'),
      createItem(0, 'itemname', 'description'),
      createItem(2, 'itemname', 'description'),
      createItem(3, 'itemname', 'description'),
      createItem(1, 'itemname', 'description'),
      createItem(5, 'itemname', 'description'),
    ],

    [createChangeObj(4, MOVED, 4, 0), createChangeObj(1, MOVED, 1, 4)],
  ],
  [
    [
      createItem(0, 'itemname', 'description'),
      createItem(1, 'itemname', 'description'),
      createItem(2, 'itemname', 'description'),
      createItem(3, 'itemname', 'description'),
      createItem(4, 'itemname', 'description'),
      createItem(5, 'itemname', 'description'),
    ],
    [
      createItem(4, 'itemname', 'description'),
      createItem(1, 'itemname', ''),
      createItem(6, 'itemname', 'description1'),
      createItem(0, 'itemname', 'description1'),
      createItem(2, 'itemname', 'description'),
      createItem(3, 'itemname', 'description'),
      createItem(5, 'itemname', 'description'),
    ],

    [
      createChangeObj(0, UPDATED, 0, 3),
      createChangeObj(1, UPDATED, 1, 1),
      createChangeObj(6, ADDED, null, 2),
      createChangeObj(4, MOVED, 4, 0),
      createChangeObj(0, MOVED, 0, 3),
    ],
  ],
  [
    [
      createItem(0, 'itemname', 'description'),
      createItem(1, 'itemname', 'description'),
    ],
    [
      createItem(0, 'itemname', 'description'),
      createItem(2, 'itemnameupdate', 'description'),
      createItem(1, 'itemname', 'description'),
    ],
    [createChangeObj(2, ADDED, null, 1)],
  ],
];

export const createDiffElementsPhases = [
  [
    [createPhase(0, 'itemname', 'description', [])],
    [createPhase(0, 'itemname', 'description', [])],
    [
      [
        createPhase(0, 'itemname', 'description', [], [], ''),

        createPhase(0, 'itemname', 'description', [], [], ''),
      ],
    ],
  ],
  [
    [createPhase(0, 'itemname', 'description', [])],
    [],
    [
      [
        createPhase(
          0,
          'itemname',
          'description',
          [],
          [
            {
              id: 0,
              localIdx: 0,
              remoteIdx: null,
              status: REMOVED,
            },
          ],
          REMOVED
        ),

        {},
      ],
    ],
  ],
  [
    [],
    [createPhase(0, 'itemname', 'description', [])],
    [
      [
        {},
        createPhase(
          0,
          'itemname',
          'description',
          [],
          [
            {
              id: 0,
              localIdx: null,
              remoteIdx: 0,
              status: ADDED,
            },
          ],
          ADDED
        ),
      ],
    ],
  ],
  [
    [createPhase(0, 'itemname', 'description', [])],
    [
      createPhase(0, 'itemname', 'description', [
        createItem(0, 'itemname', 'description', 'content'),
      ]),
    ],
    [
      [
        createPhase(0, 'itemname', 'description', [], [], ''),
        createPhase(
          0,
          'itemname',
          'description',
          [createItem(0, 'itemname', 'description', 'content')],
          [
            {
              id: 0,
              localIdx: 0,
              remoteIdx: 0,
              status: UPDATED,
            },
          ],
          UPDATED
        ),
      ],
    ],
  ],
  [
    [
      createPhase(0, 'itemname', 'description', [createItem(0, 'itemname')]),
      createPhase(1, 'itemname', 'description', []),
    ],
    [
      createPhase(0, 'itemname', 'description', [createItem(1, 'itemname')]),
      createPhase(1, 'itemname', 'description', []),
    ],
    [
      [
        createPhase(
          0,
          'itemname',
          'description',
          [createItem(0, 'itemname')],
          [],
          ''
        ),
        createPhase(
          0,
          'itemname',
          'description',
          [createItem(1, 'itemname')],
          [
            {
              id: 0,
              localIdx: 0,
              remoteIdx: 0,
              status: UPDATED,
            },
          ],
          UPDATED
        ),
      ],
      [
        createPhase(1, 'itemname', 'description', [], [], ''),
        createPhase(1, 'itemname', 'description', [], [], ''),
      ],
    ],
  ],
  [
    [
      createPhase(0, 'itemname', 'description', []),
      createPhase(1, 'itemname', 'description', []),
      createPhase(2, 'itemname', 'description', []),
    ],
    [
      createPhase(0, 'itemname', 'description', []),
      createPhase(2, 'itemname', 'description', []),
      createPhase(1, 'itemname', 'description', []),
    ],
    [
      [
        createPhase(0, 'itemname', 'description', [], [], ''),
        createPhase(0, 'itemname', 'description', [], [], ''),
      ],
      [
        {},
        createPhase(
          2,
          'itemname',
          'description',
          [],
          [
            {
              id: 2,
              localIdx: 2,
              remoteIdx: 1,
              status: MOVED,
            },
          ],
          MOVED
        ),
      ],
      [
        createPhase(1, 'itemname', 'description', [], [], ''),
        createPhase(1, 'itemname', 'description', [], [], ''),
      ],
      [
        createPhase(
          2,
          'itemname',
          'description',
          [],
          [
            {
              id: 2,
              localIdx: 2,
              remoteIdx: 1,
              status: MOVED,
            },
          ],
          MOVED
        ),
        {},
      ],
    ],
  ],
];

export const createDiffElementsItems = [
  [
    [createItem(0, 'itemname', 'description', 'content')],
    [createItem(0, 'itemname', 'description', 'content')],
    [
      [
        createItem(0, 'itemname', 'description', 'content', [], ''),

        createItem(0, 'itemname', 'description', 'content', [], ''),
      ],
    ],
  ],
  [
    [createItem(0, 'itemname', 'description', 'content')],
    [],
    [
      [
        createItem(
          0,
          'itemname',
          'description',
          'content',
          [
            {
              id: 0,
              localIdx: 0,
              remoteIdx: null,
              status: REMOVED,
            },
          ],
          REMOVED
        ),

        {},
      ],
    ],
  ],
  [
    [],
    [createItem(0, 'itemname', 'description', 'content')],
    [
      [
        {},
        createItem(
          0,
          'itemname',
          'description',
          'content',
          [
            {
              id: 0,
              localIdx: null,
              remoteIdx: 0,
              status: ADDED,
            },
          ],
          ADDED
        ),
      ],
    ],
  ],
  [
    [createItem(0, 'itemname', 'description', 'content')],
    [createItem(0, 'itemname', 'description', 'new content')],
    [
      [
        createItem(0, 'itemname', 'description', 'content', [], ''),
        createItem(
          0,
          'itemname',
          'description',
          'new content',
          [
            {
              id: 0,
              localIdx: 0,
              remoteIdx: 0,
              status: UPDATED,
            },
          ],
          UPDATED
        ),
      ],
    ],
  ],
  [
    [
      createItem(0, 'itemname', 'description', 'content'),
      createItem(1, 'itemname', 'description', 'new content'),
    ],
    [
      createItem(0, 'itemname', 'description', 'new content'),
      createItem(1, 'itemname', 'description', 'new content'),
    ],
    [
      [
        createItem(0, 'itemname', 'description', 'content', [], ''),
        createItem(
          0,
          'itemname',
          'description',
          'new content',
          [
            {
              id: 0,
              localIdx: 0,
              remoteIdx: 0,
              status: UPDATED,
            },
          ],
          UPDATED
        ),
      ],
      [
        createItem(1, 'itemname', 'description', 'new content', [], ''),
        createItem(1, 'itemname', 'description', 'new content', [], ''),
      ],
    ],
  ],
  [
    [
      createItem(0, 'itemname', 'description', 'content'),
      createItem(1, 'itemname', 'description', 'new content'),
      createItem(2, 'itemname', 'description', 'new content'),
    ],
    [
      createItem(0, 'itemname', 'description', 'content'),
      createItem(2, 'itemname', 'description', 'new content'),
      createItem(1, 'itemname', 'description', 'new content'),
    ],
    [
      [
        createItem(0, 'itemname', 'description', 'content', [], ''),
        createItem(0, 'itemname', 'description', 'content', [], ''),
      ],
      [
        {},
        createItem(
          2,
          'itemname',
          'description',
          'new content',
          [
            {
              id: 2,
              localIdx: 2,
              remoteIdx: 1,
              status: MOVED,
            },
          ],
          MOVED
        ),
      ],
      [
        createItem(1, 'itemname', 'description', 'new content', [], ''),
        createItem(1, 'itemname', 'description', 'new content', [], ''),
      ],
      [
        createItem(
          2,
          'itemname',
          'description',
          'new content',
          [
            {
              id: 2,
              localIdx: 2,
              remoteIdx: 1,
              status: MOVED,
            },
          ],
          MOVED
        ),
        {},
      ],
    ],
  ],
];
