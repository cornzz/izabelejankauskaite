import { clearChallenge, readChallenge } from '$lib/server/auth/challenge'
import { origin, rpID } from '$lib/server/auth/config'
import { validInvite } from '$lib/server/auth/invites'
import { createSession } from '$lib/server/auth/session'
import { db } from '$lib/server/db'
import { credentials, invites } from '$lib/server/db/schema'
import { verifyRegistrationResponse } from '@simplewebauthn/server'
import { isoBase64URL } from '@simplewebauthn/server/helpers'
import { error, json, type RequestHandler } from '@sveltejs/kit'
import { eq } from 'drizzle-orm'

export const POST: RequestHandler = async ({ request, cookies }) => {
	const { token, attResp } = await request.json()
	const valid = await validInvite(token)
	if (!valid) throw error(400, 'Invalid or expired invite')

	const expectedChallenge = await readChallenge(cookies)
	if (!expectedChallenge) throw error(400, 'Challenge expired — please try again')

	let verification
	try {
		verification = await verifyRegistrationResponse({
			response: attResp,
			expectedChallenge,
			expectedOrigin: origin(),
			expectedRPID: rpID()
		})
	} catch (caught) {
		throw error(400, caught instanceof Error ? caught.message : 'Registration verification failed')
	}

	if (!verification.verified || !verification.registrationInfo) {
		throw error(400, 'Registration could not be verified')
	}

	const { credential } = verification.registrationInfo
	await db.insert(credentials).values({
		id: credential.id,
		userId: valid.invite.userId,
		publicKey: isoBase64URL.fromBuffer(credential.publicKey),
		counter: credential.counter,
		transports: credential.transports ?? null
	})
	await db.update(invites).set({ usedAt: new Date() }).where(eq(invites.token, token))

	clearChallenge(cookies)

	await createSession(cookies, { id: valid.user.id, name: valid.user.name })

	return json({ verified: true })
}
