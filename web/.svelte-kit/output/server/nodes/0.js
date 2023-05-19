import * as universal from '../entries/pages/_layout.ts.js';

export const index = 0;
export const component = async () => (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.ts";
export const imports = ["_app/immutable/nodes/0.7daa36fd.js","_app/immutable/chunks/index.85b5e1b2.js","_app/immutable/chunks/themes.8524857b.js","_app/immutable/chunks/index.8b5e8e90.js"];
export const stylesheets = ["_app/immutable/assets/0.83275cb3.css"];
export const fonts = [];
