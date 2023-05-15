<script lang="ts">
	import { setany } from './context';
	import { browser } from '$app/environment';
	import '../app.css';
	import Theme from './Theme.svelte';
	import { writable } from 'svelte/store';
	import { APP_THEMES } from '../themes';

	let theme = 'system';

	if (browser) {
		const saved = localStorage.theme;
		theme = saved || 'Default';

		// // split into 4 hex values
		const { primary, primaryLight, secondary, bright, fontColor } = APP_THEMES[theme];

		// // set css variables
		document.documentElement.style.setProperty('--primary', primary);
		document.documentElement.style.setProperty('--primary-light', primaryLight);
		document.documentElement.style.setProperty('--secondary', secondary);
		document.documentElement.style.setProperty('--bright', bright);
		document.documentElement.style.setProperty('--font-color', fontColor);

		// if (saved === 'light' || saved === 'dark') {
		// }
	}
	const { subscribe, set } = writable(theme);

	function setTheme(value: any) {
		// // split into 4 hex values
		const { primary, primaryLight, secondary, bright, fontColor } = APP_THEMES[value];

		// // set css variables
		document.documentElement.style.setProperty('--primary', primary);
		document.documentElement.style.setProperty('--primary-light', primaryLight);
		document.documentElement.style.setProperty('--secondary', secondary);
		document.documentElement.style.setProperty('--bright', bright);
		document.documentElement.style.setProperty('--font-color', fontColor);

		// only update if valid, and it's changed
		// if (themes.includes(value) && value !== theme) {
		if (value !== theme) {
			theme = value;
			set(theme);
		}
	}
	const store = {
		subscribe,
		setTheme
	};
	setany(store);
</script>

<Theme />
<slot />
