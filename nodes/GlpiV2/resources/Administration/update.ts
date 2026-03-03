import type { INodeProperties } from 'n8n-workflow';

export const administrationUpdateDescription: INodeProperties[] = [
	{
		displayName: 'Item Type',
		name: 'itemtype',
		type: 'options',
		description: 'Select which Administration sub-resource to update',
		default: 'Administration/User',
		options: [
			{ name: 'Entity', value: 'Administration/Entity' },
			{ name: 'Group', value: 'Administration/Group' },
			{ name: 'Profile', value: 'Administration/Profile' },
			{ name: 'User', value: 'Administration/User' },
		],
		displayOptions: { show: { resource: ['Administration'], operation: ['update'] } },
	},

	// Require Item ID for update (handled in index but help text here)
	{
		displayName: 'Notice',
		name: 'notice_update_admin',
		type: 'notice',
		default: '',
		displayOptions: { show: { resource: ['Administration'], operation: ['update'] } },
		description: 'UPDATE requires `Item ID`. Provide only the fields you want to change.',
	},

	// Updatable fields for User
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['Administration'], operation: ['update'], itemtype: ['Administration/User'] } },
	},
	{
		displayName: 'Entity',
		name: 'entities_id',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getEntities' },
		default: '',
		displayOptions: { show: { resource: ['Administration'], operation: ['update'], itemtype: ['Administration/User'] } },
		description: 'Entity to associate with the user',
	},
	{
		displayName: 'Profiles',
		name: 'profiles_id',
		type: 'multiOptions',
		typeOptions: { loadOptionsMethod: 'getProfiles' },
		default: [],
		displayOptions: { show: { resource: ['Administration'], operation: ['update'], itemtype: ['Administration/User'] } },
		description: 'Profiles to assign to the user',
	},
	{
		displayName: 'First Name',
		name: 'firstname',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['Administration'], operation: ['update'], itemtype: ['Administration/User'] } },
	},
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['Administration'], operation: ['update'], itemtype: ['Administration/User'] } },
	},

	// Updatable fields for Group
	{
		displayName: 'Group Name',
		name: 'groupName',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['Administration'], operation: ['update'], itemtype: ['Administration/Group'] } },
	},

	// Generic input fallback
	{
		displayName: 'Input (raw)',
		name: 'input',
		type: 'json',
		default: '',
		description: 'Raw JSON payload when more specific fields are not shown',
		displayOptions: { show: { resource: ['Administration'], operation: ['update'] } },
	},
];
