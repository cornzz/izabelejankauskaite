import { startAuthentication, startRegistration } from '@simplewebauthn/browser'

// Browser-only WebAuthn ceremony helpers. Import directly (not via the $lib barrel)
// so @simplewebauthn/browser never leaks into the server bundle.

async function postJSON(url: string, body: unknown): Promise<Record<string, unknown>> {
	const response = await fetch(url, {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(body)
	})
	const data = await response.json().catch(() => ({}))
	if (!response.ok) throw new Error(typeof data?.message === 'string' ? data.message : 'Request failed')

	return data
}

export async function registerPasskey(token: string): Promise<void> {
	const optionsJSON = await postJSON('/admin/api/register/options', { token })
	const attResp = await startRegistration({ optionsJSON: optionsJSON as never })
	await postJSON('/admin/api/register/verify', { token, attResp })
}

export async function loginWithPasskey(): Promise<void> {
	const optionsJSON = await postJSON('/admin/api/login/options', {})
	const attResp = await startAuthentication({ optionsJSON: optionsJSON as never })
	await postJSON('/admin/api/login/verify', { attResp })
}
