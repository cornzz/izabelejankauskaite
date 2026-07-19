import { getSession } from '$lib/server/auth/session'
import { redirect, type Handle } from '@sveltejs/kit'

export const handle: Handle = async ({ event, resolve }) => {
	const { pathname } = event.url

	// Guard the admin surface. The login/invite pages and the WebAuthn API endpoints
	// are excluded — they run their own checks (session-less by design).
	if (
		pathname.startsWith('/admin') &&
		!pathname.startsWith('/admin/login') &&
		!pathname.startsWith('/admin/invite') &&
		!pathname.startsWith('/admin/api')
	) {
		const user = await getSession(event.cookies)
		if (!user) throw redirect(303, '/admin/login')

		event.locals.user = user
	}

	return resolve(event)
}
