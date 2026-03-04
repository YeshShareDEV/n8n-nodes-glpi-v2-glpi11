import type { INodeProperties } from 'n8n-workflow';

export const ruleUpdateDescription: INodeProperties[] = [
	{
		displayName: 'Rule ID',
		name: 'ruleId',
		type: 'string',
		default: '',
		required: true,
		description: 'ID of the rule to update',
		displayOptions: { show: { operation: ['update'], resource: ['Rule'] } },
	},
	{
		displayName: 'Collection',
		name: 'collection',
		type: 'string',
		default: '',
		displayOptions: { show: { operation: ['update'], resource: ['Rule'] } },
	},
	{
		displayName: 'Data',
		name: 'data',
		type: 'collection',
		placeholder: 'Fields to update',
		default: {},
		displayOptions: { show: { operation: ['update'], resource: ['Rule'] } },
		options: [
			{ displayName: 'Name', name: 'name', type: 'string', default: '' },
			{ displayName: 'Actions (JSON)', name: 'actions', type: 'string', default: '' },
			{ displayName: 'Criteria (JSON)', name: 'criteria', type: 'string', default: '' },
		],
	},
];
