<script lang="ts">
	import { onMount } from 'svelte';
	import { getany } from './context';
	const theme = getany();
	// NOTE: the body of this function is also written into the page head to execute on initial page load
	const applyTheme = () => {
		document.documentElement.classList.toggle(
			'dark',
			localStorage.theme === 'dark' ||
				(!localStorage.theme && window.matchMedia('(prefers-color-scheme: dark)').matches)
		);
	};
	// set theme if storage changes (could be from a different tab)
	function onStorage() {
		theme.setTheme(localStorage.theme || 'system');
	}
	// persist and apply the theme on change
	function onTheme(value: string) {
		switch (value) {
			case 'light':
			case 'dark':
				localStorage.setItem('theme', value);
				break;
			case 'system':
				localStorage.removeItem('theme');
				break;
			default:
				// this is a custom theme
				localStorage.setItem('theme', value);
		}
		applyTheme();
	}
	onMount(() => {
		const mediaQuery = matchMedia('(prefers-color-scheme: dark)');
		if (mediaQuery.addEventListener) {
			mediaQuery.addEventListener('change', applyTheme);
		} else {
			mediaQuery.addListener(applyTheme);
		}
		addEventListener('storage', onStorage);
		if (!theme) {
			return;
		}
		const unsubscribe = theme.subscribe(onTheme);
		// this will _usually_ just stay mounted, but meh ... good practice to show best practices
		return () => {
			if (mediaQuery.removeEventListener) {
				mediaQuery.removeEventListener('change', applyTheme);
			} else {
				mediaQuery.removeListener(applyTheme);
			}
			removeEventListener('storage', onStorage);
			unsubscribe();
		};
	});
	// avoid defining the function twice (we want to run the same script in the head as when the theme changes)
	const updateFn = applyTheme.toString();
	const updateScript = '<scr' + 'ipt>' + updateFn.substring(6) + '</scr' + 'ipt>';
</script>
<!-- this sets initial dark mode class based on user preference / device settings (in head to avoid FOUC) -->
<svelte:head>{@html updateScript}</svelte:head>