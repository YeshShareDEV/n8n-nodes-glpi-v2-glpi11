import type { INodeProperties } from 'n8n-workflow';

const showOnlyForAssetManagementGet = {
	operation: ['get'],
	resource: ['Asset Management'],
};

export const AssetManagementGetDescription: INodeProperties[] = [
	{
		displayName: 'Item ID',
		name: 'itemId',
		type: 'number',
		displayOptions: {
			show: showOnlyForAssetManagementGet,
		},
		default: 0,
		description: 'ID of the asset to retrieve. Leave empty to get all assets of the selected type.',
	},
	{
		displayName: 'GET /api.php/{ItemType} ou /api.php/{ItemType}/{ItemID}',
		name: 'assetManagementGetNotice',
		type: 'notice',
		default: '',
		displayOptions: {
			show: showOnlyForAssetManagementGet,
		},
		description: 'GET sem ID retorna todos os ativos do tipo selecionado (ex: /api.php/Asset/Computer). GET com ID retorna um ativo específico (ex: /api.php/Asset/Computer/123).',
	},
];

