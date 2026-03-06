import type { INodeProperties } from 'n8n-workflow';

export const AssetCreateDescription: INodeProperties[] = [
	{
		displayName: 'Input (raw)',
		name: 'input',
		type: 'json',
		default: {
			name: 'New Asset',
			serial: '123456',
			entities_id: 0,
			is_deleted: false,
			comments: 'Created via n8n',
		},
		description: 'Raw JSON payload for creating an Asset. When Send raw body is enabled this object will be sent as the request body.',
		displayOptions: { show: { operation: ['create'], resource: ['Assets'] } },
	},

	{
		displayName: 'Send raw body',
		name: 'sendRawBody',
		type: 'boolean',
		default: true,
		description: 'When enabled, the JSON provided in "Input (raw)" will be sent as the request body exactly as-is (no wrapper { input }).',
		displayOptions: { show: { operation: ['create'], resource: ['Assets'] } },
	},
];
