<script lang="ts">
	import { afterUpdate, onMount } from 'svelte';
	import { Icon, XCircle } from 'svelte-hero-icons';
	import { v4 as uuidv4 } from 'uuid';
	import {
		sendMessageToServer,
		getSupportedModels,
		getCompletionConfig,
		getModelConfig
	} from '../chat/api';
	import { convertMessage, scrollToBottom } from '../chat/helpers';
	import ChatHeader from './Chat/ChatHeader.svelte';
	import ChatInput from './Chat/ChatInput.svelte';
	import ChatMessages from './Chat/ChatMessages.svelte';

	// TODO fix context name
	import { getany } from '../routes/context';
	import { APP_THEMES } from '../themes';
	import Settings from './Settings.svelte';
	const theme = getany();

	export let chatSessionId: string = '';
	export let messages: any[] = [];

	let inputEl: any;
	let typingMessage: any = null;
	let preparingChatSession = false;
	let menuIsOpen = false;
	let isHoveringPictures = false;
	let settingsHidden = true;
	let themes = APP_THEMES as any[];
	let supportedModels: any[] = [];
	let completionConfig: any = {};
	let initModelConfig: any = {};

	onMount(() => {
		if (!window) return;

		getSupportedModels().then((models) => {
			supportedModels = models;
		});

		getCompletionConfig().then((config) => {
			completionConfig = config;
		});

		getModelConfig().then((modelConfig) => {
			initModelConfig = modelConfig;
		});
	});

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

	function setTheme(themeName) {
		const theme2 = themes[themeName];
		if (theme2) {
			theme.setTheme(themeName);
		}
	}

	function handleSettingsClick() {
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

<Settings
	{chatSessionId}
	bind:settingsHidden
	{setTheme}
	{themes}
	bind:supportedModels
	bind:completionConfig
	bind:initModelConfig
/>
