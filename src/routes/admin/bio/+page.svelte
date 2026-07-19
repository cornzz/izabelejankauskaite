<script lang="ts">
	import { enhance } from '$app/forms'
	import Spinner from '$lib/components/admin/Spinner.svelte'
	import type { SubmitFunction } from '@sveltejs/kit'
	import { onDestroy } from 'svelte'
	import type { PageData } from './$types'

	export let data: PageData

	let biography = data.biography
	let saving = false
	let saved = false
	let savedTimeout: ReturnType<typeof setTimeout>

	const save: SubmitFunction = () => {
		saving = true
		saved = false
		return async ({ update }) => {
			// reset: false keeps the textarea content (a native reset would blank it).
			await update({ reset: false })
			saving = false
			saved = true
			clearTimeout(savedTimeout)
			savedTimeout = setTimeout(() => (saved = false), 2500)
		}
	}

	$: paragraphs = biography
		.split('\n')
		.map((paragraph) => paragraph.trim())
		.filter(Boolean)

	onDestroy(() => clearTimeout(savedTimeout))
</script>

<svelte:head><title>Admin — Biography</title></svelte:head>

<div class="mx-auto max-w-3xl px-6 py-10">
	<h1 class="mb-2 text-3xl font-extralight">Biography</h1>
	<p class="mb-6 text-sm opacity-70">One paragraph per line. Blank lines are ignored.</p>

	<form method="post" action="?/save" use:enhance={save}>
		<textarea
			name="biography"
			bind:value={biography}
			rows="18"
			class="w-full rounded border border-[#ccc] bg-white px-3 py-2 leading-relaxed"
			placeholder="Write the biography…"
		></textarea>
		<div class="mt-3 flex items-center gap-3">
			<button
				type="submit"
				disabled={saving}
				class="inline-flex items-center gap-2 rounded bg-[#333] px-4 py-2 text-white transition-opacity hover:opacity-80 disabled:opacity-60"
			>
				{#if saving}<Spinner />{/if}
				{saving ? 'Saving…' : 'Save'}
			</button>
			{#if saved}<span class="text-sm text-green-700">Saved</span>{/if}
		</div>
	</form>

	<h2 class="mb-3 mt-10 text-xl">Preview</h2>
	<div class="leading-loose">
		{#each paragraphs as paragraph}
			<p class="mb-4">{paragraph}</p>
		{:else}
			<p class="opacity-60">Nothing to preview.</p>
		{/each}
	</div>
</div>
