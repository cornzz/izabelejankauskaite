import { env } from '$env/dynamic/private'

// Revalidate the ISR-cached public page so calendar edits appear immediately instead
// of within the up-to-1h expiration window. Best-effort: a revalidation hiccup must
// never fail the write action that triggered it.
export async function revalidatePublicPage(): Promise<void> {
	if (!env.ISR_BYPASS_TOKEN || !env.ORIGIN) return
	try {
		await fetch(new URL('/', env.ORIGIN), { headers: { 'x-prerender-revalidate': env.ISR_BYPASS_TOKEN } })
	} catch {
		// Ignore — the page still refreshes on its next natural revalidation.
	}
}
