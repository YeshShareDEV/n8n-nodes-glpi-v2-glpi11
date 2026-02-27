import type { INodeProperties } from 'n8n-workflow';
import { componentsGetDescription } from './get';
import { componentsCreateDescription } from './create';
import { componentsUpdateDescription } from './update';
import { componentsDeleteDescription } from './delete';
import { componentsOptionsDescription } from './options';

const showOnlyForComponents = {
	resource: ['Components'],
};

export const componentsDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForComponents },
    
			{ name: 'Sound Card', value: 'SoundCard' },
			{ name: 'Systemboard', value: 'Systemboard' },
		],
		required: true,
		default: 'Memory',
		description: 'Type of component or definition',
	},
	{
		displayName: 'Item ID',
		name: 'itemid',
		type: 'number',
		placeholder: 'ID da definição ou instância',
		default: 1,
		typeOptions: { minValue: 1 },
		displayOptions: { show: { operation: ['get', 'update', 'delete'], resource: ['Components'] } },
		description: 'ID da definição ou instância (quando aplicável)',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: { show: { operation: ['get'], resource: ['Components'] } },
		default: false,
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		typeOptions: { minValue: 1 },
		displayOptions: { show: { operation: ['get'], returnAll: [false], resource: ['Components'] } },
		description: 'Limite de itens retornados quando Return All for false',
	},
	{
		displayName: 'Start',
		name: 'start',
		type: 'number',
		default: 0,
		typeOptions: { minValue: 0 },
		displayOptions: { show: { operation: ['get'], returnAll: [false], resource: ['Components'] } },
		description: 'Offset inicial (start) para paginação',
	},
	{
		displayName: 'Sort',
		name: 'sort',
		type: 'string',
		default: '',
		placeholder: 'e.g. id or name',
		displayOptions: { show: { operation: ['get'], returnAll: [false], resource: ['Components'] } },
		description: 'Campo para ordenar os resultados (ex: id, name)',
	},
	...componentsGetDescription,
	...componentsCreateDescription,
	...componentsUpdateDescription,
	...componentsDeleteDescription,
	...componentsOptionsDescription,
];
