import adapter from '@sveltejs/adapter-vercel'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		// ISR is configured per-route (see src/routes/+page.server.ts) so that only the
		// public page is cached — the dynamic /admin routes must never be ISR-cached.
		adapter: adapter()
	}
}

export default config
