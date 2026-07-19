<script lang="ts">
	import { formatDates } from '$lib/helpers'
	import flatpickr from 'flatpickr'
	import 'flatpickr/dist/flatpickr.css'
	import { onDestroy, onMount } from 'svelte'

	// Sorted YYYY-MM-DD list; bound by the parent form.
	export let dates: string[] = []

	let input: HTMLInputElement
	let picker: flatpickr.Instance | undefined

	onMount(() => {
		picker = flatpickr(input, {
			mode: 'multiple',
			dateFormat: 'Y-m-d',
			defaultDate: dates,
			onChange: (selectedDates, _dateString, self) => {
				dates = selectedDates.map((date) => self.formatDate(date, 'Y-m-d')).sort()
			}
		})
	})

	onDestroy(() => picker?.destroy())
</script>

<div>
	<input
		bind:this={input}
		type="text"
		readonly
		placeholder="Click to select one or more dates…"
		class="w-full rounded border border-[#ccc] bg-white px-3 py-2"
	/>
	{#if dates.length}
		<p class="mt-2 text-sm italic opacity-70">{formatDates(dates)}</p>
	{:else}
		<p class="mt-2 text-sm italic opacity-40">No dates selected</p>
	{/if}
</div>
