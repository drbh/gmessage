import { getContext, setContext } from 'svelte';
const key = {};
export function getany() {
	const ctx = getContext<any>(key);
	return ctx;
}
export function setany(store: any) {
	setContext(key, store);
}