<script lang="ts">
	import { afterUpdate, onMount } from 'svelte';
	import { Icon, XCircle } from 'svelte-hero-icons';
	import { v4 as uuidv4 } from 'uuid';
	import { sendMessageToServer } from '../chat/api';
	import { convertMessage, scrollToBottom } from '../chat/helpers';
	import ChatHeader from './ChatHeader.svelte';
	import ChatInput from './ChatInput.svelte';
	import ChatMessages from './ChatMessages.svelte';

	// TODO fix context name
	import { getany } from '../routes/context';
	import { APP_THEMES } from '../themes';
	const theme = getany();

	export let chatSessionId: string = '';
	export let messages: any[] = [];

	let inputEl: any;
	let typingMessage: any = null;
	let preparingChatSession = false;
	let menuIsOpen = false;
	let isHoveringPictures = false;
	let settingsHidden = true;

	onMount(() => {
		// close jobPostingOptionsVisible if the user clicks outside of the menu
		window.addEventListener('click', (event) => {
			const target = event.target as HTMLElement;

			const menu = document.getElementById(`chat-menu`);
			const menuButton = document.getElementById(`chat-menu-button`);
			const clickedOutsideMenu = !menu!.contains(target);
			const clickedInButton = menuButton!.contains(target);

			// if menu is open and user clicks outside of menu, close menu
			if (menuIsOpen && !clickedInButton && clickedOutsideMenu) {
				menuIsOpen = false;
			}

			// if menu is closed and menu button is clicked, open menu
			if (!menuIsOpen && clickedInButton) {
				menuIsOpen = true;
			}
			// if menu is open and menu button is clicked again, close menu
			// we need clickedOutsideMenu because if we don't have it, the menu will close and open again
			else if (menuIsOpen && clickedInButton && clickedOutsideMenu) {
				menuIsOpen = false;
			}
		});

		inputEl.focus();
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

	function updateHeight() {
		inputEl.style.height = 'calc(auto - 30px)';
		inputEl.style.height = inputEl.scrollHeight + 'px';
	}

	const sendMessage = async (event: any) => {
		const content = inputEl.value.trim();
		const timestamp = new Date().toLocaleTimeString([], {
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit'
		});

		// if no chatSessionId, start a new chat session
		if (!chatSessionId) {
			preparingChatSession = true;

			// const boardId = window.location.pathname.split('/')[2];
			chatSessionId = localStorage.getItem('chatSessionId') || '';

			inputEl.value = '';
		}

		// if not the first and we have content, send message to server
		if (content) {
			console.log('content', content);
			if (!preparingChatSession) {
				messages = [...messages, { type: 'sent', content, timestamp, key: uuidv4() }];
			}
			inputEl.value = '';
			preparingChatSession = false;

			setTimeout(() => {
				typingMessage = { type: 'received', content: 'Typing...', timestamp };
			}, 400);

			const serverMessagesPromise = sendMessageToServer(content, chatSessionId);
			const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 120_000));
			const serverMessages = await Promise.race([serverMessagesPromise, timeoutPromise]);

			typingMessage = null;

			if (serverMessages) {
				messages = [
					// ...messages,
					...serverMessages.map((msg: any, index: number) =>
						convertMessage(msg, messages.length + index)
					)
				];
			} else {
				messages = [
					// ...messages,
					{ type: 'received', content: 'Sorry, I am not able to respond right now.', timestamp }
				];
			}

			return serverMessages;
		}

		return [];
	};

	function handleKeyUp(e: any) {
		if (e.key === 'Enter') {
			sendMessage(null).then((serverMessages) => {
				messages = serverMessages.map((msg: any, index: number) =>
					convertMessage(msg, messages.length + index)
				);
			});
			inputEl.style.height = '24px';
		}
	}
	let themes = APP_THEMES;
	// Function to set the theme
	function setTheme(themeName) {
		const theme2 = themes[themeName];
		if (theme2) {
			// set your theme here
			console.log('set theme', themeName);
			theme.setTheme(
				themeName
				// `${theme2.primary};${theme2.primaryLight};${theme2.secondary};${theme2.bright}`
			);
		}
	}

	function handleSettingsClick() {
		console.log('handleSettingsClick');
		// wait 1 second and close menu
		setTimeout(() => {
			menuIsOpen = false;
		}, 100);

		settingsHidden = false;
	}
</script>

<!-- Main -->
<div class="bg-[color:var(--primary-light)] h-full flex flex-col shadow-lg w-full">
	<ChatHeader {isHoveringPictures} {menuIsOpen} {messages} {handleSettingsClick} />
	<ChatMessages {inputEl} {messages} {typingMessage} {preparingChatSession} />
	<ChatInput bind:inputEl {handleKeyUp} {updateHeight} {sendMessage} />
</div>

<div
	id="overlay"
	class="fixed top-0 left-0 w-full h-full bg-[#000]/80 opacity-90"
	class:hidden={settingsHidden}
/>

<!-- Start Settings Page -->
<div class="cx-settings-pane" class:hidden={settingsHidden}>
	<div class="flex justify-between items-start pb-4 py-4 px-4 w-[100%]">
		<div>&nbsp;</div>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div
			class="z-50"
			on:click={() => {
				console.log('close settings');
				settingsHidden = true;
			}}
		>
			<Icon src={XCircle} class="w-6 h-6 text-gray-700" />
		</div>
	</div>
	<div class="relative pb-6 h-32">
		<!-- svelte-ignore a11y-label-has-associated-control -->
		<label class="block text-sm font-medium text-gray-700">Chat Session ID</label>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div
			on:click={// copy it
			() => {
				navigator.clipboard.writeText(chatSessionId);
			}}
		>
			{chatSessionId}
		</div>

		<div class="p-5">
			<form
				class="
				bg-[color:var(--dark-transparent)]
			shadow-md rounded px-8 pt-6 pb-8 mb-4"
			>
				<div class="mb-4">
					<label class="block text-gray-700 text-sm font-bold mb-2" for="model"> Model </label>
					<input
						class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						id="model"
						type="text"
						placeholder="gptj"
					/>
				</div>
				<div class="mb-4">
					<!-- Repeat above block for each field, replace the 'for' attribute and 'placeholder' attribute accordingly -->
				</div>
				<div class="flex items-center justify-between">
					<button
						class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
						type="button"
					>
						Save Settings
					</button>
				</div>
			</form>
			<div
				class="
				bg-[color:var(--dark-transparent)]
			shadow-md rounded px-8 pt-6 pb-8 mb-4"
			>
				<label class="block text-gray-700 text-sm font-bold mb-2" for="theme"> Select Theme </label>

				<!-- Theme Card -->
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div class="flex flex-col space-y-0 overflow-y-auto h-64">
					{#each Object.keys(themes) as themeName (themeName)}
						<!-- Theme Card -->
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<div
							on:click={() => setTheme(themeName)}
							class="flex flex-col cursor-pointer hover:bg-[color:var(--dark-transparent)]"
						>
							<div class="pl-4 mt-4">{themeName}</div>
							<div class="pl-4 py-2 flex flex-row space-x-2">
								<!-- Primary -->
								<div class="flex flex-col">
									<div
										class="bg-[color:var(--primary)] h-14 w-14 rounded-lg"
										style="background-color: {themes[themeName].primary}"
									/>
									<div class="text-xs">{themes[themeName].primary}</div>
								</div>
								<!-- Primary Light -->
								<div class="flex flex-col">
									<div
										class="bg-[color:var(--primary-light)] h-14 w-14 rounded-lg"
										style="background-color: {themes[themeName].primaryLight}"
									/>
									<div class="text-xs">{themes[themeName].primaryLight}</div>
								</div>
								<!-- Secondary -->
								<div class="flex flex-col">
									<div
										class="bg-[color:var(--secondary)] h-14 w-14 rounded-lg"
										style="background-color: {themes[themeName].secondary}"
									/>
									<div class="text-xs">{themes[themeName].secondary}</div>
								</div>
								<!-- Bright -->
								<div class="flex flex-col">
									<div
										class="bg-[color:var(--bright)] h-14 w-14 rounded-lg"
										style="background-color: {themes[themeName].bright}"
									/>
									<div class="text-xs">{themes[themeName].bright}</div>
								</div>
								<!-- Font -->
								<div class="flex flex-col">
									<div
										class="bg-[color:var(--bright)] h-14 w-14 rounded-lg"
										style="background-color: {themes[themeName].fontColor}"
									/>
									<div class="text-xs">{themes[themeName].fontColor}</div>
								</div>
							</div>
						</div>
					{/each}

					<!--  -->
				</div>
			</div>
		</div>
	</div>
</div>
