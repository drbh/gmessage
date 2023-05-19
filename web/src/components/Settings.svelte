<script lang="ts">
	import { onMount } from 'svelte';
	import {
		ArrowPath,
		ChatBubbleLeftEllipsis,
		Icon,
		RectangleStack,
		WrenchScrewdriver,
		XCircle
	} from 'svelte-hero-icons';
	import { writable } from 'svelte/store';
	import { updateModelConfig, updateChatCompletionConfig } from '../chat/api';

	export let chatSessionId: string = '';
	export let themes: any[] = [];
	export let setTheme = (themeName: any) => {};
	export let settingsHidden = true;
	export let supportedModels: any[] = [];
	export let completionConfig: any = {};
	export let initModelConfig: any = {};

	let currentSection = 'Model Config';
	let validSections = ['Model Config', 'Chat Completion Config', 'Theme'];

	// Create stores for chatCompletionConfig and modelConfig
	const chatCompletionConfig = writable({
		logits_size: {
			type: 'number',
			value: 0,
			min: 0,
			max: 999
		},
		tokens_size: {
			type: 'number',
			value: 0,
			min: 0,
			max: 999
		},
		n_past: {
			type: 'number',
			value: 0,
			min: 0,
			max: 999
		},
		n_ctx: {
			type: 'number',
			value: 0,
			min: 0,
			max: 999
		},
		n_predict: {
			type: 'number',
			value: 100,
			min: 0,
			max: 999
		},
		top_k: {
			type: 'number',
			value: 5,
			min: 0,
			max: 999
		},
		top_p: {
			type: 'number',
			value: 0.9,
			min: 0,
			max: 1
		},
		temp: {
			type: 'number',
			value: 0.2,
			min: 0,
			max: 1
		},
		n_batch: {
			type: 'number',
			value: 4,
			min: 1,
			max: 999
		},
		repeat_penalty: {
			type: 'number',
			value: 1.1,
			min: 1,
			max: 10
		},
		repeat_last_n: {
			type: 'number',
			value: 64,
			min: 1,
			max: 999
		},
		context_erase: {
			type: 'number',
			value: 0.0,
			min: 0,
			max: 1
		},
		verbose: {
			type: 'boolean',
			value: 'false',
			options: ['true', 'false']
		}
	});

	const modelConfig = writable({
		model: {
			type: 'dropdown',
			value: 'ggml-mpt-7b-chat.bin',
			options: supportedModels
		},
		n_threads: {
			type: 'number',
			value: 1,
			min: 1,
			max: 999
		}
	});

	// listen for changes to supportedModels
	$: {
		modelConfig.update((modelConfig) => {
			modelConfig.model.options = supportedModels;
			return modelConfig;
		});
	}

	$: {
		chatCompletionConfig.update((chatCompletionConfig) => {
			chatCompletionConfig.logits_size.value = completionConfig.logits_size;
			chatCompletionConfig.tokens_size.value = completionConfig.tokens_size;
			chatCompletionConfig.n_past.value = completionConfig.n_past;
			chatCompletionConfig.n_ctx.value = completionConfig.n_ctx;
			chatCompletionConfig.n_predict.value = completionConfig.n_predict;
			chatCompletionConfig.top_k.value = completionConfig.top_k;
			chatCompletionConfig.top_p.value = completionConfig.top_p;
			chatCompletionConfig.temp.value = completionConfig.temp;
			chatCompletionConfig.n_batch.value = completionConfig.n_batch;
			chatCompletionConfig.repeat_penalty.value = completionConfig.repeat_penalty;
			chatCompletionConfig.repeat_last_n.value = completionConfig.repeat_last_n;
			chatCompletionConfig.context_erase.value = completionConfig.context_erase;
			chatCompletionConfig.verbose.value = completionConfig.verbose;
			return chatCompletionConfig;
		});
	}

	// modelConfig
	$: {
		modelConfig.update((modelConfig) => {
			modelConfig.model.value = initModelConfig.model;
			modelConfig.n_threads.value = initModelConfig.n_threads;
			return modelConfig;
		});
	}

	// Function to handle section navigation
	const navigateToSection = (sectionId) => {
		currentSection = sectionId;
	};

	let isSavingModelConfig = false;

	const handleSaveModelConfig = async () => {
		isSavingModelConfig = true;

		updateModelConfig({
			model: $modelConfig.model.value,
			n_threads: $modelConfig.n_threads.value
		});

		isSavingModelConfig = false;
	};

	let isSavingChatCompletionConfig = false;

	const handleSaveChatCompletionConfig = async () => {
		isSavingChatCompletionConfig = true;

		updateChatCompletionConfig({
			logits_size: $chatCompletionConfig.logits_size.value,
			tokens_size: $chatCompletionConfig.tokens_size.value,
			n_past: $chatCompletionConfig.n_past.value,
			n_ctx: $chatCompletionConfig.n_ctx.value,
			n_predict: $chatCompletionConfig.n_predict.value,
			top_k: $chatCompletionConfig.top_k.value,
			top_p: $chatCompletionConfig.top_p.value,
			temp: $chatCompletionConfig.temp.value,
			n_batch: $chatCompletionConfig.n_batch.value,
			repeat_penalty: $chatCompletionConfig.repeat_penalty.value,
			repeat_last_n: $chatCompletionConfig.repeat_last_n.value,
			context_erase: $chatCompletionConfig.context_erase.value,
			verbose: $chatCompletionConfig.verbose.value
		});

		isSavingChatCompletionConfig = false;
	};
</script>

<!-- Start Settings Page -->
<div class="cx-settings-pane" class:hidden={settingsHidden}>
	<!-- Header -->
	<div class="cx-settings-header">
		<div class=" opacity-50 text-[14pt] font-[600]">Settings</div>
		<button
			class="z-50 opacity-50 hover:opacity-100 transition duration-300 ease-in-out"
			on:click={() => (settingsHidden = true)}
		>
			<Icon src={XCircle} class="w-6 h-6" />
		</button>
	</div>

	<!-- Main Area -->
	<div class="flex h-[calc(100%-60px)]">
		<!-- Sidebar -->
		<div class="cx-settings-sidebar">
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div
				class="cx-recent-conversation justify-start pr-8 text-[color:var(--font-color)] opacity-50"
				on:click={() => navigateToSection('Model Config')}
			>
				<Icon src={WrenchScrewdriver} class="w-5 h-5" />
				<span>Model Config</span>
			</div>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div
				class="cx-recent-conversation justify-start pr-8 text-[color:var(--font-color)] opacity-50"
				on:click={() => navigateToSection('Chat Completion Config')}
			>
				<Icon src={ChatBubbleLeftEllipsis} class="w-5 h-5" />
				<span>Chat Config</span>
			</div>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div
				class="cx-recent-conversation justify-start pr-8 text-[color:var(--font-color)] opacity-50"
				on:click={() => navigateToSection('Themes')}
			>
				<Icon src={RectangleStack} class="w-5 h-5" />
				<span>Themes</span>
			</div>
		</div>

		<!-- Pages -->
		<div class="w-[calc(100%-200px)] p-5 overflow-y-scroll">
			{#if currentSection === 'Model Config'}
				<form class="cx-settings-panel">
					<div class="flex flex-col space-y-2 overflow-y-auto h-full">
						{#each Object.keys($modelConfig) as key (key)}
							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<div
								class="flex flex-col items-start"
								on:click={() => navigateToSection('Model Config', key)}
							>
								<!-- <div class="text-[color:var(--font-color)] ml-1 mb-1 opacity-50">{key}</div>
								<input
									class="cx-settings-input w-full"
									id="model"
									type="text"
									bind:value={$modelConfig[key]}
								/> -->

								<!-- if type == dropdown -->
								{#if $modelConfig[key].type === 'dropdown'}
									<div class="text-[color:var(--font-color)] ml-1 mb-1 opacity-50">{key}</div>
									<select
										class="cx-settings-input w-full"
										id={key}
										bind:value={$modelConfig[key].value}
									>
										{#each $modelConfig[key].options as option (option)}
											<option value={option}>{option}</option>
										{/each}
									</select>
								{/if}

								<!-- if type == number -->
								{#if $modelConfig[key].type === 'number'}
									<div class="text-[color:var(--font-color)] ml-1 mb-1 opacity-50">{key}</div>
									<input
										class="cx-settings-input"
										id={key}
										type="number"
										bind:value={$modelConfig[key].value}
										min={$modelConfig[key].min}
										max={$modelConfig[key].max}
									/>
								{/if}
							</div>
						{/each}

						<div class="mb-4">
							<!-- Repeat above block for each field, replace the 'for' attribute and 'placeholder' attribute accordingly -->
						</div>
						<div class="flex justify-end">
							<button on:click={handleSaveModelConfig} class="cx-settings-button" type="button">
								<!-- If isSavingModelConfig show spinner -->
								{#if isSavingModelConfig}
									<div class="flex">
										<Icon src={ArrowPath} class="w-5 h-5 mt-[0.15rem] mr-2 animate-spin" />
										Saving...
									</div>
								{:else}
									Save Settings
								{/if}
							</button>
						</div>
					</div>
				</form>
			{/if}

			{#if currentSection === 'Chat Completion Config'}
				<form class="cx-settings-panel">
					<div class="flex flex-col space-y-2 overflow-y-auto h-full">
						{#each Object.keys($chatCompletionConfig) as key (key)}
							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<div on:click={() => navigateToSection('Chat Completion Config', key)}>
								<!-- <div class="text-[color:var(--font-color)] ml-1 mb-1 opacity-50">{key}</div>
								<input
									class="cx-settings-input w-full"
									id="model"
									type="text"
									bind:value={$chatCompletionConfig[key]}
								/> -->

								<!-- if type == number -->
								{#if $chatCompletionConfig[key].type === 'number'}
									<div class="text-[color:var(--font-color)] ml-1 mb-1 opacity-50">{key}</div>
									<input
										class="cx-settings-input w-full"
										id={key}
										type="number"
										bind:value={$chatCompletionConfig[key].value}
										min={$chatCompletionConfig[key].min}
										max={$chatCompletionConfig[key].max}
									/>
								{/if}

								<!-- if type == boolean -->
								{#if $chatCompletionConfig[key].type === 'boolean'}
									<div class="text-[color:var(--font-color)] ml-1 mb-1 opacity-50">{key}</div>
									<select
										class="cx-settings-input w-full"
										id={key}
										bind:value={$chatCompletionConfig[key].value}
									>
										{#each $chatCompletionConfig[key].options as option (option)}
											<option value={option}>{option}</option>
										{/each}
									</select>
								{/if}
							</div>
						{/each}

						<div class="mb-4">
							<!-- Repeat above block for each field, replace the 'for' attribute and 'placeholder' attribute accordingly -->
						</div>
						<div class="flex justify-end">
							<button
								on:click={handleSaveChatCompletionConfig}
								class="
								mt-4
								bg-[color:var(--light-transparent)]
								hover:bg-[color:var(--dark-transparent)]
								text-white font-bold py-2 px-4
								rounded focus:outline-none focus:shadow-outline"
								type="button"
							>
								Save Settings
							</button>
						</div>
					</div>
				</form>
			{/if}

			{#if currentSection === 'Themes'}
				<div class="cx-settings-panel">
					<label class="block text-sm font-bold mb-2" for="theme"> Select Theme </label>

					<!-- Theme Card -->
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<div class="flex flex-col space-y-2 overflow-y-auto h-full">
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
			{/if}
		</div>
	</div>
</div>
