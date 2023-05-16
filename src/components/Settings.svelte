<script lang="ts">
	import { Icon, XCircle } from 'svelte-hero-icons';

	export let chatSessionId: string = '';
	export let themes: any[] = [];
	export let setTheme = (themeName: any) => {};
	export let settingsHidden = true;
</script>

<!-- Start Settings Page -->
<div class="cx-settings-pane" class:hidden={settingsHidden}>
	<div class="flex justify-between items-start pb-4 py-4 px-4 w-[100%]">
		<div>&nbsp;</div>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div
			class="z-50"
			on:click={() => {
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
