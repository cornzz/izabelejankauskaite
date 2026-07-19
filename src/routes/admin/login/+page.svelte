<script lang="ts">
	import { loginWithPasskey } from '$lib/webauthn.client'

	let status: 'idle' | 'working' = 'idle'
	let errorMessage = ''

	async function login() {
		status = 'working'
		errorMessage = ''
		try {
			await loginWithPasskey()
			// Hard-navigate so the fresh session cookie is sent on the top-level request.
			window.location.assign('/admin')
		} catch (caught) {
			errorMessage = caught instanceof Error ? caught.message : 'Login failed'
			status = 'idle'
		}
	}
</script>

<div class="flex min-h-screen flex-col items-center justify-center px-6">
	<div class="w-full max-w-sm text-center">
		<h1 class="mb-8 text-3xl font-extralight">Admin</h1>
		<button
			on:click={login}
			disabled={status === 'working'}
			class="w-full rounded bg-[#333] px-5 py-3 text-white transition-opacity hover:opacity-80 disabled:opacity-50"
		>
			{status === 'working' ? 'Waiting for passkey…' : 'Log in with passkey'}
		</button>
		{#if errorMessage}
			<p class="mt-4 text-sm text-red-700">{errorMessage}</p>
		{/if}
	</div>
</div>
