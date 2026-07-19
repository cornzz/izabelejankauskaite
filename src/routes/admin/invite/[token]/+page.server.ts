import type { PageServerLoad } from './$types'
import { redirect } from '@sveltejs/kit'
import { getSession } from '$lib/server/auth/session'
import { validInvite } from '$lib/server/auth/invites'

export const load: PageServerLoad = async ({ params, cookies }) => {
	// If the visitor is already logged in — e.g. right after finishing registration
	// (which signs them in), or reopening the link on a signed-in device — send them
	// to the admin panel instead of the now-used "invite unavailable" view.
	if (await getSession(cookies)) throw redirect(303, '/admin')

	const valid = await validInvite(params.token)

	return {
		token: params.token,
		valid: Boolean(valid),
		name: valid?.user.name ?? null
	}
}
