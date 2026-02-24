import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSwaggerOauthRedirect = {
  resource: ['Swagger OAuth Redirect'],
};

export const swaggerOauthRedirectDescription: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: showOnlyForSwaggerOauthRedirect },
    options: [{ name: 'Redirect', value: 'redirect', action: 'Redirect' }],
    default: 'redirect',
  },
  {
    displayName: 'Notice',
    name: 'notice',
    type: 'notice',
    displayOptions: { show: showOnlyForSwaggerOauthRedirect },
    default: '',
    description: 'Placeholder for swagger OAuth redirect endpoint.',
  },
];
