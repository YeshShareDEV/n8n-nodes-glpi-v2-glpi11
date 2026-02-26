import type { INodeProperties } from 'n8n-workflow';

const showOnlyForAdministrationManagementGet = {
	operation: ['get'],
	resource: ['Administration Management'],
};

export const administrationManagementGetDescription: INodeProperties[] = [
	{
		displayName: 'User ID',
		name: 'itemId',
		type: 'number',
		displayOptions: {
			show: showOnlyForAdministrationManagementGet,
		},
		default: 0,
		description: 'ID of the user to retrieve. Leave empty to get all users.',
	},
	{
		displayName: 'GET /api.php/{ItemType} ou /api.php/{ItemType}/{ItemID}',
		name: 'administrationManagementGetNotice',
		type: 'notice',
		default: '',
		displayOptions: {
			show: showOnlyForAdministrationManagementGet,
		},
		description: 'GET sem ID retorna todos os usuários do tipo selecionado (ex: /api.php/Administration/User). GET com ID retorna um usuário específico (ex: /api.php/Administration/User/123).',
	},
];

