/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }: any) {
	// TOOD: add middlewares
	return await resolve(event);
}
