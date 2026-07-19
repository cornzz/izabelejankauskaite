import { setChallenge } from '$lib/server/auth/challenge'
import { rpID } from '$lib/server/auth/config'
import { generateAuthenticationOptions } from '@simplewebauthn/server'
import { json, type RequestHandler } from '@sveltejs/kit'

export const POST: RequestHandler = async ({ cookies }) => {
	// No allowCredentials → rely on discoverable passkeys, so the authenticator offers
	// whichever enrolled passkey lives on the device; we resolve the user on verify.
	const options = await generateAuthenticationOptions({ rpID: rpID(), userVerification: 'required' })
	await setChallenge(cookies, options.challenge)

	return json(options)
}
