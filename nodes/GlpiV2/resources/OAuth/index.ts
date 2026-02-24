import type { INodeProperties } from 'n8n-workflow';

const showOnlyForOAuth = {
  resource: ['OAuth'],
};

export const oauthDescription: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: showOnlyForOAuth },
    options: [
      { name: 'Authorize', value: 'authorize', action: 'Authorize' },
      { name: 'Token', value: 'token', action: 'Token' },
    ],
    default: 'authorize',
  },
  {
    displayName: 'Notice',
    name: 'notice',
    type: 'notice',
    displayOptions: { show: showOnlyForOAuth },
    default: '',
    description: 'Placeholder for /authorize and /token endpoints.',
  },
];
