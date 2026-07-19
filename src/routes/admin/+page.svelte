<script lang="ts">
	import { enhance } from '$app/forms'
	import { onDestroy } from 'svelte'
	import DatePicker from '$lib/components/admin/DatePicker.svelte'
	import Spinner from '$lib/components/admin/Spinner.svelte'
	import type { ProgramRow } from '$lib/helpers'
	import { formatDates } from '$lib/helpers'
	import type { SubmitFunction } from '@sveltejs/kit'
	import type { ActionData, PageData } from './$types'

	export let data: PageData
	export let form: ActionData

	type LinkRow = { href: string; info?: string }

	const today = new Date(+new Date().setHours(0, 0, 0, 0))
	const toDate = (iso: string) => new Date(+iso.slice(0, 4), +iso.slice(5, 7) - 1, +iso.slice(8, 10))
	const lastDate = (dates: string[]) => toDate(dates[dates.length - 1])

	const inputClass = 'w-full rounded border border-[#ccc] bg-white px-3 py-2'
	const primaryButton = 'rounded bg-[#333] px-4 py-2 text-white transition-opacity hover:opacity-80 disabled:opacity-50'
	const ghostButton = 'rounded border border-[#333] px-4 py-2 transition-colors hover:bg-black/5'

	const addProgramRow = () => (program = [...program, { composer: '', title: '' }])
	const removeProgramRow = (index: number) => (program = program.filter((_, position) => position !== index))
	const addLinkRow = () => (links = [...links, { href: '', info: '' }])
	const removeLinkRow = (index: number) => (links = links.filter((_, position) => position !== index))

	let editingId: string | null = null
	let title = ''
	let dates: string[] = []
	let program: ProgramRow[] = [{ composer: '', title: '' }]
	let links: LinkRow[] = [{ href: '', info: '' }]
	let formKey = 0
	let showPast = false
	let savingEvent = false
	let eventSaved = false
	let eventSavedTimeout: ReturnType<typeof setTimeout>
	let busy: string | null = null
	let copied = false
	let copiedTimeout: ReturnType<typeof setTimeout>

	// Shared submit tracker for the secondary forms: spin the clicked button until done.
	const track =
		(id: string): SubmitFunction =>
		() => {
			busy = id
			return async ({ update }) => {
				await update()
				busy = null
			}
		}

	function resetForm() {
		editingId = null
		title = ''
		dates = []
		program = [{ composer: '', title: '' }]
		links = [{ href: '', info: '' }]
		formKey++
	}

	function startEdit(row: PageData['events'][number]) {
		editingId = row.id
		title = row.title
		dates = [...row.dates]
		program = row.program.length ? row.program.map((entry) => ({ ...entry })) : [{ composer: '', title: '' }]
		links = row.links.length ? row.links.map((entry) => ({ ...entry })) : [{ href: '', info: '' }]
		formKey++
		if (typeof document !== 'undefined') document.getElementById('event-form')?.scrollIntoView({ behavior: 'smooth' })
	}

	// Reset back to create-mode after a successful create/update, then flash "Saved".
	const submitEventForm: SubmitFunction = () => {
		savingEvent = true
		eventSaved = false
		return async ({ result, update }) => {
			await update()
			savingEvent = false
			if (result.type === 'success') {
				resetForm()
				eventSaved = true
				clearTimeout(eventSavedTimeout)
				eventSavedTimeout = setTimeout(() => (eventSaved = false), 2500)
			}
		}
	}

	function copy(text: string) {
		navigator.clipboard?.writeText(text)
		copied = true
		clearTimeout(copiedTimeout)
		copiedTimeout = setTimeout(() => (copied = false), 2000)
	}

	$: upcoming = data.events.filter((row) => today <= lastDate(row.dates)).reverse()
	$: past = data.events.filter((row) => today > lastDate(row.dates))
	$: shownConcerts = showPast ? past : upcoming

	onDestroy(() => {
		clearTimeout(eventSavedTimeout)
		clearTimeout(copiedTimeout)
	})
</script>

<div class="mx-auto max-w-3xl px-6 py-10">
	<h1 class="mb-10 text-3xl font-extralight">Calendar</h1>

	<!-- Create / edit form -->
	<div id="event-form" class="mb-14 rounded-lg bg-white/60 p-6 shadow-sm">
		<h2 class="mb-4 text-xl">{editingId ? 'Edit concert' : 'Add concert'}</h2>
		<form
			method="post"
			action={editingId ? '?/update' : '?/create'}
			use:enhance={submitEventForm}
			class="flex flex-col gap-5"
		>
			{#if editingId}
				<input type="hidden" name="id" value={editingId} />
			{/if}
			<input type="hidden" name="dates" value={JSON.stringify(dates)} />
			<input type="hidden" name="program" value={JSON.stringify(program)} />
			<input type="hidden" name="links" value={JSON.stringify(links)} />

			<label class="flex flex-col gap-1">
				<span class="text-sm opacity-70">Title <span class="opacity-50">(may contain &lt;b&gt;/&lt;i&gt;)</span></span>
				<input name="title" bind:value={title} class={inputClass} placeholder="Orchestra / concert title" />
			</label>

			<div class="flex flex-col gap-1">
				<span class="text-sm opacity-70">Dates</span>
				{#key formKey}
					<DatePicker bind:dates />
				{/key}
			</div>

			<div class="flex flex-col gap-2">
				<span class="text-sm opacity-70">Program</span>
				{#each program as row, index (index)}
					<div class="flex gap-2">
						<input bind:value={row.composer} placeholder="Composer" class="{inputClass} w-1/3" />
						<input bind:value={row.title} placeholder="Title" class={inputClass} />
						<button
							type="button"
							on:click={() => removeProgramRow(index)}
							class="shrink-0 px-2 text-xl leading-none opacity-50 hover:opacity-100"
							aria-label="Remove program row">×</button
						>
					</div>
				{/each}
				<button type="button" on:click={addProgramRow} class="self-start text-sm underline">+ Add more</button>
			</div>

			<div class="flex flex-col gap-2">
				<span class="text-sm opacity-70">Links</span>
				{#each links as row, index (index)}
					<div class="flex gap-2">
						<input bind:value={row.href} placeholder="https://…" class={inputClass} />
						<input bind:value={row.info} placeholder="Date (optional, e.g. 12.03.)" class="{inputClass} w-1/3" />
						<button
							type="button"
							on:click={() => removeLinkRow(index)}
							class="shrink-0 px-2 text-xl leading-none opacity-50 hover:opacity-100"
							aria-label="Remove link row">×</button
						>
					</div>
				{/each}
				<button type="button" on:click={addLinkRow} class="self-start text-sm underline">+ Add more</button>
			</div>

			{#if form?.formError}<p class="text-sm text-red-700">{form.formError}</p>{/if}

			<div class="flex items-center gap-3">
				<button type="submit" disabled={savingEvent} class="{primaryButton} inline-flex items-center gap-2">
					{#if savingEvent}<Spinner />{/if}
					{savingEvent ? 'Saving…' : editingId ? 'Save changes' : 'Add concert'}
				</button>
				{#if editingId}
					<button type="button" on:click={resetForm} class={ghostButton}>Cancel</button>
				{/if}
				{#if eventSaved}<span class="text-sm text-green-700">Saved</span>{/if}
			</div>
		</form>
	</div>

	<!-- Event list -->
	<div class="mb-14">
		<div class="mb-4 flex items-center justify-between gap-4">
			<h2 class="text-xl">
				{showPast ? 'Past' : 'Upcoming'} concerts
				<span class="text-sm opacity-50">({shownConcerts.length})</span>
			</h2>
			<button on:click={() => (showPast = !showPast)} class="text-sm underline">
				{showPast ? 'Show upcoming' : 'Show past dates'}
			</button>
		</div>
		<div class="flex flex-col divide-y divide-black/10">
			{#each shownConcerts as row (row.id)}
				<div class="flex items-start justify-between gap-4 py-3">
					<div class="min-w-0">
						<p class="text-sm italic opacity-70">{formatDates(row.dates)}</p>
						<p class="truncate">{@html row.title}</p>
						<p class="text-xs opacity-50">
							{#if row.program.length}
								{row.program.length} program line{row.program.length > 1 ? 's' : ''}
							{:else}
								no program
							{/if}
							· {row.links.length} link{row.links.length === 1 ? '' : 's'}
						</p>
					</div>
					<div class="flex shrink-0 items-center gap-3 text-sm">
						<button on:click={() => startEdit(row)} class="underline">Edit</button>
						<form method="post" action="?/delete" use:enhance={track(`delete:${row.id}`)}>
							<input type="hidden" name="id" value={row.id} />
							<button
								type="submit"
								disabled={busy === `delete:${row.id}`}
								class="inline-flex items-center gap-1 text-red-700 underline disabled:opacity-60"
								on:click={(event) => {
									if (!confirm('Delete this concert?')) event.preventDefault()
								}}
							>
								{#if busy === `delete:${row.id}`}<Spinner size="h-3.5 w-3.5" />{/if}
								Delete
							</button>
						</form>
					</div>
				</div>
			{:else}
				<p class="py-3 opacity-60">No {showPast ? 'past' : 'upcoming'} concerts.</p>
			{/each}
		</div>
	</div>

	<!-- People & invites -->
	<div>
		<h2 class="mb-4 text-xl">People</h2>

		{#if form?.inviteUrl}
			<div class="mb-4 rounded border border-[#333]/30 bg-white p-4 text-sm">
				<p class="mb-2">Invite link for <strong>{form.invitedName}</strong> (valid 7 days, single use):</p>
				<div class="flex items-center gap-2">
					<code class="min-w-0 flex-1 truncate rounded bg-black/5 px-2 py-1">{form.inviteUrl}</code>
					<button
						type="button"
						on:click={() => copy(form?.inviteUrl ?? '')}
						class="{ghostButton} inline-flex items-center gap-1"
					>
						{copied ? 'Copied ✓' : 'Copy'}
					</button>
				</div>
			</div>
		{/if}

		<div class="mb-4 flex flex-col divide-y divide-black/10">
			{#each data.people as person (person.id)}
				<div class="flex items-center justify-between py-2">
					<span
						>{person.name}
						<span class="text-xs opacity-50">· {person.passkeys} passkey{person.passkeys === 1 ? '' : 's'}</span></span
					>
					{#if person.id !== data.user?.id}
						<form method="post" action="?/removeUser" use:enhance={track(`removeUser:${person.id}`)}>
							<input type="hidden" name="id" value={person.id} />
							<button
								type="submit"
								disabled={busy === `removeUser:${person.id}`}
								class="inline-flex items-center gap-1 text-sm text-red-700 underline disabled:opacity-60"
								on:click={(event) => {
									if (!confirm(`Remove ${person.name} and all their passkeys?`)) event.preventDefault()
								}}
							>
								{#if busy === `removeUser:${person.id}`}<Spinner size="h-3.5 w-3.5" />{/if}
								Remove
							</button>
						</form>
					{:else}
						<span class="text-xs opacity-40">you</span>
					{/if}
				</div>
			{/each}
		</div>

		{#if form?.peopleError}<p class="mb-3 text-sm text-red-700">{form.peopleError}</p>{/if}

		<div class="flex flex-wrap items-end gap-3">
			<form method="post" action="?/invite" use:enhance={track('invite')} class="flex items-end gap-2">
				<label class="flex flex-col gap-1">
					<span class="text-sm opacity-70">Invite a person</span>
					<input name="name" placeholder="Name" class={inputClass} />
				</label>
				<button type="submit" disabled={busy === 'invite'} class="{primaryButton} inline-flex items-center gap-2">
					{#if busy === 'invite'}<Spinner />{/if}
					Invite
				</button>
			</form>
			<form method="post" action="?/addDevice" use:enhance={track('addDevice')}>
				<button
					type="submit"
					disabled={busy === 'addDevice'}
					class="{ghostButton} inline-flex items-center gap-2 disabled:opacity-60"
				>
					{#if busy === 'addDevice'}<Spinner />{/if}
					Add a device for me
				</button>
			</form>
		</div>
	</div>
</div>
