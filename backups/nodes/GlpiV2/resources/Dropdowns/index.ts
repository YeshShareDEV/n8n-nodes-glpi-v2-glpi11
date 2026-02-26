import type { INodeProperties } from 'n8n-workflow';

const showOnlyForDropdowns = {
  resource: ['Dropdowns'],
};

export const dropdownsDescription: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: showOnlyForDropdowns },
    options: [{ name: 'List', value: 'list', action: 'List dropdowns' }],
    default: 'list',
  },
  {
    displayName: 'Notice',
    name: 'notice',
    type: 'notice',
    displayOptions: { show: showOnlyForDropdowns },
    default: '',
    description: 'Placeholder for /Dropdowns endpoints (Location, State, Manufacturer...).',
  },
];
