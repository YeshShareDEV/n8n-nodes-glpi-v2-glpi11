import type { INodeProperties } from 'n8n-workflow';

const showOnlyForStatus = {
  resource: ['Status'],
};

export const statusDescription: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: showOnlyForStatus },
    options: [
      { name: 'Get All', value: 'getAll', action: 'Get all status' },
      { name: 'Get Service', value: 'getService', action: 'Get service status' },
    ],
    default: 'getAll',
  },
  {
    displayName: 'Notice',
    name: 'notice',
    type: 'notice',
    displayOptions: { show: showOnlyForStatus },
    default: '',
    description: 'Placeholder for /status endpoints.',
  },
];
