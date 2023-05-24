<script lang="ts">
	import { ArrowPath, CheckCircle, Icon, MagnifyingGlass, XCircle } from 'svelte-hero-icons';
	import { writable } from 'svelte/store';
	import { downloadModel, removeModel } from '../chat/api';

	let searchTerm = '';
	let searchResults: any[] = [];

	let progress = {}; // This now holds progress of all active downloads
	let modelDownloading = {}; // This now holds status of all active downloads

	let isDeletingModelName = '';
	let options = [];

	export let modelConfig = writable({});
	export let allModels: any;
	export let key: any;
	export let chooseModeCallback: (mod: any) => void;

	// update options whenever modelConfig changes
	$: options = $modelConfig[key]?.options;

	// Helper functions
	$: isModelDownloaded = (modelName) => options.filter((opt) => opt.model === modelName).length > 0;
	$: isModelDeleting = (modelName) => isDeletingModelName === modelName;

	$: isModelDownloading = (modelName) =>
		modelDownloading.hasOwnProperty(modelName) && modelDownloading[modelName];

	$: isCurrentModel = (modelName) => $modelConfig[key].value === modelName;

	$: {
		if (searchTerm.length > 0) {
			let results = allModels.filter((mod) =>
				mod.modelName.toLowerCase().includes(searchTerm.toLowerCase())
			);

			// only assign if defined
			if (results) {
				searchResults = results;
			}
		} else {
			searchResults = allModels;
		}
	}

	let confirmDialogShown = false;
	let confirmText = '';
	let resolveDialogPromise = null;

	async function confirm(promptText: string): Promise<boolean> {
		confirmText = promptText;
		confirmDialogShown = true;

		return new Promise((resolve) => {
			resolveDialogPromise = resolve;
		});
	}

	function confirmDialog() {
		confirmDialogShown = false;
		resolveDialogPromise(true);
	}

	function cancelDialog() {
		confirmDialogShown = false;
		resolveDialogPromise(false);
	}

	async function handleModelClick(mod) {
		// if not downloaded open confirm dialog
		if (
			$modelConfig[key].options.filter((opt) => {
				return mod.modelName == opt.model;
			}).length === 0
		) {
			const confirmed = await confirm(`Download ${mod.modelName} (${getReadableSize(mod.size)})?`);
			if (!confirmed) {
				return;
			}

			modelDownloading[mod.modelName] = true; // Start tracking this download

			await downloadModel(mod.modelName, (prog) => {
				progress[mod.modelName] = prog;
			});

			modelConfig.update((modelConfig) => {
				modelConfig[key].options = [
					...modelConfig[key].options,
					{ model: mod.modelName, last_modified: undefined, size: mod.size }
				];
				return modelConfig;
			});

			modelDownloading[mod.modelName] = false; // Stop tracking this download

			return;
		}

		// $modelConfig[key].value = mod.modelName;
	}

	async function handleModelDelete(mod) {
		isDeletingModelName = mod.modelName;
		const body = await removeModel(mod.modelName);

		// remove from modelConfig.options
		$modelConfig[key].options = $modelConfig[key].options.filter((opt) => {
			return opt.model !== mod.modelName;
		});

		isDeletingModelName = '';
	}

	async function handleModelChoose(mod) {
		$modelConfig[key].value = mod.modelName;
		chooseModeCallback(mod);
	}

	function getReadableSize(size) {
		if (size / 1_000_000_000 > 1) return `${(size / 1_000_000_000).toFixed(2)} GB`;
		if (size / 1_000_000 > 1) return `${(size / 1_000_000).toFixed(2)} MB`;
		return 'N/A';
	}
</script>

<!-- Confirm Overlay -->
<div
	class="fixed z-10 inset-0 overflow-y-auto"
	class:hidden={!confirmDialogShown}
	aria-labelledby="modal-title"
	role="dialog"
	aria-modal="true"
>
	<div class="flex items-end justify-center h-[50vh] pt-4 px-4 pb-20 text-center">
		<div
			class="fixed inset-0 bg-black bg-opacity-40 transition-opacity
			filter blur-sm backdrop-blur-sm backdrop-filter backdrop-saturate-150
		"
			aria-hidden="true"
		/>
		<span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"
			>&#8203;</span
		>
		<div
			class="inline-block align-bottom
			bg-[color:var(--primary-light)]
			rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
		>
			<div class="bg-[color:var(--primary-light)] px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
				<div class="sm:flex sm:items-start">
					<div class="mt-0 text-center sm:mt-0 sm:ml-4 sm:text-left">
						<h3 class="text-lg leading-6 font-medium" id="modal-title">
							{confirmText}
						</h3>
					</div>
				</div>
			</div>
			<div class="flex bg-[color:var(--primary-light)] px-4 py-3 align-end justify-end space-x-2">
				<button
					type="button"
					class="w-32 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[color:var(--light-transparent)] hover:bg-[color:var(--dark-transparent)]"
					on:click|preventDefault={cancelDialog}
				>
					Cancel
				</button>
				<button
					type="button"
					class="w-32 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[color:var(--light-transparent)] hover:bg-[color:var(--dark-transparent)]"
					on:click|preventDefault={confirmDialog}
				>
					Confirm
				</button>
			</div>
		</div>
	</div>
</div>

<!-- Model Selection Area -->
<!-- <label class="block text-sm font-bold my-2" for="theme"> Select model </label> -->

<!-- Search models -->
<div class="flex flex-col space-y-1 w-full mb-4">
	<div class="cx-search-bar-inner">
		<Icon src={MagnifyingGlass} class="ml-4 w-5 h-5 text-[color:var(--bright)]" />
		<input
			bind:value={searchTerm}
			type="text"
			placeholder="Search Model Titles"
			class="text-sm w-full outline-none bg-[color:var(--primary-light)]"
			on:input={async () => {
				if (searchTerm.length === 0) {
					return;
				}
			}}
		/>
		{#if searchTerm.length > 0}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div
				on:click={() => {
					searchTerm = '';
				}}
				class="
				mr-4 w-5 h-5 text-gray-700 transform translate-x-[-0.75rem]
				hover:-translate-y-[1px]
				cursor-pointer
				"
			>
				<Icon src={XCircle} />
			</div>
		{/if}
	</div>
</div>

<!-- Models -->
<div class="flex flex-col h-full w-full">
	{#each searchResults as mod, index}
		<!-- Buttons -->
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div
			class="
			flex flex-col cursor-pointer hover:bg-[color:var(--dark-transparent)] pt-2 pb-4
			{isModelDownloaded(mod.modelName) ? '' : 'opacity-[55%]'}
			"
			on:click={() => handleModelClick(mod)}
		>
			<div class="flex items-start justify-between items-center">
				<div class="flex items-start items-center">
					<div class="flex rounded-sm p-2 px-4 ml-2 font-bold">
						{mod.modelName.replace('ggml-', '').replace('.bin', '')}
					</div>
				</div>
				<div class="flex items-center space-x-2 mr-2">
					{#if isCurrentModel(mod.modelName)}
						<Icon src={CheckCircle} class="w-5 h-5 text-[color:var(--bright)]" />
					{:else}
						<Icon src={XCircle} class="w-5 h-5 text-[color:var(--light-transparent)]" />
					{/if}

					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<div on:click={async () => handleModelDelete(mod)}>
						{#if isModelDeleting(mod.modelName)}
							<Icon src={ArrowPath} class="w-5 h-5 text-[color:var(--font-color)] animate-spin" />
						{:else}
							<Icon src={XCircle} class="w-5 h-5 text-[color:var(--font-color)]" />
						{/if}
					</div>
				</div>
			</div>

			<!-- Model Descr -->
			<div class="flex rounded-sm p-2 px-4 ml-2 font-normal text-xs">
				{mod.description}
			</div>

			<!-- Pills -->
			<div class="flex ml-4 mt-2 space-x-2 pr-2">
				<div
					class="w-24 bg-[var(--dark-transparent)] text-xs rounded-full p-2 px-4 overflow-hidden overflow-ellipsis whitespace-nowrap text-center"
				>
					{mod.trainingEntity}
				</div>
				<div
					class="w-24 bg-[var(--dark-transparent)] text-xs rounded-full p-2 px-4 overflow-hidden overflow-ellipsis whitespace-nowrap text-center"
				>
					{mod.baseModel}
				</div>
				<div
					class="w-24 bg-[var(--dark-transparent)] text-xs rounded-full p-2 px-4 overflow-hidden overflow-ellipsis whitespace-nowrap text-center"
				>
					{mod.modelSize ? mod.modelSize : 'N/A'}
				</div>
				<div
					class="w-24 bg-[var(--dark-transparent)] text-xs rounded-full p-2 px-4 overflow-hidden overflow-ellipsis whitespace-nowrap text-center"
				>
					{mod.commerciallyUsable ? 'Commercially Available' : 'Non Commercial'}
				</div>
				<div
					class="w-24 bg-[var(--dark-transparent)] text-xs rounded-full p-2 px-4 overflow-hidden overflow-ellipsis whitespace-nowrap text-center"
				>
					{getReadableSize(mod.size)}
				</div>

				{#if modelDownloading[mod.modelName]}
					<div
						class="w-24 bg-[var(--dark-transparent)] text-xs rounded-full p-2 px-4 overflow-hidden overflow-ellipsis whitespace-nowrap text-center"
					>
						{getReadableSize(progress[mod.modelName])}
					</div>
				{/if}
			</div>

			<!-- Choose Button -->
			<div class="flex items-center justify-end space-x-2 pr-2 mt-4">
				{#if isModelDownloaded(mod.modelName)}
					{#if $modelConfig[key].selectedModel == mod.modelName}
						<div
							class="w-32 bg-[color:var(--bright)] text-xs rounded-md p-3 px-4 overflow-hidden overflow-ellipsis whitespace-nowrap text-center hover:bg-[color:var(--light-transparent)]"
						>
							{'Selected'}
						</div>
					{:else}
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<div
							class="w-32 bg-[color:var(--dark-transparent)] text-xs rounded-md p-3 px-4 overflow-hidden overflow-ellipsis whitespace-nowrap text-center hover:bg-[color:var(--light-transparent)]"
							on:click={() => handleModelChoose(mod)}
						>
							{'Choose'}
						</div>
					{/if}
				{:else}
					<div
						class="w-32 bg-[color:var(--dark-transparent)] text-xs rounded-md p-3 px-4 overflow-hidden overflow-ellipsis whitespace-nowrap text-center hover:bg-[color:var(--light-transparent)]"
					>
						{'Download First'}
					</div>
				{/if}
			</div>

			<!-- Download Progress -->
			{#if modelDownloading[mod.modelName] && progress[mod.modelName] > 1}
				<div class="flex items-center justify-between px-6 pt-4">
					<div
						class="w-full bg-[color:var(--light-transparent)]
                                        rounded-full h-1.5"
					>
						<div
							class="bg-[color:var(--bright)] rounded-full
                                                h-1.5 rounded-full opacity-[0.75]"
							style="width: {(progress[mod.modelName] / mod.size) * 100}%"
						/>
					</div>
				</div>

				<div class="flex items-center text-xs justify-between px-6 pt-2">downloading</div>
			{/if}
		</div>
		<hr class="border-[color:var(--light-transparent)] w-[calc(100%-3rem)] mx-auto pb-2" />
	{/each}
</div>
