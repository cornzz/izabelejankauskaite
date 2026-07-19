import { SignJWT, jwtVerify } from 'jose'
import { dev } from '$app/environment'
import type { Cookies } from '@sveltejs/kit'
import { authSecret } from './config'

// The WebAuthn challenge is held between the two ceremony calls in a short-lived,
// signed cookie — stateless, so no server table is needed. Scoped to /admin so it
// rides along with the /admin/api/* endpoints only.
const COOKIE = 'webauthn_challenge'
const MAX_AGE = 60 * 5 // 5 minutes

export async function setChallenge(cookies: Cookies, challenge: string): Promise<void> {
	const token = await new SignJWT({ challenge })
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setExpirationTime(`${MAX_AGE}s`)
		.sign(authSecret())

	cookies.set(COOKIE, token, {
		path: '/admin',
		httpOnly: true,
		secure: !dev,
		sameSite: 'lax',
		maxAge: MAX_AGE
	})
}

export async function readChallenge(cookies: Cookies): Promise<string | null> {
	const token = cookies.get(COOKIE)
	if (!token) return null
	try {
		const { payload } = await jwtVerify(token, authSecret())

		return typeof payload.challenge === 'string' ? payload.challenge : null
	} catch {
		return null
	}
}

export function clearChallenge(cookies: Cookies): void {
	cookies.delete(COOKIE, { path: '/admin' })
}
