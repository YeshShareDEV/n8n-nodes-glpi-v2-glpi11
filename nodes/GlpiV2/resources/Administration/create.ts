import type { INodeProperties } from 'n8n-workflow';

export const administrationCreateDescription: INodeProperties[] = [
	{
		displayName: 'Item Type',
		name: 'itemtype',
		type: 'options',
		description: 'Select which Administration sub-resource to create',
		default: 'Administration/User',
		options: [
			{ name: 'Entity', value: 'Administration/Entity' },
			{ name: 'Group', value: 'Administration/Group' },
			{ name: 'Profile', value: 'Administration/Profile' },
			{ name: 'User', value: 'Administration/User' },
		],
		displayOptions: { show: { resource: ['Administration'], operation: ['create'] } },
	},

	// User create fields
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['Administration'], operation: ['create'], itemtype: ['Administration/User'] } },
	},
	{
		displayName: 'Entity',
		name: 'entities_id',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getEntities' },
		default: '',
		displayOptions: { show: { resource: ['Administration'], operation: ['create'], itemtype: ['Administration/User'] } },
		description: 'Entity to associate with the user',
	},
	{
		displayName: 'Profiles',
		name: 'profiles_id',
		type: 'multiOptions',
		typeOptions: { loadOptionsMethod: 'getProfiles' },
		default: [],
		displayOptions: { show: { resource: ['Administration'], operation: ['create'], itemtype: ['Administration/User'] } },
		description: 'Profiles to assign to the user',
	},
	{
		displayName: 'First Name',
		name: 'firstname',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['Administration'], operation: ['create'], itemtype: ['Administration/User'] } },
	},
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['Administration'], operation: ['create'], itemtype: ['Administration/User'] } },
	},
	{
		displayName: 'Password',
		name: 'password',
		type: 'string',
		typeOptions: { password: true },
		default: '',
		displayOptions: { show: { resource: ['Administration'], operation: ['create'], itemtype: ['Administration/User'] } },
	},

	// Group create fields
	{
		displayName: 'Group Name',
		name: 'groupName',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['Administration'], operation: ['create'], itemtype: ['Administration/Group'] } },
	},
	{
		displayName: 'Parent Groups',
		name: 'groups_id',
		type: 'multiOptions',
		typeOptions: { loadOptionsMethod: 'getGroups' },
		default: [],
		displayOptions: { show: { resource: ['Administration'], operation: ['create'], itemtype: ['Administration/Group'] } },
		description: 'Parent groups (optional)',
	},
	{
		displayName: 'Is Requester',
		name: 'is_requester',
		type: 'boolean',
		default: true,
		displayOptions: { show: { resource: ['Administration'], operation: ['create'], itemtype: ['Administration/Group'] } },
	},

	// Profile and Entity minimal fields
	{
		displayName: 'Label',
		name: 'label',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['Administration'], operation: ['create'], itemtype: ['Administration/Profile','Administration/Entity'] } },
	},

	// Generic input fallback
	{
		displayName: 'Input (raw)',
		name: 'input',
		type: 'json',
		default: '',
		description: 'Raw JSON payload when more specific fields are not shown',
		displayOptions: { show: { resource: ['Administration'], operation: ['create'] } },
	},
];
