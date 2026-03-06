import type { INodeProperties } from 'n8n-workflow';

export const AssetUpdateDescription: INodeProperties[] = [
	{
		displayName: 'Input (raw)',
		name: 'input',
		type: 'json',
		default: {
			id: 0,
			name: 'Updated Asset',
			serial: '123456',
			comments: 'Updated via n8n',
		},
		description: 'Raw JSON payload for updating an Asset. When Send raw body is enabled this object will be sent as the request body.',
		displayOptions: { show: { operation: ['update'], resource: ['Assets'] } },
	},

	{
		displayName: 'Send raw body',
		name: 'sendRawBody',
		type: 'boolean',
		default: true,
		description: 'When enabled, the JSON provided in "Input (raw)" will be sent as the request body exactly as-is (no wrapper { input }).',
		displayOptions: { show: { operation: ['update'], resource: ['Assets'] } },
	},
];
