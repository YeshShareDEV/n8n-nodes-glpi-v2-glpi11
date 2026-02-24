import type { INodeProperties } from 'n8n-workflow';

const showOnlyForAssets = {
  resource: ['Assets'],
};

export const assetsDescription: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: showOnlyForAssets },
    options: [
      { name: 'List', value: 'list', action: 'List assets' },
      { name: 'Get', value: 'get', action: 'Get asset' },
    ],
    default: 'list',
  },
  {
    displayName: 'Notice',
    name: 'notice',
    type: 'notice',
    displayOptions: { show: showOnlyForAssets },
    default: '',
    description: 'Placeholder for /Assets endpoints (e.g. /Assets/Computer).',
  },
];
