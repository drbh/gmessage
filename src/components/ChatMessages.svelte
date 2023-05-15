<script lang="ts">
	import { afterUpdate, onMount } from 'svelte';
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
	import { scrollToBottom } from '../chat/helpers';

	export let inputEl: any;
	export let messages: any[] = [];
	export let typingMessage: any = null;
	export let preparingChatSession = false;

	onMount(() => {
		// Get the chat container element
		const chatContainer = document.querySelector('.chat-container');

		if (!chatContainer) {
			return;
		}

		// Scroll to bottom
		scrollToBottom(chatContainer as any);
	});

	afterUpdate(() => {
		// Get the chat container element
		const chatContainer = document.querySelector('.chat-container');

		if (!chatContainer) {
			return;
		}

		// Scroll to bottom
		scrollToBottom(chatContainer as any);
	});
</script>

<!-- Main Chat Area -->
<div class="bg-transparent w-full mx-auto flex flex-col">
	<div id="chat-container" class="cx-chat-container scrollbar-none">
		{#if messages.length === 0 && !typingMessage && !preparingChatSession}
			<div class="h-full mt-[35vh] flex justify-center items-center text-center text-gray-400">
				Hey there! 👋 Looks like there aren't any messages yet
				<br />Try sending a message to get started
			</div>
		{:else}
			{#each messages as message (message.key)}
				<div class="flex items-end {message.type === 'sent' ? 'justify-end' : ''}">
					<div
						class="
							bg-{message.type === 'sent'
							? // users color
							  '[color:var(--bright)]'
							: // bots color
							  '[color:var(--secondary)]'} 
							text-{message.type === 'sent' && 'white'}
							rounded-2xl px-4 py-2 text-sm max-w-sm"
					>
						<p>{message.content}</p>
						<p class="text-xs mt-1 {message.type === 'sent' ? 'text-blue-200' : 'text-gray-500'}">
							{message.timestamp}
						</p>
						{#if message.type !== 'sent'}
							<div class="flex justify-start space-x-1 mt-4">
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
								<div class="cx-char-action-button">
									<Icon src={ArrowPath} class="w-4 h-4" />
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
							<div class="flex justify-start space-x-1 mt-4">
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

								<div class="cx-char-action-button">
									<Icon src={SquaresPlus} class="w-4 h-4" />
								</div>
							</div>
						{/if}
					</div>
				</div>
			{/each}
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

		{#if typingMessage}
			<div class="flex items-end">
				<div
					class={`bg-[color:var(--secondary)] text-gray-900 rounded-lg px-4 py-2 text-sm w-[200px]`}
				>
					<div class="flex justify-start space-x-1.5 animate-pulse">
						<span class="h-2 w-2 bg-gray-300 rounded-full" />
						<span class="h-2 w-2 bg-gray-300 rounded-full" />
						<span class="h-2 w-2 bg-gray-300 rounded-full" />
					</div>
					<p class="text-xs mt-1 text-gray-400">typing</p>
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
</style>
