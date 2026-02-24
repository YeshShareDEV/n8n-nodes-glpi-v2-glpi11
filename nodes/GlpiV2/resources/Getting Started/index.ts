import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGettingStarted = {
  resource: ['Getting Started'],
};

export const gettingStartedDescription: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: showOnlyForGettingStarted },
    options: [{ name: 'Get', value: 'get', action: 'Get' }],
    default: 'get',
  },
  {
    displayName: 'Notice',
    name: 'notice',
    type: 'notice',
    displayOptions: { show: showOnlyForGettingStarted },
    default: '',
    description: 'Placeholder for /getting-started endpoint.',
  },
];
