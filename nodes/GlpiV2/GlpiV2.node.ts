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
					const input: IDataObject = {};

					if (resource === 'Administration') {
						if (itemtype.endsWith('/User')) {
							input.name = this.getNodeParameter('name', itemIndex) as string;

							const firstname = this.getNodeParameter('firstname', itemIndex, '') as string;
							if (firstname) input.firstname = firstname;

							input.is_active = this.getNodeParameter('is_active', itemIndex, true) ? 1 : 0;
							input.entities_id = this.getNodeParameter('entities_id', itemIndex, 0) as number;

							const emailPassword = this.getNodeParameter('email_password', itemIndex, true) as boolean;
							if (!emailPassword) {
								const password = this.getNodeParameter('password', itemIndex, '') as string;
								if (password) input.password = password;
							}

							const email = this.getNodeParameter('email', itemIndex, '') as string;
							if (email) input._useremails = [email];

							const optionsParam = this.getNodeParameter('options', itemIndex, {}) as IDataObject;
							if (optionsParam.is_recursive !== undefined) input.is_recursive = optionsParam.is_recursive ? 1 : 0;
							if (optionsParam.profiles_id) input.profiles_id = optionsParam.profiles_id;
							if (optionsParam.phone) input.phone = optionsParam.phone;
							if (optionsParam.mobile) input.mobile = optionsParam.mobile;
							if (optionsParam.realname) input.realname = optionsParam.realname;
						} else if (itemtype.endsWith('/Group')) {
							input.name = this.getNodeParameter('name', itemIndex) as string;
							input.is_requester = this.getNodeParameter('is_requester', itemIndex, true) ? 1 : 0;
							input.is_watcher = this.getNodeParameter('is_watcher', itemIndex, true) ? 1 : 0;
							input.is_notify = this.getNodeParameter('is_notify', itemIndex, true) ? 1 : 0;
							input.is_usergroup = this.getNodeParameter('is_usergroup', itemIndex, true) ? 1 : 0;

							const optionsParam = this.getNodeParameter('options', itemIndex, {}) as IDataObject;
							if (optionsParam.code) input.code = optionsParam.code;
							if (optionsParam.recursive_membership !== undefined) input.recursive_membership = optionsParam.recursive_membership ? 1 : 0;
							if (optionsParam.groups_id) input.groups_id = optionsParam.groups_id;
							if (optionsParam.comment) input.comment = optionsParam.comment;
							if (optionsParam.is_manager !== undefined) input.is_manager = optionsParam.is_manager ? 1 : 0;
							if (optionsParam.is_assign !== undefined) input.is_assign = optionsParam.is_assign ? 1 : 0;
							if (optionsParam.is_task !== undefined) input.is_task = optionsParam.is_task ? 1 : 0;
						} else {
							Object.assign(input, this.getNodeParameter('input', itemIndex, {}) as IDataObject);
						}
					} else {
						Object.assign(input, this.getNodeParameter('input', itemIndex, {}) as IDataObject);
					}

					options = {
						method: 'POST' as IHttpRequestMethods,
						url: `${baseUrl}/${itemtype}`,
						headers,
						body: { input },
						json: true,
					};
				} else if (normalizedOperation === 'update') {
					const id = this.getNodeParameter('itemid', itemIndex);
					const input: IDataObject = {};

					if (resource === 'Administration') {
						if (itemtype.endsWith('/User')) {
							const name = this.getNodeParameter('name', itemIndex, '') as string;
							if (name) input.name = name;

							const firstname = this.getNodeParameter('firstname', itemIndex, '') as string;
							if (firstname) input.firstname = firstname;

							const email = this.getNodeParameter('email', itemIndex, '') as string;
							if (email) input._useremails = [email];

							const isActive = this.getNodeParameter('is_active', itemIndex, undefined) as boolean | undefined;
							if (isActive !== undefined) input.is_active = isActive ? 1 : 0;

							const entitiesId = this.getNodeParameter('entities_id', itemIndex, 0) as number;
							if (entitiesId) input.entities_id = entitiesId;

							const emailPassword = this.getNodeParameter('email_password', itemIndex, true) as boolean;
							if (!emailPassword) {
								const password = this.getNodeParameter('password', itemIndex, '') as string;
								if (password) input.password = password;
							}

							const optionsParam = this.getNodeParameter('options', itemIndex, {}) as IDataObject;
							if (optionsParam.is_recursive !== undefined) input.is_recursive = optionsParam.is_recursive ? 1 : 0;
							if (optionsParam.profiles_id) input.profiles_id = optionsParam.profiles_id;
							if (optionsParam.phone) input.phone = optionsParam.phone;
							if (optionsParam.mobile) input.mobile = optionsParam.mobile;
							if (optionsParam.realname) input.realname = optionsParam.realname;
						} else if (itemtype.endsWith('/Group')) {
							const name = this.getNodeParameter('name', itemIndex, '') as string;
							if (name) input.name = name;

							const isRequester = this.getNodeParameter('is_requester', itemIndex, undefined) as boolean | undefined;
							if (isRequester !== undefined) input.is_requester = isRequester ? 1 : 0;

							const isWatcher = this.getNodeParameter('is_watcher', itemIndex, undefined) as boolean | undefined;
							if (isWatcher !== undefined) input.is_watcher = isWatcher ? 1 : 0;

							const isNotify = this.getNodeParameter('is_notify', itemIndex, undefined) as boolean | undefined;
							if (isNotify !== undefined) input.is_notify = isNotify ? 1 : 0;

							const isUsergroup = this.getNodeParameter('is_usergroup', itemIndex, undefined) as boolean | undefined;
							if (isUsergroup !== undefined) input.is_usergroup = isUsergroup ? 1 : 0;

							const optionsParam = this.getNodeParameter('options', itemIndex, {}) as IDataObject;
							if (optionsParam.code) input.code = optionsParam.code;
							if (optionsParam.recursive_membership !== undefined) input.recursive_membership = optionsParam.recursive_membership ? 1 : 0;
							if (optionsParam.groups_id) input.groups_id = optionsParam.groups_id;
							if (optionsParam.comment) input.comment = optionsParam.comment;
							if (optionsParam.is_manager !== undefined) input.is_manager = optionsParam.is_manager ? 1 : 0;
							if (optionsParam.is_assign !== undefined) input.is_assign = optionsParam.is_assign ? 1 : 0;
							if (optionsParam.is_task !== undefined) input.is_task = optionsParam.is_task ? 1 : 0;
						} else {
							Object.assign(input, this.getNodeParameter('input', itemIndex, {}) as IDataObject);
						}
					} else {
						Object.assign(input, this.getNodeParameter('input', itemIndex, {}) as IDataObject);
					}

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

