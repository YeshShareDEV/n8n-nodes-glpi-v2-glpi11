import type { INodeProperties } from 'n8n-workflow';

export const projectUpdateDescription: INodeProperties[] = [
	{
		displayName: 'Project ID',
		name: 'projectId',
		required: true,
		type: 'string',
		default: '',
		displayOptions: { show: { operation: ['update'], resource: ['Project'] } },
	},
	{
		displayName: 'Data',
		name: 'data',
		type: 'collection',
		placeholder: 'Project fields to update',
		default: {},
		options: [
			{ displayName: 'Name', name: 'name', type: 'string', default: '' },
			{ displayName: 'Description', name: 'description', type: 'string', default: '' },
			{ displayName: 'Additional (JSON)', name: 'additional', type: 'string', default: '' },
		],
	},
];
