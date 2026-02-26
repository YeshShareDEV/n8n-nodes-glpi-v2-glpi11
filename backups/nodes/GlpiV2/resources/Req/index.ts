import type { INodeProperties } from 'n8n-workflow';

const showOnlyForReq = {
  resource: ['Req'],
};

export const reqDescription: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: showOnlyForReq },
    options: [{ name: 'Get', value: 'get', action: 'Get' }],
    default: 'get',
  },
  {
    displayName: 'Notice',
    name: 'notice',
    type: 'notice',
    displayOptions: { show: showOnlyForReq },
    default: '',
    description: 'Placeholder for /{req} endpoints.',
  },
];
