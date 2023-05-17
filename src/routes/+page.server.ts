// const host = 'http://yama';
const host = 'http://localhost';
const port = 8000;

export const actions = {
	chatWithBot: async ({ request, locals, middleware, cookies, platform }: any) => {
		const incoming = await request.formData();
		const userMessage = incoming.get('userMessage');
		const chatSessionId = incoming.get('chatSessionId');

		const options = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ chat_id: chatSessionId, message: userMessage })
		};

		const response = await fetch(`${host}:${port}/message`, options);
		const json = await response.json();
		return JSON.stringify(json);
	},
	getCurrentChatSession: async ({ request, middleware, cookies, platform }: any) => {
		const incoming = await request.formData();
		const chatSessionId = incoming.get('chatSessionId');

		const options = { method: 'GET' };

		const response = await fetch(`${host}:${port}/messages/${chatSessionId}`, options);
		const json = await response.json();

		return JSON.stringify({ messages: json });
	},
	getRecentChatSessions: async ({ request, middleware, cookies, platform }: any) => {
		const options = { method: 'GET' };

		const response = await fetch(`${host}:${port}/chats`, options);
		const json = await response.json();

		return JSON.stringify({ chats: json });
	},
	searchConversations: async ({ request, middleware, cookies, platform }: any) => {
		const incoming = await request.formData();
		const searchText = incoming.get('searchText');

		const options = { method: 'GET' };

		const response = await fetch(`${host}:${port}/search/${searchText}`, options);
		const json = await response.json();

		return JSON.stringify({ results: json });
	},
	getSupportedModels: async ({ request, middleware, cookies, platform }: any) => {
		const options = { method: 'GET' };
		const response = await fetch(`${host}:${port}/supported-models`, options);
		const json = await response.json();
		return JSON.stringify({ results: json });
	},
	updateModelConfig: async ({ request, middleware, cookies, platform }: any) => {
		const incoming = await request.formData();
		const modelConfig = incoming.get('modelConfig');
		const options = {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: modelConfig
		};
		const response = await fetch(`${host}:${port}/model-config`, options);
		const json = await response.json();
		return JSON.stringify({ results: json });
	},
	updateCompletionConfig: async ({ request, middleware, cookies, platform }: any) => {
		const incoming = await request.formData();
		const completionConfig = incoming.get('completionConfig');
		const options = {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: completionConfig
		};
		const response = await fetch(`${host}:${port}/chat-completion-config`, options);
		const json = await response.json();
		return JSON.stringify({ results: json });
	},
	getCompletionConfig: async ({ request, middleware, cookies, platform }: any) => {
		const options = { method: 'GET' };
		const response = await fetch(`${host}:${port}/chat-completion-config`, options);
		const json = await response.json();
		return JSON.stringify({ results: json });
	},
	getModelConfig: async ({ request, middleware, cookies, platform }: any) => {
		const options = { method: 'GET' };
		const response = await fetch(`${host}:${port}/model-config`, options);
		const json = await response.json();
		return JSON.stringify({ results: json });
	},
	forkConversationAtMessage: async ({ request, middleware, cookies, platform }: any) => {
		const incoming = await request.formData();
		const messageId = incoming.get('messageId');
		const options = { method: 'POST' };
		const response = await fetch(`${host}:${port}/fork-conversation/${messageId}`, options);
		const json = await response.json();
		return JSON.stringify({ messages: json });
	},
	rerunModelFromMessage: async ({ request, middleware, cookies, platform }: any) => {
		const incoming = await request.formData();
		const messageId = incoming.get('messageId');
		const options = { method: 'POST' };
		const response = await fetch(`${host}:${port}/rerun-conversation/${messageId}`, options);
		const json = await response.json();
		return JSON.stringify({ messages: json });
	}
};

export const load = async ({ request, locals, cookies, middleware, params, platform }: any) => {
	const url = new URL(request.url);
	return {
		url: url.pathname
	};
};
