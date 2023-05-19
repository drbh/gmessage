<script lang="ts">
	import Chat from '../components/Chat.svelte';
	import Sidebar from '../components/Sidebar.svelte';

	import { getCurrentChatSession, sendMessageToServer } from '../chat/api';
	import { convertMessage, scrollToBottom } from '../chat/helpers';
	import { onMount } from 'svelte';
	import { getRecentChatSessions } from '../chat/api';
	import { sinceTimestamp } from '../utils/sinceTimestamp';

	let recentConversations: any[] = [];

	onMount(() => {
		// get all recent chat sessions
		getRecentChatSessions().then((recentChatSessions) => {
			recentConversations = recentChatSessions.map((lastMessage: any) => {
				return {
					lastSeen: sinceTimestamp(lastMessage.timestamp),
					name: lastMessage.role,
					lastMessage: lastMessage.content,
					chatId: lastMessage.chat_id
				};
			});
		});
	});

	let messages: any[] = [];
	onMount(() => {
		// check local storage for chatSessionId
		const chatSessionIdLocal = localStorage.getItem('chatSessionId');

		if (chatSessionIdLocal) {
			const converted = getCurrentChatSession(chatSessionIdLocal).then((serverMessages) => {
				messages = serverMessages.map((msg: any, index: number) =>
					convertMessage(msg, messages.length + index)
				);
			});
		}
	});

	const resetWithChatSessionId = () => {
		const chatSessionIdLocal = localStorage.getItem('chatSessionId');

		if (chatSessionIdLocal) {
			const converted = getCurrentChatSession(chatSessionIdLocal).then((serverMessages) => {
				messages = serverMessages.map((msg: any, index: number) =>
					convertMessage(msg, messages.length + index)
				);
			});
		}
	};

	let messageCount = 0;

	// reactive messageCount length
	$: {
		messageCount = messages.length;
	}
</script>

<div class="flex absolute left-0 top-0 w-full h-full overflow-hidden">
	<Sidebar {recentConversations} {resetWithChatSessionId} {messageCount} />
	<Chat bind:messages />
</div>
