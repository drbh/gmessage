<script lang="ts">
	import Chat from '../components/Chat.svelte';
	import Sidebar from '../components/Sidebar.svelte';

	import { getCurrentChatSession, sendMessageToServer, startChatSession } from '../chat/api';
	import { convertMessage, scrollToBottom } from '../chat/helpers';
	import { onMount } from 'svelte';
	import { getRecentChatSessions } from '../chat/api';

	let recentConversations: any[] = [];

	onMount(() => {
		// get all recent chat sessions
		getRecentChatSessions().then((recentChatSessions) => {
			recentConversations = recentChatSessions.map((lastMessage: any) => {
				// get time since 2023-05-15 05:02:04
				const currentTimestampUTC = new Date().getTime() //+ new Date().getTimezoneOffset() * 60000;
				const sinceLastSeen = currentTimestampUTC - new Date(lastMessage.timestamp + 'Z').getTime();
				const secondsSinceLastSeen = Math.floor(sinceLastSeen / 1000);
				const minutesSinceLastSeen = Math.floor(secondsSinceLastSeen / 60);
				const hoursSinceLastSeen = Math.floor(minutesSinceLastSeen / 60);
				const daysSinceLastSeen = Math.floor(hoursSinceLastSeen / 24);

				let lastSeen = '';
				if (daysSinceLastSeen > 0) {
					lastSeen = `${daysSinceLastSeen} days ago`;
				} else if (hoursSinceLastSeen > 0) {
					lastSeen = `${hoursSinceLastSeen} hours ago`;
				} else if (minutesSinceLastSeen > 0) {
					lastSeen = `${minutesSinceLastSeen} minutes ago`;
				} else {
					lastSeen = `${secondsSinceLastSeen} seconds ago`;
				}

				return {
					lastSeen: lastSeen,
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
</script>

<div class="flex absolute left-0 top-0 w-full h-full overflow-hidden">
	<Sidebar {recentConversations} {resetWithChatSessionId} />
	<Chat {messages} />
</div>
