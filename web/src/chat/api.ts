import type { ServerMessage } from './types';

// always the backend port
let port = 10999;

// however if we are in production, we need to use the window location
let protocol = 'http://';
let host = 'localhost';

// if window get the host and port from the window location
if (typeof window !== 'undefined') {
	protocol = window.location.protocol.slice(0, -1) + '://';
	host = window.location.hostname;
}

let baseUrl = `${protocol}${host}:${port}`;

// if protocol is https then ignore the port
if (protocol === 'https://') {
	baseUrl = `${protocol}${host}`;
}

const extractJson = (data: string) => JSON.parse(JSON.parse(data)[0]);

export async function downloadModel(modelName: string, callback: any): Promise<any> {
	const response = await fetch(`${baseUrl}/model/${modelName}`, {
		method: 'POST'
	});

	const reader = response.body.getReader();
	const decoder = new TextDecoder('utf-8');

	let done = false;
	while (!done) {
		const { value, done: readerDone } = await reader.read();
		done = readerDone;
		if (value) {
			const chunk = decoder.decode(value);

			try {
				const parsed = JSON.parse(chunk);
				// if progress in parsed then set progress
				if (parsed.progress) {
					callback(parsed.progress);
				}
			} catch (err) {
				console.log(err);
			}
		}
	}
}

export async function removeModel(modelName: string): Promise<string> {
	const response = await fetch(`${baseUrl}/model/${modelName}`, {
		method: 'DELETE'
	});
	const body = await response.json();

	return body;
}

export async function sendMessageToServer(
	userMessage: string,
	chatSessionId: string
): Promise<ServerMessage[] | null> {
	const options = {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ chat_id: Number(chatSessionId), message: userMessage })
	};
	const response = await fetch(`${baseUrl}/message`, options);
	const json = await response.json();
	console.log('json', json);
	if (json.messages) return json.messages;
	return json || [];
}

// send message but stream back the messages as they come in
export async function sendMessageToServerStream(
	userMessage: string,
	chatSessionId: string,
	incrementalMessageCallback: (incrementalMessage: any) => void
): Promise<ServerMessage[] | null> {
	const options = {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ chat_id: Number(chatSessionId), message: userMessage })
	};
	const response = await fetch(`${baseUrl}/stream`, options);
	const reader = response.body.getReader();
	const decoder = new TextDecoder('utf-8');

	let done = false;
	while (!done) {
		const { value, done: readerDone } = await reader.read();
		done = readerDone;
		if (value) {
			const chunk = decoder.decode(value);
			incrementalMessageCallback(chunk);
		}
	}

	// refetch the messages
	let messages = await getCurrentChatSession(chatSessionId);

	// return messages;
	return messages;
}

export async function getCurrentChatSession(chatSessionId: string): Promise<ServerMessage[]> {
	const options = { method: 'GET' };
	const response = await fetch(`${baseUrl}/messages/${chatSessionId}`, options);
	const json = await response.json();
	return json;
}

export async function getRecentChatSessions(): Promise<ServerMessage[]> {
	const options = { method: 'GET' };
	const response = await fetch(`${baseUrl}/chats`, options);
	const jsonData = await response.json();
	jsonData.sort((a: any, b: any) => {
		return new Date(b.timestamp) - new Date(a.timestamp);
	});
	return jsonData || [];
}

export async function searchConversations(searchText: string): Promise<ServerMessage[]> {
	const options = { method: 'GET' };
	const response = await fetch(`${baseUrl}/search/${searchText}`, options);
	const jsonData = await response.json();
	jsonData.sort((a: any, b: any) => {
		return new Date(b.timestamp) - new Date(a.timestamp);
	});
	return jsonData || [];
}

export async function getSupportedModels(): Promise<any> {
	const options = { method: 'GET' };
	const response = await fetch(`${baseUrl}/supported-models`, options);
	const json = await response.json();
	return json || [];
}

export async function updateModelConfig(modelConfig: any): Promise<any> {
	const options = {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(modelConfig)
	};
	const response = await fetch(`${baseUrl}/model-config`, options);
	const json = await response.json();
	return json;
}

export async function updateChatCompletionConfig(chatCompletionConfig: any): Promise<any> {
	const options = {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: chatCompletionConfig
	};
	const response = await fetch(`${baseUrl}/chat-completion-config`, options);
	const json = await response.json();
	return json;
}

export async function getCompletionConfig(): Promise<any> {
	const options = { method: 'GET' };
	const response = await fetch(`${baseUrl}/chat-completion-config`, options);
	const json = await response.json();
	return json || [];
}

export async function getModelConfig(): Promise<any> {
	const options = { method: 'GET' };
	const response = await fetch(`${baseUrl}/model-config`, options);
	const json = await response.json();
	return json || [];
}

export async function forkConversationAtMessage(
	messageId: string
): Promise<{ chatSessionId: string; timelineId: string; messages: ServerMessage[] }> {
	const options = { method: 'POST' };
	const response = await fetch(`${baseUrl}/fork-conversation/${messageId}`, options);
	const json = await response.json();
	return json;
}

// rerun the model from a given message
export async function rerunModelFromMessage(
	messageId: string
): Promise<{ chatSessionId: string; timelineId: string; messages: ServerMessage[] }> {
	const options = { method: 'POST' };
	const response = await fetch(`${baseUrl}/rerun-conversation/${messageId}`, options);
	const json = await response.json();
	return json;
}
