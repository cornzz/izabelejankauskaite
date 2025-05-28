<script lang="ts">
	import type { Event } from '$lib/types'
	import { slide } from 'svelte/transition'
	import EventLink from './EventLink.svelte'

	export let event: Event

	let showMore: boolean = false
</script>

<div class="mb-9">
	<p class="italic">{event.dates}</p>
	<h2 class="mb-1 text-xl transition-all lg:text-2xl">{@html event.title}</h2>

	{#if event.program}
		<button on:click={() => (showMore = !showMore)} class="group block w-full text-left lg:w-auto">
			<span class="underline">{showMore ? 'Less' : 'More'} information</span>
			<span class="-ml-3 opacity-0 transition-all group-hover:-ml-1 group-hover:opacity-100">
				&nbsp;
				<span class="inline-block transition-all duration-300 {showMore ? 'translate-y-[2px] rotate-180' : ''}">
					↓
				</span>
			</span>
		</button>
	{:else if event.link}
		<EventLink {event} />
	{/if}

	{#if event.program && showMore}
		<div class="mb-4 mt-2" transition:slide>
			<p>{@html event.program.replaceAll('\n', '<br>')}</p>
			{#if event.link}
				<EventLink {event} />
			{/if}
		</div>
	{/if}
</div>
<hr class="mb-9 border-[#333] opacity-25 last:hidden" />
