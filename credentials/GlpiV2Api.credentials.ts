import type { ICredentialType, ICredentialTestRequest, INodeProperties, Icon } from 'n8n-workflow';

export class GlpiV2Api implements ICredentialType {
	name = 'glpiV2Api';

	displayName = 'GLPI V2 API';

	icon: Icon = { light: 'file:../icons/glpi.svg', dark: 'file:../icons/glpi.dark.svg' };

	documentationUrl = 'https://atendimento.centrium.com.br/api.php/v2.1/doc.JSON';

	test: ICredentialTestRequest = {
		request: {
			url: '={{$credentials.host.replace(/\\/+$/, "") + "/api.php"}}/token',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body:
				'={{ $credentials.useAuthorizationCode && $credentials.authorizationCode ? `{"grant_type":"authorization_code","client_id":"${"{{$credentials.clientId}}"}","client_secret":"${"{{$credentials.clientSecret}}"}","code":"${"{{$credentials.authorizationCode}}"}","redirect_uri":"${"{{$credentials.redirectUri}}"}"}` : `{"grant_type":"password","client_id":"${"{{$credentials.clientId}}"}","client_secret":"${"{{$credentials.clientSecret}}"}","username":"${"{{$credentials.username}}"}","password":"${"{{$credentials.password}}"}","scope":"${"{{$credentials.scope}}"}"}` }}',
		},
	};

	properties: INodeProperties[] = [
		{
			displayName: 'GLPI URL',
			name: 'host',
			type: 'string',
			default: '',
			placeholder: 'https://glpi.example.com',
			required: true,
			description: 'URL base do GLPI (sem /api.php/v.21 - será adicionado automaticamente)',
		},
		{
			displayName: 'Use Authorization Code Flow',
			name: 'useAuthorizationCode',
			type: 'boolean',
			default: false,
			description: 'Enable to use the authorization-code flow: open the authorization URL, paste the returned code and exchange it for a token.',
		},
		{
			displayName: 'Redirect URI',
			name: 'redirectUri',
			type: 'string',
			default: '',
			description: 'Redirect URI configured on the OAuth client. Required for authorization code flow.',
		},
		{
			displayName: 'State',
			name: 'state',
			type: 'string',
			default: '',
			description: 'Optional state value to include in the authorization request and verify on return.',
		},
		{
			displayName: 'Authorization Code',
			name: 'authorizationCode',
			type: 'string',
			default: '',
			description: 'Paste the authorization code received from the authorize endpoint here, then run the credential test to exchange it for a token.',
		},

		{
			displayName: 'Authorization Guide',
			name: 'authorizationGuide',
			type: 'notice',
			default: '',
			description:
				'To start the interactive flow, open the authorization URL in a browser:\n' +
				'{{$credentials.host.replace(/\\/+$/, "")}}/api.php/authorize?response_type=code&client_id={{$credentials.clientId}}&redirect_uri={{$credentials.redirectUri}}&scope={{$credentials.scope}}&state={{$credentials.state}}\n' +
				'After the redirect, copy the returned `code` into the Authorization Code field and run the credential test to exchange it for a token. For server-side flows, POST to /api.php/authorize with the required params.',
		},
		{
			displayName: 'Scope',
			name: 'scope',
			type: 'string',
			default: 'api graphql',
			required: true,
			description: 'Escopos de acesso para o token OAuth2 (ex: api graphql)',
		},
		{
			displayName: 'Client ID',
			name: 'clientId',
			type: 'string',
			required: true,
			default: '',
			description: 'Client ID gerado no GLPI (Setup > OAuth Clients)',
		},
		{
			displayName: 'Client Secret',
			name: 'clientSecret',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
			description: 'Client Secret gerado no GLPI',
		},
		{
			displayName: 'Username',
			name: 'username',
			type: 'string',
			required: true,
			default: '',
			description: 'Usuário do GLPI a ser autenticado',
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
			description: 'Senha do usuário do GLPI',
		},
	];
}

