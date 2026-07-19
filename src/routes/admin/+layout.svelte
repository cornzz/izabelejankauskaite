<script lang="ts">
	import { enhance } from '$app/forms'
	import { page } from '$app/stores'
	import type { LayoutData } from './$types'

	export let data: LayoutData

	const tab = (active: boolean) => `text-sm ${active ? 'font-semibold underline' : 'opacity-70 hover:opacity-100'}`
</script>

<svelte:head>
	<title>Izabelė Jankauskaitė - Admin</title>
</svelte:head>

<div class="min-h-screen bg-[aliceblue] text-[#333]">
	{#if data.user}
		<nav class="border-b border-black/10">
			<div class="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
				<div class="flex items-center gap-5">
					<a href="/admin" class={tab($page.url.pathname === '/admin')}>Calendar</a>
					<a href="/admin/bio" class={tab($page.url.pathname === '/admin/bio')}>Biography</a>
				</div>
				<div class="flex items-center gap-4 text-sm">
					<span class="opacity-70">{data.user.name}</span>
					<form method="post" action="/admin?/logout" use:enhance>
						<button type="submit" class="underline">Log out</button>
					</form>
				</div>
			</div>
		</nav>
	{/if}
	<slot />
</div>
