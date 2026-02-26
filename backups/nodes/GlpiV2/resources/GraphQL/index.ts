import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGraphQL = {
  resource: ['GraphQL'],
};

export const graphQLDescription: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: showOnlyForGraphQL },
    options: [
      { name: 'Query', value: 'query', action: 'Run GraphQL query' },
      { name: 'Schema', value: 'schema', action: 'Get schema' },
    ],
    default: 'query',
  },
  {
    displayName: 'Notice',
    name: 'notice',
    type: 'notice',
    displayOptions: { show: showOnlyForGraphQL },
    default: '',
    description: 'Placeholder for /GraphQL and /GraphQL/Schema endpoints.',
  },
];
