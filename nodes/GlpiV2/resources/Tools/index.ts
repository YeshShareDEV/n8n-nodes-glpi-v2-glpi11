import type { INodeProperties } from 'n8n-workflow';

const showOnlyForTools = {
  resource: ['Tools'],
};

export const toolsDescription: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: showOnlyForTools },
    options: [
      { name: 'List', value: 'list', action: 'List tools' },
      { name: 'Get', value: 'get', action: 'Get tool' },
    ],
    default: 'list',
  },
  {
    displayName: 'Notice',
    name: 'notice',
    type: 'notice',
    displayOptions: { show: showOnlyForTools },
    default: '',
    description: 'Placeholder for /Tools endpoints (Reminder, RSSFeed, etc.).',
  },
];
