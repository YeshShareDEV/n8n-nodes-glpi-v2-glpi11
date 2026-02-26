import type { INodeProperties } from 'n8n-workflow';

const showOnlyForTransfer = {
  resource: ['Transfer'],
};

export const transferDescription: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: showOnlyForTransfer },
    options: [{ name: 'Get', value: 'get', action: 'Get' }],
    default: 'get',
  },
  {
    displayName: 'Notice',
    name: 'notice',
    type: 'notice',
    displayOptions: { show: showOnlyForTransfer },
    default: '',
    description: 'Placeholder for /Transfer endpoints.',
  },
];
