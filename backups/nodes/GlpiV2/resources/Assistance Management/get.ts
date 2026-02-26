import type { INodeProperties } from 'n8n-workflow';

const showOnlyForAssistanceManagementGet = {
	operation: ['get'],
	resource: ['Assistance Management'],
};

export const assistanceManagementGetDescription: INodeProperties[] = [
	{
		displayName: 'Item ID',
		name: 'itemId',
		type: 'number',
		displayOptions: {
			show: showOnlyForAssistanceManagementGet,
		},
		default: 0,
		description:
			'ID of the ITIL object to retrieve. Leave empty to list all objects.',
	},
	{
		displayName: 'GET /api.php/{ItemType} ou /api.php/{ItemType}/{ItemID}',
		name: 'itilObjectsGetNotice',
		type: 'notice',
		default: '',
		displayOptions: {
			show: showOnlyForAssistanceManagementGet,
		},
		description:
			'GET sem ID retorna todos os objetos do tipo selecionado (ex: /api.php/Assistance/Ticket). GET com ID retorna um objeto específico (ex: /api.php/Assistance/Ticket/123).',
	},
];