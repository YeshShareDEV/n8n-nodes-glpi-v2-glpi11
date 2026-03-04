import type { INodeProperties } from 'n8n-workflow';

export const projectCreateDescription: INodeProperties[] = [
	{
		displayName: 'Data',
		name: 'data',
		type: 'collection',
		placeholder: 'Project data',
		default: {},
		displayOptions: { show: { operation: ['create'], resource: ['Project'] } },
		options: [
			{ displayName: 'Name', name: 'name', type: 'string', default: '' },
			{ displayName: 'Description', name: 'description', type: 'string', default: '' },
			{ displayName: 'Additional (JSON)', name: 'additional', type: 'string', default: '' },
		],
	},
];
