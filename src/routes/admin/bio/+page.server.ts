import type { Actions } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { getBiography, setBiography } from '$lib/server/content'
import { revalidatePublicPage } from '$lib/server/revalidate'

export const load: PageServerLoad = async () => {
	return { biography: await getBiography() }
}

export const actions: Actions = {
	save: async ({ request }) => {
		const biography = (await request.formData()).get('biography')?.toString() ?? ''
		await setBiography(biography.trim())
		await revalidatePublicPage()

		return { saved: true }
	}
}
