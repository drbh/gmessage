import type { Message } from './types';

const format = {
	hour: '2-digit',
	minute: '2-digit',
	second: '2-digit'
} as any;

export const shortTime = (time?: string | null): string => {
	if (!time) return new Date().toLocaleTimeString([], format);
	else return new Date(time).toLocaleTimeString([], format);
};

export function convertMessage(message: any, index: number): Message {
	return {
		key: index,
		type: message.role === 'user' ? 'sent' : 'received',
		content: message.content,
		timestamp: shortTime(message.createdAt ?? null),
		stage: message.stage ?? null,
		...message
	};
}

export function scrollToBottom(chatContainer: HTMLElement): void {
	chatContainer.scrollTo({
		top: chatContainer.scrollHeight,
		behavior: 'smooth'
	});
}
