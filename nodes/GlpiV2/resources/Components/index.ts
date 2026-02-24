import type { INodeProperties } from 'n8n-workflow';

const showOnlyForComponents = {
  resource: ['Components'],
};

export const componentsDescription: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: showOnlyForComponents },
    options: [{ name: 'List', value: 'list', action: 'List components' }],
    default: 'list',
  },
  {
    displayName: 'Notice',
    name: 'notice',
    type: 'notice',
    displayOptions: { show: showOnlyForComponents },
    default: '',
    description: 'Placeholder for /Components endpoints (Battery, Camera, etc.).',
  },
];
