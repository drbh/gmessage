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

		const response = await fetch('http://localhost:8000/message', options);
		const json = await response.json();
		return JSON.stringify(json);
	},
	getCurrentChatSession: async ({ request, middleware, cookies, platform }: any) => {
		const incoming = await request.formData();
		const chatSessionId = incoming.get('chatSessionId');

		const options = { method: 'GET' };

		const response = await fetch(`http://localhost:8000/messages/${chatSessionId}`, options);
		const json = await response.json();

		return JSON.stringify({ messages: json });
	},
	getRecentChatSessions: async ({ request, middleware, cookies, platform }: any) => {
		const options = { method: 'GET' };

		const response = await fetch('http://localhost:8000/chats', options);
		const json = await response.json();

		return JSON.stringify({ chats: json });
	},
	searchConversations: async ({ request, middleware, cookies, platform }: any) => {
		const incoming = await request.formData();
		const searchText = incoming.get('searchText');

		const options = { method: 'GET' };

		const response = await fetch(`http://localhost:8000/search/${searchText}`, options);
		const json = await response.json();

		return JSON.stringify({ results: json });
	}
};

export const load = async ({ request, locals, cookies, middleware, params, platform }: any) => {
	const url = new URL(request.url);
	return {
		url: url.pathname
	};
};
