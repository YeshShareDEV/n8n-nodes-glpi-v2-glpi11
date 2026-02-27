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
    
		default: 0,
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
		displayName: 'Start',
		name: 'start',
		type: 'number',
		default: 0,
		typeOptions: { minValue: 0 },
		displayOptions: { show: { operation: ['list'], returnAll: [false], resource: ['Dropdowns'] } },
		description: 'Offset inicial (start) para paginação',
	},
	{
		displayName: 'Sort',
		name: 'sort',
		type: 'string',
		default: '',
		placeholder: 'e.g. id or name',
		displayOptions: { show: { operation: ['list'], returnAll: [false], resource: ['Dropdowns'] } },
		description: 'Campo para ordenar os resultados (ex: id, name)',
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
