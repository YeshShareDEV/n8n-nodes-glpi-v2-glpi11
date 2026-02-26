import type { INodeProperties } from 'n8n-workflow';

const showOnlyForManagementGet = {
	operation: ['get'],
	resource: ['Management'],
};

export const managementGetDescription: INodeProperties[] = [
    {
		displayName: 'Item ID',
		name: 'itemId',
		type: 'number',
		displayOptions: {
			show: showOnlyForManagementGet,
		},
		default: 0,
		description: 'ID of the administration item to retrieve. Leave empty to get all items of the selected type.',
	},
	{
		displayName: '/api.php/{ItemType}/{ItemID}',
		name: 'administrationManagementGetNotice',
		type: 'notice',
		default: '',
		displayOptions: {
			show: showOnlyForManagementGet,
		},
			description: 'GET sem ID retorna todos os itens do tipo selecionado (ex: /api.php/Management/User). GET com ID retorna um item específico (ex: /api.php/Management/User/123).',
	},
];

