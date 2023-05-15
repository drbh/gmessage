<script lang="ts">
	import { createIcon } from '@download/blockies';
	import { Icon, MagnifyingGlass } from 'svelte-hero-icons';
	import { searchConversations } from '../chat/api';

	export let recentConversations: any[] = [];
	export let resetWithChatSessionId: () => void;

	const sinceTimestamp = (timestamp: any) => {
		// get time since 2023-05-15 05:02:04
		const currentTimestampUTC = new Date().getTime() + new Date().getTimezoneOffset() * 60000;
		const sinceLastSeen = currentTimestampUTC - new Date(timestamp + 'Z').getTime();
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
		return lastSeen;
	};

	let searchTerm = '';

	let seachResults: any[] = [];
</script>

<!-- Sidebar -->
<div class="cx-sidebar">
	<div class="cx-search-bar">
		<!-- Search Bar -->
		<!-- A Seach input with a magnify glass cap -->
		<div class="cx-search-bar-inner">
			<Icon src={MagnifyingGlass} class="ml-4 w-4 h-4 text-[color:var(--saturated)]" />
			<input
				bind:value={searchTerm}
				type="text"
				placeholder="Search"
				class="text-[color:var(--saturated)] text-sm font-bold w-full outline-none bg-transparent"
				on:input={async () => {
					if (searchTerm.length === 0) {
						seachResults = [];
						return;
					}

					// use searchConversations
					const res = await searchConversations(searchTerm);
					seachResults = res;
				}}
			/>
		</div>
	</div>

	<div class="flex flex-col justify-center">
		<div class="flex flex-col items-center overflow-y-scroll max-h-[calc(100vh-5rem)]">
			<!-- Show Search Results -->
			{#each seachResults as result}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div
					class="flex flex-col w-[calc(100%-4rem)]"
					on:click={() => {
						localStorage.setItem('chatSessionId', result.chat_id);
						resetWithChatSessionId();
					}}
				>
					<div class="flex items-center justify-between w-full">
						<div class="text-[color:var(--white)] text-md font-bold">{result.role}</div>
						<div class="text-[color:var(--white)] text-sm">{sinceTimestamp(result.timestamp)}</div>
					</div>
					<div
						class="text-[color:var(--white)] text-sm overflow-hidden overflow-ellipsis whitespace-nowrap w-full"
					>
						<div
							class="flex items-center space-x-4 w-full p-8
						cursor-pointer
						hover:pl-9 transition-all duration-200
						hover:bg-[color:var(--primary-light)]"
						>
							<div class="text-[color:var(--saturated)]">
								{@html result.content.replace(
									new RegExp(searchTerm, 'gi'),
									(match) => `<span class="bg-yellow-800">${match}</span>`
								)}
							</div>
						</div>
					</div>
				</div>
			{/each}
			{#if searchTerm.length == 0}
				<!-- for each recentConversations -->
				{#each recentConversations as conversation}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<div
						on:click={() => {
							localStorage.setItem('chatSessionId', conversation.chatId);
							// reload the page
							// window.location.reload();
							resetWithChatSessionId();
						}}
						class="flex items-center space-x-4 w-full p-8
						cursor-pointer
						hover:pl-9 transition-all duration-200
						hover:bg-[color:var(--primary-light)]"
					>
						<!-- svelte-ignore a11y-missing-attribute -->
						<img
							src={createIcon({
								seed: `some-random-string-${conversation.chatId}`, // seed used to generate icon data, default: random
								// color: '#dfe', // to manually specify the icon color, default: random
								// bgcolor: '#aaa', // choose a different background color, default: white
								size: 15, // width/height of the icon in blocks, default: 10
								scale: 3 // width/height of each block in pixels, default: 5
							}).toDataURL()}
							class="w-10 h-10 bg-[color:var(--white)] rounded-full"
						/>
						<div class="flex flex-col w-[calc(100%-4rem)]">
							<div class="flex items-center justify-between w-full">
								<div class="text-[color:var(--white)] text-md font-bold">{conversation.name}</div>
								<div class="text-[color:var(--white)] text-sm">{conversation.lastSeen}</div>
							</div>
							<div
								class="text-[color:var(--white)] text-sm overflow-hidden overflow-ellipsis whitespace-nowrap w-full"
							>
								{conversation.lastMessage}
							</div>
						</div>
					</div>
				{/each}
			{/if}
		</div>
	</div>
</div>
