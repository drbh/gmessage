<script lang="ts">
	import { afterUpdate } from 'svelte';
	import {
		ArrowPath,
		ClipboardDocument,
		FaceFrown,
		FaceSmile,
		Icon,
		PencilSquare,
		SpeakerWave,
		SquaresPlus
	} from 'svelte-hero-icons';
	import { scrollToBottom } from '../../chat/helpers';
	import { timeDiffToHuman } from '../../utils/sinceTimestamp';
	import { rerunModelFromMessage, forkConversationAtMessage } from '../../chat/api';

	export let inputEl: any;
	export let messages: any[] = [];
	export let typingMessage: any = null;
	export let preparingChatSession = false;

	export let pendingText = '';

	let chatContainerRef: any;

	afterUpdate(() => {
		if (!chatContainerRef) return;
		scrollToBottom(chatContainerRef as any);
	});
</script>

<!-- Main Chat Area -->
<div class="bg-transparent w-full mx-auto flex flex-col">
	<div id="chat-container" class="cx-chat-container scrollbar-none" bind:this={chatContainerRef}>
		{#if messages.length === 0 && !typingMessage && !preparingChatSession}
			<div class="flex mx-auto mt-[30vh]">
				<div
					class="h-full flex justify-center
			items-center text-center
			text-[color:var(--bright)]
			opacity-20
			text-[40pt] font-[700]
			"
				>
					GPT4ALL
				</div>

				<div
					class="h-full flex justify-center
					ml-4
			items-center text-center
			text-[color:var(--bright)]
			opacity-20
			"
				>
					<div
						class="border-[2px] border-[color:var(--bright)]
				py-6
				rounded-xl w-[10vw] h-12 flex justify-center items-center"
					>
						<div class="flex flex-col">
							<div class="text-[color:var(--bright)] text-[16pt] font-[700] mt-1">LOCAL</div>
							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<div
								on:click={() => {
									window.open('https://github.com/drbh/gmessage', '_blank');
								}}
								class="text-[color:var(--bright)] text-[8pt] font-[700] mt-[-0.35rem] cursor-pointer"
							>
								@drbh
							</div>
						</div>
					</div>
				</div>
			</div>
		{:else}
			{#each messages.slice(3) as message, index}
				{#if // current message is sent by the user
				new Date(message?.timestamp || 0).getMinutes() - new Date(messages[index + 3 - 1]?.timestamp || 0).getMinutes() >= 1}
					<div
						class="
						flex
						justify-center
						items-center
						mt-4
						text-[color:var(--font-color)]
						opacity-30
						text-[10pt]
						font-[400]
						"
					>
						{new Date(message.timestamp).toLocaleString('en-US', {
							weekday: 'long',
							year: 'numeric',
							month: 'long',
							day: 'numeric',
							hour: 'numeric',
							minute: 'numeric'
						})}
					</div>
				{/if}
				<div
					class="flex message-container hover-group
					flex-col
				 {message.type === 'sent' ? 'items-end' : ''}"
				>
					<div
						class="
							shadow-sm
							hover:shadow-md
							bg-{message.type === 'sent'
							? // users color
							  '[color:var(--bright)]'
							: // bots color
							  '[color:var(--secondary)]'} 
							text-{message.type === 'sent' && 'white'}
							rounded-xl
							px-4
							py-2
							text-sm
							max-w-[26rem]
							min-w-[16rem]
							"
					>
						<p>{message.content}</p>
						<div class="flex justify-between mt-1 text-xs opacity-50">
							<p class="mt-1 mr-4">
								{message.timestamp}
							</p>
							<p class="mt-1">
								{#if message.type !== 'sent'}
									{timeDiffToHuman(
										new Date(message.timestamp).getTime(),
										new Date(message.request_timestamp).getTime()
									)} |
								{/if}
								<!--  -->
								{message.content.split(' ').length} words
								<!--  -->
								{#if message.type !== 'sent'}
									| {(
										(message.content.split(' ').length /
											(new Date(message.timestamp).getTime() -
												new Date(message.request_timestamp).getTime())) *
										1000
									).toFixed(2)}/wps
								{/if}
							</p>
						</div>
						<!-- End of the message -->
					</div>

					<!-- svelte-ignore a11y-mouse-events-have-key-events -->
					<div
						class="tool-section opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out"
					>
						{#if message.type !== 'sent'}
							<div class="flex justify-start mt-2">
								<!-- svelte-ignore a11y-click-events-have-key-events -->
								<div
									on:click={() => {
										// copy to clipboard
										navigator.clipboard.writeText(message.content);
									}}
									class="cx-char-action-button"
								>
									<Icon src={ClipboardDocument} class="w-4 h-4" />
								</div>

								<div class="cx-char-action-button">
									<Icon src={PencilSquare} class="w-4 h-4" />
								</div>
								<!-- svelte-ignore a11y-click-events-have-key-events -->
								<div
									on:click={() => {
										// use the built in browser speech synthesis
										speechSynthesis.speak(new SpeechSynthesisUtterance(message.content));
									}}
									class="cx-char-action-button"
								>
									<Icon src={SpeakerWave} class="w-4 h-4" />
								</div>

								<!-- svelte-ignore a11y-click-events-have-key-events -->
								<div
									on:click={async () => {
										// re run the message
										await forkConversationAtMessage(message.id);
										window.location.reload();
									}}
									class="cx-char-action-button"
								>
									<Icon src={SquaresPlus} class="w-4 h-4" />
								</div>

								<div class="cx-char-action-button">
									<Icon src={FaceFrown} class="w-4 h-4" />
								</div>
								<div class="cx-char-action-button">
									<Icon src={FaceSmile} class="w-4 h-4" />
								</div>
							</div>
							<!-- End Options -->
						{:else}
							<div class="flex justify-start mt-2">
								<!-- <div class="flex text-xs mt-1">Stage</div> -->
								<!-- svelte-ignore a11y-click-events-have-key-events -->
								<div
									on:click={() => {
										// copy to clipboard
										navigator.clipboard.writeText(message.content);
									}}
									class="cx-char-action-button"
								>
									<Icon src={ClipboardDocument} class="w-4 h-4" />
								</div>
								<div class="cx-char-action-button">
									<Icon src={PencilSquare} class="w-4 h-4" />
								</div>
								<!-- svelte-ignore a11y-click-events-have-key-events -->
								<div
									on:click={() => {
										// use the built in browser speech synthesis
										speechSynthesis.speak(new SpeechSynthesisUtterance(message.content));
									}}
									class="cx-char-action-button"
								>
									<Icon src={SpeakerWave} class="w-4 h-4" />
								</div>

								<!-- svelte-ignore a11y-click-events-have-key-events -->
								<div
									on:click={async () => {
										// re run the message
										await rerunModelFromMessage(message.id);
										window.location.reload();
									}}
									class="cx-char-action-button"
								>
									<Icon src={ArrowPath} class="w-4 h-4" />
								</div>
							</div>
						{/if}
					</div>
				</div>
			{/each}
		{/if}

		{#if pendingText !== ''}
			<div
				class="
				shadow-sm
				hover:shadow-md
				bg-{'[color:var(--secondary)]'} 
				text-{'white'}
				rounded-xl
				px-4
				py-2
				text-sm
				max-w-[26rem]
				min-w-[16rem]
				"
			>
				<p>{pendingText}</p>
				<div class="flex justify-between mt-1 text-xs opacity-50">
					<p class="mt-1 mr-4"></p>
					<p class="mt-1">
						<Icon src={ArrowPath} class="w-4 h-4 animate-spin" />
					</p>
				</div>
				<!-- End of the message -->
			</div>
		{/if}

		{#if preparingChatSession}
			<div class="flex items-end">
				<div
					class={`bg-[color:var(--secondary)] text-gray-900 rounded-lg px-4 py-2 text-sm w-[200px]`}
				>
					<div class="flex justify-start space-x-1.5 animate-pulse">
						<span class="h-2 w-2 bg-gray-300 rounded-full" />
						<span class="h-2 w-2 bg-gray-300 rounded-full" />
						<span class="h-2 w-2 bg-gray-300 rounded-full" />
					</div>
					<p class="text-xs mt-1 text-gray-400">Reticulating splines.</p>
				</div>
			</div>
		{/if}

		{#if typingMessage && pendingText === ''}
			<div class="flex items-end">
				<div
					class={`bg-[color:var(--secondary)] text-gray-900 rounded-lg px-4 py-2 text-sm w-[200px]`}
				>
					<div class="flex justify-start space-x-1.5 animate-pulse">
						<span class="h-2 w-2 bg-gray-300 rounded-full" />
						<span class="h-2 w-2 bg-gray-300 rounded-full" />
						<span class="h-2 w-2 bg-gray-300 rounded-full" />
					</div>
					<p class="text-xs mt-1 text-gray-400 animate-pulse">thinking</p>
				</div>
			</div>
		{/if}
	</div>
</div>

<!-- End Chat Area -->

<style>
	.bg-light {
		background-color: #f7f7f7;
	}
	.chat-container::-webkit-scrollbar {
		width: 0.5rem;
	}
	.chat-container::-webkit-scrollbar-track {
		background-color: #f7f7f7;
	}
	.chat-container::-webkit-scrollbar-thumb {
		background-color: #d1d1d1;
		border-radius: 1rem;
	}

	/* hide scrollbar for IE, Edge and Firefox and Chrome */
	* {
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
		--webkit-scrollbar: none; /* Chrome */
	}

	.hover-group:hover .tool-section {
		opacity: 100%;
	}
</style>
