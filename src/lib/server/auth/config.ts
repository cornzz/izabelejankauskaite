import { env } from '$env/dynamic/private'

// WebAuthn / session configuration, read from $env/dynamic/private at runtime.
// These throw (rather than silently using a default) so a misconfigured deploy
// fails loudly instead of minting unverifiable passkeys or unsigned cookies.

export function authSecret(): Uint8Array {
	if (!env.SESSION_SECRET) throw new Error('SESSION_SECRET is not set')
	return new TextEncoder().encode(env.SESSION_SECRET)
}

export function rpID(): string {
	if (!env.RP_ID) throw new Error('RP_ID is not set')
	return env.RP_ID
}

export function origin(): string {
	if (!env.ORIGIN) throw new Error('ORIGIN is not set')
	return env.ORIGIN
}

export function rpName(): string {
	return env.RP_NAME ?? 'Admin'
}
