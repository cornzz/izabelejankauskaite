<script lang="ts">
	import { registerPasskey } from '$lib/webauthn.client'
	import type { PageData } from './$types'

	export let data: PageData

	let status: 'idle' | 'working' = 'idle'
	let errorMessage = ''

	async function register() {
		status = 'working'
		errorMessage = ''
		try {
			await registerPasskey(data.token)
			// Registration signs the user in; hard-navigate so the fresh session cookie
			// is sent on the top-level request and the /admin guard sees it.
			window.location.assign('/admin')
		} catch (caught) {
			errorMessage = caught instanceof Error ? caught.message : 'Registration failed'
			status = 'idle'
		}
	}
</script>

<div class="flex min-h-screen flex-col items-center justify-center px-6">
	<div class="w-full max-w-sm text-center">
		{#if data.valid}
			<h1 class="mb-2 text-3xl font-extralight">Welcome{data.name ? `, ${data.name}` : ''}</h1>
			<p class="mb-8 text-sm opacity-70">Create a passkey on this device to manage the calendar.</p>
			<button
				on:click={register}
				disabled={status === 'working'}
				class="w-full rounded bg-[#333] px-5 py-3 text-white transition-opacity hover:opacity-80 disabled:opacity-50"
			>
				{status === 'working' ? 'Waiting for passkey…' : 'Create your passkey'}
			</button>
			{#if errorMessage}
				<p class="mt-4 text-sm text-red-700">{errorMessage}</p>
			{/if}
		{:else}
			<h1 class="mb-2 text-3xl font-extralight">Invite unavailable</h1>
			<p class="text-sm opacity-70">This invite link is invalid, already used, or expired.</p>
		{/if}
	</div>
</div>
