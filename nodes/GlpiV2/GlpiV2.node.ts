import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IHttpRequestMethods,
	IHttpRequestOptions,
	IDataObject,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError, ApplicationError, LoggerProxy } from 'n8n-workflow';
import { assistanceManagementDescription } from './resources/Assistance Management';
import { administrationManagementDescription } from './resources/Administration Management';
import { AssetManagementDescription } from './resources/Asset Management';
import { managementDescription } from './resources/Management';
import { otherActionsDescription } from './resources/Other Actions';
import { toolManagementDescription } from './resources/Tool Management';
import { setupManagementDescription } from './resources/Setup Management';

// 🔐 Função utilitária para obter token OAuth
// O endpoint /api.php/token retorna o session_token (ou access_token que funciona como tal)
async function getOAuthToken(
	this: IExecuteFunctions,
	baseUrl: string,
	clientId: string,
	clientSecret: string,
	username: string,
	password: string,
	scope?: string,
): Promise<string> {
	try {
		const response = await this.helpers.httpRequest({
			method: 'POST',
			url: `${baseUrl}/token`,
			headers: {
				'Content-Type': 'application/json',
			},
			body: {
				grant_type: 'password',
				client_id: clientId,
				client_secret: clientSecret,
				username,
				password,
				scope,
			},
			json: true,
		});

		// Na V2 o retorno costuma ser { session_token: "..." } ou { access_token: "..." }
		// Ajustar conforme o retorno real da API V2 do GLPI
		const token = response?.session_token || response?.access_token;

		if (!token) {
			throw new ApplicationError('Failed to login to GLPI: session_token/access_token not found in response', {
				level: 'warning',
			});
		}

		return token;
	} catch (error) {
		if (error && typeof error === 'object' && 'response' in error) {
			const httpError = error as { response: { status: number; statusText: string } };
			throw new ApplicationError(
				`Failed to login to GLPI: ${httpError.response.status} ${httpError.response.statusText}. Check your credentials and URL.`,
				{ level: 'error' },
			);
		}
		const errorMessage = error instanceof Error ? error.message : String(error);
		throw new ApplicationError(`Failed to login to GLPI: ${errorMessage}`, { level: 'error' });
	}
}

export class GlpiV2 implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'GLPI Rest API V2 (Fork)',
		name: 'glpiV2Fork',
		icon: 'file:glpi_v2.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'GLPI Rest API Node compatible with GLPI 9.x and above.',
		defaults: {
			name: 'GLPI Rest API V2',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		// eslint-disable-next-line @n8n/community-nodes/no-credential-reuse
		credentials: [{ name: 'glpiV2Api', required: true }],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Administration Management',
						value: 'Administration Management',
					},
					{
						name: 'Asset Management',
						value: 'Asset Management',
					},
					{
						name: 'Assistance Management',
						value: 'Assistance Management',
					},
					{
						name: 'Management',
						value: 'Management',
					},
					{
						name: 'Other Action',
						value: 'Other Actions',
					},
					{
						name: 'Setup Management',
						value: 'Setup Management',
					},
					{
						name: 'Tool Management',
						value: 'Tool Management',
					},
				],
				default: 'Assistance Management',
			},
			{
				displayName: 'Show Credentials Only',
				name: 'showCredentials',
				type: 'boolean',
				default: false,
				description: 'If enabled, the node will output the configured credentials and skip any API requests.',
			},
			...assistanceManagementDescription,
			...administrationManagementDescription,
			...AssetManagementDescription,
			...managementDescription,
			...otherActionsDescription,
			...toolManagementDescription,
			...setupManagementDescription,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			// Skip any HTTP requests — only display the configured credentials.
			returnData.push({
				json: {
					host: creds.host,
					clientId: creds.clientId,
					clientSecret: creds.clientSecret,
					username: creds.username,
					password: creds.password,
					scope: creds.scope,
				},
				pairedItem: { item: itemIndex },
			});
		}
		return [returnData];
					});
				} else {
					throw new NodeOperationError(this.getNode(), error, {
						itemIndex,
					});
				}
			}
		}
		return [returnData];
	}
}

