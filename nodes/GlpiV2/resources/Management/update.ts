import type { INodeProperties } from 'n8n-workflow';

export const managementUpdateDescription: INodeProperties[] = [
	{
		displayName: 'Data',
		name: 'data',
		type: 'collection',
		placeholder: 'Add fields to update',
		default: {},
		displayOptions: { show: { operation: ['update'], resource: ['Management'] } },
		options: [
			{ displayName: 'Name', name: 'name', type: 'string', default: '' },
			{ displayName: 'Value', name: 'value', type: 'string', default: '' },
			{ displayName: 'Additional Data (JSON)', name: 'additional', type: 'string', default: '', description: 'Free-form JSON string for extra fields' },
		],
	},
];
