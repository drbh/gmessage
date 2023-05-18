import type { ServerMessage } from './types';

const host = 'http://localhost';
// const port = 3000;
const port = 8000;

const extractJson = (data: string) => JSON.parse(JSON.parse(data)[0]);

export async function sendMessageToServer(
	userMessage: string,
	chatSessionId: string
): Promise<ServerMessage[] | null> {
	const options = {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ chat_id: Number(chatSessionId), message: userMessage })
	};
	const response = await fetch(`${host}:${port}/message`, options);
	const json = await response.json();
	console.log('json', json);
	if (json.messages) return json.messages;
	return json || [];
}

export async function getCurrentChatSession(chatSessionId: string): Promise<ServerMessage[]> {
	const options = { method: 'GET' };
	const response = await fetch(`${host}:${port}/messages/${chatSessionId}`, options);
	const json = await response.json();
	return json;
}

export async function getRecentChatSessions(): Promise<ServerMessage[]> {
	const options = { method: 'GET' };
	const response = await fetch(`${host}:${port}/chats`, options);
	const jsonData = await response.json();
	jsonData.sort((a: any, b: any) => {
		return new Date(b.timestamp) - new Date(a.timestamp);
	});
	return jsonData || [];
}

export async function searchConversations(searchText: string): Promise<ServerMessage[]> {
	const options = { method: 'GET' };
	const response = await fetch(`${host}:${port}/search/${searchText}`, options);
	const jsonData = await response.json();
	jsonData.sort((a: any, b: any) => {
		return new Date(b.timestamp) - new Date(a.timestamp);
	});
	return jsonData || [];
}

export async function getSupportedModels(): Promise<any> {
	const options = { method: 'GET' };
	const response = await fetch(`${host}:${port}/supported-models`, options);
	const json = await response.json();
	return json || [];
}

export async function updateModelConfig(modelConfig: any): Promise<any> {
	const options = {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: modelConfig
	};
	const response = await fetch(`${host}:${port}/model-config`, options);
	const json = await response.json();
	return json;
}

export async function updateChatCompletionConfig(chatCompletionConfig: any): Promise<any> {
	const options = {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: chatCompletionConfig
	};
	const response = await fetch(`${host}:${port}/chat-completion-config`, options);
	const json = await response.json();
	return json;
}

export async function getCompletionConfig(): Promise<any> {
	const options = { method: 'GET' };
	const response = await fetch(`${host}:${port}/chat-completion-config`, options);
	const json = await response.json();
	return json || [];
}

export async function getModelConfig(): Promise<any> {
	const options = { method: 'GET' };
	const response = await fetch(`${host}:${port}/model-config`, options);
	const json = await response.json();
	return json || [];
}

export async function forkConversationAtMessage(
	messageId: string
): Promise<{ chatSessionId: string; timelineId: string; messages: ServerMessage[] }> {
	const options = { method: 'POST' };
	const response = await fetch(`${host}:${port}/fork-conversation/${messageId}`, options);
	const json = await response.json();
	return json;
}

// rerun the model from a given message
export async function rerunModelFromMessage(
	messageId: string
): Promise<{ chatSessionId: string; timelineId: string; messages: ServerMessage[] }> {
	const options = { method: 'POST' };
	const response = await fetch(`${host}:${port}/rerun-conversation/${messageId}`, options);
	const json = await response.json();
	return json;
}
