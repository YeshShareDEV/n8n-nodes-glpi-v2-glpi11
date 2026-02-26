import type { INodeProperties } from 'n8n-workflow';

const showOnlyForDoc = {
  resource: ['Doc'],
};

export const docDescription: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: showOnlyForDoc },
    options: [
      { name: 'Get Docs', value: 'getDocs', action: 'Get docs' },
    ],
    default: 'getDocs',
  },
  {
    displayName: 'Notice',
    name: 'notice',
    type: 'notice',
    displayOptions: { show: showOnlyForDoc },
    default: '',
    description: 'Placeholder for /doc and /doc.json endpoints.',
  },
];
