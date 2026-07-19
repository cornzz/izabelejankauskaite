import type { LayoutServerLoad } from './$types'

// Exposes the logged-in user to the admin layout for the shared nav. Undefined on
// the login/invite pages (the guard doesn't set locals.user there), which hides it.
export const load: LayoutServerLoad = ({ locals }) => {
	return { user: locals.user }
}
