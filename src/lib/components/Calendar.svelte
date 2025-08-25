<script lang="ts">
	import type { Event } from '$lib/types'
	import { slide } from 'svelte/transition'
	import CalendarItem from './CalendarItem.svelte'

	export let events: Event[]
	export let scrollY: number = 0
	export let innerHeight: number = 0

	const today = new Date(+new Date().setHours(0, 0, 0, 0))

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

	$: if (!fixTitle) {
		titleTop =
			scrollY + innerHeight < section?.offsetTop
				? 0
				: 10 + (20 * (scrollY + innerHeight - section?.offsetTop)) / section?.offsetHeight
	}

	events.forEach((event) => (event.lastDate = new Date(event.lastDate)))
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
	<div class="relative bg-[aliceblue] px-6 py-20 lg:w-1/2 lg:pl-8 lg:pr-12">
		{#if !events.filter((ev) => !ev.lastDate || today <= ev.lastDate).length}
			<p class="text-lg">No upcoming dates.</p>
		{/if}
		<div>
			{#each events.filter((ev) => !ev.lastDate || today <= ev.lastDate).reverse() as event (event)}
				<CalendarItem {event} />
			{/each}
		</div>
		<button on:click={togglePast} class="group mt-6 w-full text-lg lg:w-auto">
			<span class="underline">{showPast ? 'Hide' : 'Show'} past dates</span>
			<span class="-ml-3 opacity-0 transition-all group-hover:-ml-1 group-hover:opacity-100">
				&nbsp;
				<span class="inline-block transition-all duration-300 {showPast ? 'translate-y-[2px] rotate-180' : ''}">
					↓
				</span>
			</span>
		</button>
		{#key showPast}
			<div class="{showPast ? '' : 'hidden'} mt-12" transition:slide>
				{#each events.filter((ev) => ev.lastDate && today > ev.lastDate) as event (event)}
					<CalendarItem {event} />
				{/each}
			</div>
		{/key}
	</div>
</section>
