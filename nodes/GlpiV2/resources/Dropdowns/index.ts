import type { INodeProperties } from 'n8n-workflow';
import { dropdownsGetDescription } from './get';
import { dropdownsCreateDescription } from './create';
import { dropdownsUpdateDescription } from './update';
import { dropdownsDeleteDescription } from './delete';
import { dropdownsOptionsDescription } from './options';
    
const showOnlyForDropdowns = { resource: ['Dropdowns'] };

export const dropdownsDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForDropdowns },
		options: [
			{ name: 'Get', value: 'get', action: 'Get a dropdown' },
			{ name: 'Create', value: 'create', action: 'Create a dropdown' },
			{ name: 'Update', value: 'update', action: 'Update a dropdown' },
			{ name: 'Delete', value: 'delete', action: 'Delete a dropdown' },
		],
		default: 'get',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: { show: { operation: ['list'], resource: ['Dropdowns'] } },
		default: false,
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		typeOptions: { minValue: 1 },
		displayOptions: { show: { operation: ['list'], returnAll: [false], resource: ['Dropdowns'] } },
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: { show: { operation: ['list'], resource: ['Dropdowns'] } },
		default: false,
	},
	{
		displayName: 'Data Form',
		name: 'dataForm',
		type: 'collection',
		placeholder: 'Add fields',
		default: {},
		displayOptions: { show: { operation: ['create', 'update'], resource: ['Dropdowns'] } },
		options: [
			{ displayName: 'Name', name: 'name', type: 'string', default: '' },
			{ displayName: 'Value', name: 'value', type: 'string', default: '' },
		],
	},
	...dropdownsGetDescription,
	...dropdownsCreateDescription,
	...dropdownsUpdateDescription,
	...dropdownsDeleteDescription,
	...dropdownsOptionsDescription,
];
