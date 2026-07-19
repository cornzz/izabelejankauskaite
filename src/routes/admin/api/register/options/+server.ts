import { setChallenge } from '$lib/server/auth/challenge'
import { rpID, rpName } from '$lib/server/auth/config'
import { validInvite } from '$lib/server/auth/invites'
import { db } from '$lib/server/db'
import { credentials } from '$lib/server/db/schema'
import type { AuthenticatorTransportFuture } from '@simplewebauthn/server'
import { generateRegistrationOptions } from '@simplewebauthn/server'
import { error, json, type RequestHandler } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'

export const POST: RequestHandler = async ({ request, cookies }) => {
	const { token } = await request.json()
	const valid = await validInvite(token)
	if (!valid) throw error(400, 'Invalid or expired invite')
	const { user } = valid

	const existing = await db.select().from(credentials).where(eq(credentials.userId, user.id))

	const options = await generateRegistrationOptions({
		rpName: rpName(),
		rpID: rpID(),
		userName: user.name,
		userID: new TextEncoder().encode(user.id),
		excludeCredentials: existing.map((cred) => ({
			id: cred.id,
			transports: (cred.transports ?? undefined) as AuthenticatorTransportFuture[] | undefined
		})),
		// Require a discoverable (resident) passkey with user verification, so
		// credential-first login (empty allowCredentials) can offer it.
		authenticatorSelection: {
			residentKey: 'required',
			userVerification: 'required'
		}
	})

	await setChallenge(cookies, options.challenge)

	return json(options)
}
