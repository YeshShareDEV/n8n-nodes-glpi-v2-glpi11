import type { INodeProperties } from 'n8n-workflow';
import { assistanceGetDescription } from './get';
import { assistanceCreateDescription } from './create';
import { assistanceUpdateDescription } from './update';
import { assistanceDeleteDescription } from './delete';
import { assistanceOptionsDescription } from './options';

const showOnlyForAssistance = {
	resource: ['Assistance'],
};

export const assistanceDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForAssistance },
    
		displayOptions: {
			show: { operation: ['get', 'update', 'delete'], resource: ['Assistance'] },
		},
		description: 'ID do item. Deixe vazio para listar todos (aplicável ao GET).',
		default: 0,
	},
	{
		displayName: 'Include Timeline',
		name: 'includeTimeline',
		type: 'boolean',
		displayOptions: { show: { operation: ['get'], resource: ['Assistance'] } },
		default: false,
		description: 'Include timeline items (Document, Followup, Solution, Task, Validation)',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: { show: { operation: ['get'], resource: ['Assistance'] } },
		default: false,
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		typeOptions: { minValue: 1 },
		displayOptions: { show: { operation: ['get'], returnAll: [false], resource: ['Assistance'] } },
		description: 'Limite de itens retornados quando Return All for false',
	},
	{
		displayName: 'Start',
		name: 'start',
		type: 'number',
		default: 0,
		typeOptions: { minValue: 0 },
		displayOptions: { show: { operation: ['get'], returnAll: [false], resource: ['Assistance'] } },
		description: 'Offset inicial (start) para paginação',
	},
	{
		displayName: 'Sort',
		name: 'sort',
		type: 'string',
		default: '',
		placeholder: 'e.g. id or name',
		displayOptions: { show: { operation: ['get'], returnAll: [false], resource: ['Assistance'] } },
		description: 'Campo para ordenar os resultados (ex: id, name)',
	},
	...assistanceGetDescription,
	...assistanceCreateDescription,
	...assistanceUpdateDescription,
	...assistanceDeleteDescription,
	...assistanceOptionsDescription,
];
