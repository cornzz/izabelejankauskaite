import { clearChallenge, readChallenge } from '$lib/server/auth/challenge'
import { origin, rpID } from '$lib/server/auth/config'
import { createSession } from '$lib/server/auth/session'
import { db } from '$lib/server/db'
import { credentials, users } from '$lib/server/db/schema'
import type { AuthenticatorTransportFuture } from '@simplewebauthn/server'
import { verifyAuthenticationResponse } from '@simplewebauthn/server'
import { isoBase64URL } from '@simplewebauthn/server/helpers'
import { error, json, type RequestHandler } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'

export const POST: RequestHandler = async ({ request, cookies }) => {
	const { attResp } = await request.json()

	const expectedChallenge = await readChallenge(cookies)
	if (!expectedChallenge) throw error(400, 'Challenge expired — please try again')

	// The presented passkey identifies which credential (and thus which user) is signing in.
	const [cred] = await db.select().from(credentials).where(eq(credentials.id, attResp?.id))
	if (!cred) throw error(400, 'Unknown passkey — register via an invite first')

	const [user] = await db.select().from(users).where(eq(users.id, cred.userId))
	if (!user) throw error(400, 'Account no longer exists')

	let verification
	try {
		verification = await verifyAuthenticationResponse({
			response: attResp,
			expectedChallenge,
			expectedOrigin: origin(),
			expectedRPID: rpID(),
			credential: {
				id: cred.id,
				publicKey: isoBase64URL.toBuffer(cred.publicKey),
				counter: cred.counter,
				transports: (cred.transports ?? undefined) as AuthenticatorTransportFuture[] | undefined
			}
		})
	} catch (caught) {
		throw error(400, caught instanceof Error ? caught.message : 'Authentication verification failed')
	}

	if (!verification.verified) throw error(400, 'Authentication could not be verified')

	await db
		.update(credentials)
		.set({ counter: verification.authenticationInfo.newCounter })
		.where(eq(credentials.id, cred.id))

	clearChallenge(cookies)
	await createSession(cookies, { id: user.id, name: user.name })

	return json({ verified: true })
}
