<script lang="ts">
	import type { Event } from '$lib/types'
	import { MONTH_NAMES } from '$lib/helpers'
	import { slide } from 'svelte/transition'
	import CalendarItem from './CalendarItem.svelte'

	export let events: Event[]
	export let scrollY: number = 0
	export let innerHeight: number = 0

	const today = new Date(+new Date().setHours(0, 0, 0, 0))
	// Parse a YYYY-MM-DD string as a local date (midnight), matching `today`.
	const toDate = (iso: string) => new Date(+iso.slice(0, 4), +iso.slice(5, 7) - 1, +iso.slice(8, 10))
	const lastDate = (event: Event) => toDate(event.dates.at(-1)!)

	let section: HTMLElement
	let title: HTMLHeadingElement
	let titleTop: number = 0
	let showPast: boolean = false
	let fixTitle: boolean = false

	function togglePast() {
		fixTitle = true
		title.classList.add('transition-all')
		showPast = !showPast
		setTimeout(() => (fixTitle = false), 400)
		setTimeout(() => title.classList.remove('transition-all'), 550)
	}

	// Anchor each entry to the month of its FIRST date, so a month-spanning entry groups with
	// its start month and the next month's header lands after it, not before it.
	function monthInfo(event: Event): { key: string; label: string } {
		const [year, month] = event.dates[0].split('-')
		return { key: `${year}-${month}`, label: `${MONTH_NAMES[+month - 1]} ${year}` }
	}

	// Label the divider above an entry with its own month, but only when the month changes from
	// the previous entry (or it's the first entry) — so each month gets a single muted header
	// above the entries it introduces.
	function withSeparators(list: Event[]): { event: Event; separator: string | null }[] {
		return list.map((event, i) => {
			const prev = list[i - 1]
			const separator = !prev || monthInfo(event).key !== monthInfo(prev).key ? monthInfo(event).label : null
			return { event, separator }
		})
	}

	$: if (!fixTitle) {
		titleTop =
			scrollY + innerHeight < section?.offsetTop
				? 0
				: 10 + (20 * (scrollY + innerHeight - section?.offsetTop)) / section?.offsetHeight
	}
	$: upcoming = events.filter((event) => today <= lastDate(event)).reverse()
	$: past = events.filter((event) => today > lastDate(event))
</script>

<section id="calendar" class="flex flex-col pt-12 lg:flex-row" bind:this={section}>
	<div class="relative w-full bg-[aliceblue] lg:sticky lg:top-12 lg:h-0">
		<img
			src="/images/calendar.webp"
			class="h-[45vh] w-full object-cover object-[0_0] lg:absolute lg:h-screen lg:object-center"
			alt="Calendar"
			loading="lazy"
		/>
		<h1
			class="absolute top-12 mb-12 w-full px-12 text-4xl text-white lg:top-0 lg:text-right xl:w-screen xl:text-center"
			style="margin-top: {titleTop}%"
			bind:this={title}
		>
			Calendar
		</h1>
	</div>
	<div class="relative bg-[aliceblue] px-6 pb-10 pt-20 lg:w-1/2 lg:pl-8 lg:pr-12">
		{#if !upcoming.length}
			<p class="text-lg">No upcoming dates.</p>
		{/if}
		<div>
			{#each withSeparators(upcoming) as { event, separator } (event)}
				<CalendarItem {event} {separator} />
			{/each}
		</div>
		<button on:click={togglePast} class="group mx-auto mt-6 w-full text-lg">
			<span class="underline">{showPast ? 'Hide' : 'Show'} past dates</span>
			<span class="-ml-3 opacity-0 transition-all group-hover:-ml-1 group-hover:opacity-100">
				&nbsp;
				<span class="inline-block transition-all duration-300 {showPast ? 'translate-y-[2px] rotate-180' : ''}">
					↓
				</span>
			</span>
		</button>
		{#key showPast}
			<div class="mt-16 {showPast ? '' : 'hidden'}" transition:slide>
				{#each withSeparators(past) as { event, separator } (event)}
					<CalendarItem {event} {separator} />
				{/each}
			</div>
		{/key}
	</div>
</section>
