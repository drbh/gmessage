export type MessageType = 'sent' | 'received';

export interface Message {
	key: number;
	type: MessageType;
	content: string;
	timestamp: string;
	stage: string | null;
}

export interface ServerMessage {
	role: string;
	content: string;
}
