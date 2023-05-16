<script lang="ts">
	// @ts-ignore-next-line
	import { createIcon } from '@download/blockies';
	import { Icon, MagnifyingGlass } from 'svelte-hero-icons';
	import { searchConversations } from '../chat/api';
	import { sinceTimestamp } from '../utils/sinceTimestamp';

	export let recentConversations: any[] = [];
	export let resetWithChatSessionId: () => void;

	let searchTerm = '';
	let seachResults: any[] = [];

	const withHighlight = (match: string) => {
		return `<span class="bg-[color:var(--bright)]">${match}</span>`;
	};
</script>

<!-- Sidebar -->
<div class="cx-sidebar">
	<div class="cx-search-bar">
		<!-- Search Bar -->
		<div class="cx-search-bar-inner">
			<Icon src={MagnifyingGlass} class="ml-4 w-4 h-4 text-[color:var(--bright)]" />
			<input
				bind:value={searchTerm}
				type="text"
				placeholder="Search"
				class="text-sm font-bold w-full outline-none bg-[color:var(--primary-light)]"
				on:input={async () => {
					if (searchTerm.length === 0) {
						seachResults = [];
						return;
					}
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
						<div class="text-[color:var(--white)] text-md font-bold">
							{result.role}
						</div>

						<!-- svelte-ignore a11y-missing-attribute -->
						<div class="text-[color:var(--white)] text-sm">{sinceTimestamp(result.timestamp)}</div>
					</div>
					<div
						class=" text-[color:var(--white)] text-sm overflow-hidden overflow-ellipsis whitespace-nowrap w-full"
					>
						<div class="cx-search-results">
							<!-- svelte-ignore a11y-missing-attribute -->
							<img
								src={createIcon({
									seed: `some-random-string-${result.chat_id}`, // seed used to generate icon data, default: random
									// color: '#dfe', // to manually specify the icon color, default: random
									// bgcolor: '#aaa', // choose a different background color, default: white
									size: 15, // width/height of the icon in blocks, default: 10
									scale: 3 // width/height of each block in pixels, default: 5
								}).toDataURL()}
								class="w-4 h-4 bg-[color:var(--white)] rounded-full"
							/>

							<div class="text-[color:var(--saturated)]">
								{@html result.content.replace(new RegExp(searchTerm, 'gi'), withHighlight)}
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
							resetWithChatSessionId();
						}}
						class="cx-recent-conversation"
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
