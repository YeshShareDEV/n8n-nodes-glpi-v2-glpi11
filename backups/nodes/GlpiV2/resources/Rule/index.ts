import type { INodeProperties } from 'n8n-workflow';

const showOnlyForRule = {
  resource: ['Rule'],
};

export const ruleDescription: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: showOnlyForRule },
    options: [{ name: 'List', value: 'list', action: 'List rules' }],
    default: 'list',
  },
  {
    displayName: 'Notice',
    name: 'notice',
    type: 'notice',
    displayOptions: { show: showOnlyForRule },
    default: '',
    description: 'Placeholder for /Rule endpoints (collections, criteria, actions).',
  },
];
