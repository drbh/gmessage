import type { ServerMessage } from './types';

const extractJson = (data: string) => JSON.parse(JSON.parse(data)[0]);

export async function endConversation(chatSessionId: string): Promise<void> {
	// build request body
	const formData = new FormData();
	formData.append('chatSessionId', chatSessionId);

	// send request
	await fetch('?/endConversation', {
		method: 'POST',
		body: formData
	});
}

export async function startChatSession(
	boardId: string
): Promise<{ chatSessionId: string; timelineId: string; messages: ServerMessage[] }> {
	// build request body
	const formData = new FormData();
	formData.append('boardId', boardId);

	// send request
	const response = await fetch('?/startChatSession', {
		method: 'POST',
		body: formData
	});

	// parse response
	const data = await response.json();
	const jsonData = extractJson(data.data);

	return {
		chatSessionId: jsonData.chatSessionId,
		timelineId: jsonData.timelineId,
		messages: jsonData.messages
	};
}

export async function sendMessageToServer(
	userMessage: string,
	chatSessionId: string
): Promise<ServerMessage[] | null> {
	// build request body
	const formData = new FormData();
	formData.append('userMessage', userMessage);
	formData.append('chatSessionId', chatSessionId);

	// send request
	const response = await fetch('?/chatWithBot', {
		method: 'POST',
		body: formData
	});

	// parse response
	const data = await response.json();
	const jsonData = extractJson(data.data);

	return jsonData.messages || [];
}

export async function getCurrentChatSession(chatSessionId: string): Promise<ServerMessage[]> {
	// build request body
	const formData = new FormData();
	formData.append('chatSessionId', chatSessionId);

	// send request
	const response = await fetch('?/getCurrentChatSession', {
		method: 'POST',
		body: formData
	});

	// parse response
	const data = await response.json();
	const jsonData = extractJson(data.data);

	return jsonData.messages || [];
}

export async function getRecentChatSessions(): Promise<ServerMessage[]> {
	// send request
	const response = await fetch('?/getRecentChatSessions', {
		method: 'POST',
		body: ''
	});

	// parse response
	const data = await response.json();
	const jsonData = extractJson(data.data);

	jsonData.chats.sort((a: any, b: any) => {
		return new Date(b.timestamp) - new Date(a.timestamp);
	});

	return jsonData.chats || [];
}

export async function searchConversations(searchText: string): Promise<ServerMessage[]> {
	// build request body
	const formData = new FormData();
	formData.append('searchText', searchText);

	const response = await fetch('?/searchConversations', {
		method: 'POST',
		body: formData
	});

	// parse response
	const data = await response.json();
	const jsonData = extractJson(data.data);

	// sort by timestamp
	jsonData.results.sort((a: any, b: any) => {
		return new Date(b.timestamp) - new Date(a.timestamp);
	});

	return jsonData.results || [];
}

export async function getSupportedModels(): Promise<any> {
	const response = await fetch('?/getSupportedModels', {
		method: 'POST',
		body: ''
	});
	const data = await response.json();
	const jsonData = extractJson(data.data);
	return jsonData.results || [];
}

export async function updateModelConfig(modelConfig: any): Promise<any> {
	const formData = new FormData();
	formData.append('modelConfig', JSON.stringify(modelConfig));
	const response = await fetch('?/updateModelConfig', {
		method: 'POST',
		body: formData
	});
	const data = await response.json();
	const jsonData = extractJson(data.data);
	return jsonData.results || [];
}

export async function updateChatCompletionConfig(chatCompletionConfig: any): Promise<any> {
	const formData = new FormData();
	formData.append('completionConfig', JSON.stringify(chatCompletionConfig));
	const response = await fetch('?/updateCompletionConfig', {
		method: 'POST',
		body: formData
	});
	const data = await response.json();
	const jsonData = extractJson(data.data);
	return jsonData.results || [];
}

export async function getCompletionConfig(): Promise<any> {
	const response = await fetch('?/getCompletionConfig', {
		method: 'POST',
		body: ''
	});
	const data = await response.json();
	const jsonData = extractJson(data.data);
	return jsonData.results || [];
}

export async function getModelConfig(): Promise<any> {
	const response = await fetch('?/getModelConfig', {
		method: 'POST',
		body: ''
	});
	const data = await response.json();
	const jsonData = extractJson(data.data);
	return jsonData.results || [];
}

export async function forkConversationAtMessage(
	messageId: string
): Promise<{ chatSessionId: string; timelineId: string; messages: ServerMessage[] }> {
	const formData = new FormData();
	formData.append('messageId', messageId);
	const response = await fetch('?/forkConversationAtMessage', {
		method: 'POST',
		body: formData
	});
	const data = await response.json();
	const jsonData = extractJson(data.data);
	return jsonData.messages || [];
}

// rerun the model from a given message
export async function rerunModelFromMessage(
	messageId: string
): Promise<{ chatSessionId: string; timelineId: string; messages: ServerMessage[] }> {
	const formData = new FormData();
	formData.append('messageId', messageId);
	const response = await fetch('?/rerunModelFromMessage', {
		method: 'POST',
		body: formData
	});
	const data = await response.json();
	const jsonData = extractJson(data.data);
	return jsonData.messages || [];
}
