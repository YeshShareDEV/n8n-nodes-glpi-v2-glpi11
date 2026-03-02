import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IHttpRequestMethods,
	IHttpRequestOptions,
	IDataObject,
} from 'n8n-workflow';
import { NodeConnectionTypes, ApplicationError, NodeOperationError } from 'n8n-workflow';
import { administrationDescription } from './resources/Administration';
import { AssetsDescription } from './resources/Assets';

// Garante e normaliza a base URL terminando em /api.php
function buildBaseUrl(host?: string) {
	let baseUrl = (host || '').trim();

	if (baseUrl.length === 0) return '';

	// Ensure scheme for URL parsing
	if (!/^https?:\/\//i.test(baseUrl)) {
		baseUrl = `https://${baseUrl}`;
	}

	try {
		// Avoid relying on the global URL constructor or require('url') to keep
		// TypeScript builds portable. Parse origin and path with regex.
		const originMatch = baseUrl.match(/^(https?:\/\/[^\/]+)/i);
		const origin = originMatch ? originMatch[1] : '';

		// Find /api.php or /apirest.php in the provided URL (case-insensitive)
		const apiMatch = baseUrl.match(/\/(?:apirest|api)\.php/i);
		if (origin) {
			if (apiMatch) {
				return `${origin}${apiMatch[0]}`;
			}
			return `${origin}/api.php`;
		}

		// If we couldn't extract origin, fall back to a safe heuristic
		baseUrl = baseUrl.replace(/\/apirest\.php\/?/i, '');
		baseUrl = baseUrl.replace(/\/+$/g, '');
		if (!baseUrl.endsWith('/api.php')) {
			baseUrl = `${baseUrl}/api.php`;
		}
		return baseUrl;
	} catch (e) {
		baseUrl = baseUrl.replace(/\/apirest\.php\/?/i, '');
		baseUrl = baseUrl.replace(/\/+$/g, '');
		if (!baseUrl.endsWith('/api.php')) {
			baseUrl = `${baseUrl}/api.php`;
		}
		return baseUrl;
	}
}

// Faz a solicitação do token (login) por password grant
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
					{ name: 'Administration', value: 'Administration' },
					{ name: 'Assets', value: 'Assets' },
				],
				default: 'Assets',
			},
			{
				displayName: 'Show Credentials Only',
				name: 'showCredentials',
				type: 'boolean',
				default: false,
				description: 'If enabled, the node will output the configured credentials and skip any API requests.',
			},

			// 'Limit' field removed from main node properties.
			...administrationDescription,
			...AssetsDescription,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const creds = await this.getCredentials('glpiV2Api');

		const baseUrl = buildBaseUrl(creds.host as string);

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				const resource = this.getNodeParameter('resource', itemIndex) as string;
				const operation = this.getNodeParameter('operation', itemIndex) as string;

				// Determina o itemtype baseado no resource e operation
				let itemtype: string = (this.getNodeParameter('itemtype', itemIndex) as string) || '';

				// Support Assets and Administration: prefix itemtype with the resource when needed.
				if (itemtype && (resource === 'Assets' || resource === 'Administration') && !itemtype.includes('/')) {
					itemtype = `${resource}/${itemtype}`;
				}

				let options: IHttpRequestOptions;

				// Normaliza a operation para get/create/update
				let normalizedOperation = operation;
				if (operation === 'getGroup' || operation === 'getProfile') {
					normalizedOperation = 'get';
				} else if (operation === 'createGroup' || operation === 'createProfile') {
					normalizedOperation = 'create';
				} else if (operation === 'updateGroup' || operation === 'updateProfile') {
					normalizedOperation = 'update';
				}

				// Read pagination parameters when available in the node UI
				const returnAll = this.getNodeParameter('returnAll', itemIndex, true) as boolean;

				let token = '';
				try {
					token = await getOAuthToken.call(
						this,
						baseUrl,
						creds.clientId as string,
						creds.clientSecret as string,
						creds.username as string,
						creds.password as string,
						(creds.scope as string) || undefined,
					);
				} catch (err) {
					if (this.continueOnFail()) {
						returnData.push({
							json: { error: err instanceof Error ? err.message : String(err) },
							pairedItem: { item: itemIndex },
						});
						continue;
					}
					throw err;
				}

				const headers: { [key: string]: string } = {
					Authorization: `Bearer ${token}`,
				};

				if (normalizedOperation === 'get') {
					const id = this.getNodeParameter('itemid', itemIndex, '') as string | number;

					// Ensure Assets prefix
					if (itemtype && !itemtype.includes('/')) itemtype = `Assets/${itemtype}`;

					// Build URL and apply pagination query params when an ID is not requested
					let url = `${baseUrl}/${itemtype}${id ? '/' + id : ''}`;
					if (!id && returnAll === false) {
						const params: string[] = [];

						// Only include limit
						const limit = this.getNodeParameter('limit', itemIndex, 10) as number;
						params.push(`limit=${limit}`);

						if (params.length) {
							url += (url.includes('?') ? '&' : '?') + params.join('&');
						}
					}

					options = {
						method: 'GET' as IHttpRequestMethods,
						url,
						headers,
						json: true,
					};
				} else if (normalizedOperation === 'create') {
					if (itemtype && !itemtype.includes('/')) itemtype = `Assets/${itemtype}`;
					const input = this.getNodeParameter('input', itemIndex, {}) as IDataObject;

					options = {
						method: 'POST' as IHttpRequestMethods,
						url: `${baseUrl}/${itemtype}`,
						headers,
						body: { input },
						json: true,
					};
				} else if (normalizedOperation === 'update') {
					const id = this.getNodeParameter('itemid', itemIndex);
					if (itemtype && !itemtype.includes('/')) itemtype = `Assets/${itemtype}`;
					const input = this.getNodeParameter('input', itemIndex, {}) as IDataObject;

					options = {
						method: 'PUT' as IHttpRequestMethods,
						url: `${baseUrl}/${itemtype}/${id}`,
						headers,
						body: { input },
						json: true,
					};
				} else if (operation === 'delete') {
					const id = this.getNodeParameter('itemid', itemIndex);
					if (itemtype && !itemtype.includes('/')) itemtype = `Assets/${itemtype}`;
					options = {
						method: 'DELETE' as IHttpRequestMethods,
						url: `${baseUrl}/${itemtype}/${id}`,
						headers,
						json: true,
					};
				} else {
					throw new ApplicationError(`Unknown operation: ${operation}`, { level: 'warning' });
				}

				const showCredentials = this.getNodeParameter('showCredentials', itemIndex, false) as boolean;

				// ensure Content-Type only when body is present
				if (options && (options as IHttpRequestOptions).body !== undefined) {
					options.headers = {
						...(options.headers || {}),
						'Content-Type': 'application/json',
					};
				}

				if (showCredentials) {
					returnData.push({
						json: {
							host: creds.host,
							baseUrl,
							clientId: creds.clientId,
							clientSecret: creds.clientSecret,
							username: creds.username,
							password: creds.password,
							scope: creds.scope,
						},
						pairedItem: { item: itemIndex },
					});
				} else {
					// Execute the prepared request and return the response
						const response = await this.helpers.httpRequest(options as any);
						// If the API returned an array, push each element as a separate output row
						if (Array.isArray(response)) {
							let outputArray = response;

							// No local sort applied (sorting removed)

							if (returnAll === false) {
								const limit = this.getNodeParameter('limit', itemIndex, 10) as number;
								// start is intentionally not used when server-side pagination is applied
								outputArray = outputArray.slice(0, limit);
							}

							for (const resItem of outputArray) {
								returnData.push({
									json: resItem,
									pairedItem: { item: itemIndex },
								});
							}
						} else {
							returnData.push({
								json: response,
								pairedItem: { item: itemIndex },
							});
						}
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: error instanceof Error ? error.message : String(error) },
						pairedItem: { item: itemIndex },
					});
				} else {
					throw new NodeOperationError(this.getNode(), error as Error, { itemIndex });
				}
			}
		}

		return returnData.length ? [returnData] : [];
	}
}

