import type { INodeProperties } from 'n8n-workflow';

const showOnlyForProject = {
  resource: ['Project'],
};

export const projectDescription: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: showOnlyForProject },
    options: [
      { name: 'List Projects', value: 'list', action: 'List projects' },
      { name: 'Get Project', value: 'get', action: 'Get project' },
    ],
    default: 'list',
  },
  {
    displayName: 'Notice',
    name: 'notice',
    type: 'notice',
    displayOptions: { show: showOnlyForProject },
    default: '',
    description: 'Placeholder for /Project endpoints and subroutes (Task, Task/{id}).',
  },
];
