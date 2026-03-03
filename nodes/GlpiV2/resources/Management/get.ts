import type { INodeProperties } from 'n8n-workflow';

export const managementGetDescription: INodeProperties[] = [
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all items or limit the result',
		displayOptions: { show: { operation: ['get'], resource: ['Management'] } },
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		typeOptions: { minValue: 1 },
		displayOptions: { show: { operation: ['get'], returnAll: [false], resource: ['Management'] } },
		description: 'Limit number of items to return when Return All is false',
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add filter',
		default: {},
		displayOptions: { show: { operation: ['get'], resource: ['Management'] } },
		options: [
			{ displayName: 'Query', name: 'q', type: 'string', default: '' },
		],
	},
];
