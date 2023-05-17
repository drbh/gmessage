<script lang="ts">
	import { EllipsisHorizontal, Icon } from 'svelte-hero-icons';
	import { onMount } from 'svelte';
	// @ts-ignore-next-line
	import { createIcon } from '@download/blockies';
	import type { Message } from '../../chat/types';

	export let handleSettingsClick: () => void;
	export let menuIsOpen: boolean = false;
	export let isHoveringPictures: boolean = false;
	export let messages: Message[] = [];
	let downloadLink: null | HTMLAnchorElement = null;

	onMount(() => {
		if (downloadLink) {
			downloadLink.click();
			URL.revokeObjectURL(downloadLink.href);
			downloadLink = null;
		}
	});

	function handleDownloadChat() {
		const blob = new Blob([JSON.stringify(messages)], {
			type: 'application/json'
		});
		const url = URL.createObjectURL(blob);
		downloadLink = document.createElement('a');
		downloadLink.href = url;
		downloadLink.download = 'chat.json';
		downloadLink.click();
	}

	function handleNewChat() {
		localStorage.setItem(
			'chatSessionId',
			// random int
			String(Math.floor(Math.random() * 100000))
		);
		window.location.reload();
	}

	function getProfilePicture() {
		// check if window exists
		if (typeof window === 'undefined') return;
		return createIcon({
			seed: 'address',
			size: 8,
			scale: 16
		}).toDataURL();
	}
</script>

<!-- Header -->
<div class="cx-header">
	<div class="flex items-center justify-between">
		<div class="flex items-center space-x-4 justify-between w-full">
			<div class="flex items-center space-x-4">
				<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
				<!-- svelte-ignore a11y-mouse-events-have-key-events -->
				<div
					class="flex items-center space-x-4"
					on:mouseover={() => {
						isHoveringPictures = true;
					}}
					on:mouseleave={() => {
						isHoveringPictures = false;
					}}
					on:keydown={() => {
						isHoveringPictures = true;
					}}
					on:keyup={() => {
						isHoveringPictures = false;
					}}
					tabindex="0"
				>
					<div class="cursor-pointer">
						<div class="cx-badge" />
						<img
							src={getProfilePicture()}
							alt="profile"
							class="cx-circle bg-[color:var(--white)]"
						/>
					</div>

					<div
						class={`
						cursor-pointer
						transform ${
							isHoveringPictures ? '-translate-x-2' : '-translate-x-6'
						} transition-transform duration-400`}
					>
						<div class="cx-badge" />
						<div class="cx-circle bg-[color:var(--bright)]" />
					</div>
				</div>
			</div>

			<!-- Start Menu -->
			<div id="chat-menu-button" class="">
				<div class="hover:text-white">
					<Icon src={EllipsisHorizontal} class="w-6 h-6" />
				</div>
				<div id="chat-menu" hidden={!menuIsOpen} class="cx-menu">
					<div class="flex flex-col text-left">
						<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
						<div
							class="cx-menu-item"
							on:click={handleSettingsClick}
							on:keydown={handleSettingsClick}
							tabindex="0"
						>
							Settings
						</div>
						<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
						<div
							class="cx-menu-item"
							on:click={handleDownloadChat}
							on:keydown={handleDownloadChat}
							tabindex="0"
						>
							Download Chat
						</div>
						<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
						<div
							class="cx-menu-item"
							on:click={handleNewChat}
							on:keydown={handleNewChat}
							tabindex="0"
						>
							New Chat
						</div>
					</div>
				</div>
			</div>
			<!-- End Menu -->
		</div>
	</div>
</div>
