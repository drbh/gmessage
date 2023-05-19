export const manifest = {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png"]),
	mimeTypes: {".png":"image/png"},
	_: {
		client: {"start":"_app/immutable/entry/start.9f5ef35b.js","app":"_app/immutable/entry/app.1405f26b.js","imports":["_app/immutable/entry/start.9f5ef35b.js","_app/immutable/chunks/index.85b5e1b2.js","_app/immutable/chunks/singletons.6703ccb7.js","_app/immutable/chunks/index.8b5e8e90.js","_app/immutable/entry/app.1405f26b.js","_app/immutable/chunks/index.85b5e1b2.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			() => import('./nodes/0.js'),
			() => import('./nodes/1.js'),
			() => import('./nodes/2.js')
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
};
