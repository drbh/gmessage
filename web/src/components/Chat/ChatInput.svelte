<script lang="ts">
	import { Icon, PaperAirplane } from 'svelte-hero-icons';

	export let inputEl: any;
	export let handleKeyUp: any;
	export let updateHeight: any;
	export let sendMessage: any;
</script>

<!-- Start Chat Input -->
<div
	class="absolute bottom-0
		w-[calc(100vw-380px)]
		mx-auto"
>
	<div class="cx-chat-input">
		<div class="flex items-end w-full">
			<div
				class="cx-chat-input-inside"
			>
				<textarea
					id="chatbox-input"
					placeholder="Type here..."
					class="cx-chat-input-textarea"
					style="height: 22px;"
					bind:this={inputEl}
					on:keyup={handleKeyUp}
					on:input={updateHeight}
				/>
			</div>
			<button
				class="cx-chat-send-button"
				on:click={sendMessage}
			>
				<Icon src={PaperAirplane} class="w-6 h-6" />
			</button>
		</div>
	</div>
</div>
<!-- End Chat Input -->
