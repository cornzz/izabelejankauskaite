import { dev } from '$app/environment'
import type { Cookies } from '@sveltejs/kit'
import { SignJWT, jwtVerify } from 'jose'
import { authSecret } from './config'

const COOKIE = 'session'
const MAX_AGE = 60 * 60 * 24 * 30 // 30 days

export type SessionUser = { id: string; name: string }

// Sign a stateless session JWT and set it as an httpOnly cookie. `name` is embedded
// so the route guard needs no DB lookup per request.
export async function createSession(cookies: Cookies, user: SessionUser): Promise<void> {
	const token = await new SignJWT({ name: user.name })
		.setProtectedHeader({ alg: 'HS256' })
		.setSubject(user.id)
		.setIssuedAt()
		.setExpirationTime(`${MAX_AGE}s`)
		.sign(authSecret())

	cookies.set(COOKIE, token, {
		path: '/',
		httpOnly: true,
		secure: !dev,
		sameSite: 'lax',
		maxAge: MAX_AGE
	})
}

export async function getSession(cookies: Cookies): Promise<SessionUser | null> {
	const token = cookies.get(COOKIE)
	if (!token) return null
	try {
		const { payload } = await jwtVerify(token, authSecret())
		if (!payload.sub || typeof payload.name !== 'string') return null

		return { id: payload.sub, name: payload.name }
	} catch {
		return null
	}
}

export function clearSession(cookies: Cookies): void {
	cookies.delete(COOKIE, { path: '/' })
}
