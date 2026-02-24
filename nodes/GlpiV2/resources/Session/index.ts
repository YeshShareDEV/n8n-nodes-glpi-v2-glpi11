import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSession = {
  resource: ['Session'],
};

export const sessionDescription: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: showOnlyForSession },
    options: [{ name: 'Create', value: 'create', action: 'Create session' }],
    default: 'create',
  },
  {
    displayName: 'Notice',
    name: 'notice',
    type: 'notice',
    displayOptions: { show: showOnlyForSession },
    default: '',
    description: 'Placeholder for /session endpoints.',
  },
];
