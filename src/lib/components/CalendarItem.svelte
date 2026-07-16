<script lang="ts">
	import type { Event } from '$lib/types'
	import { formatDates } from '$lib/helpers'
	import { slide } from 'svelte/transition'
	import EventLink from './EventLink.svelte'

	export let event: Event
	export let separator: string | null = null

	let showMore: boolean = false
</script>

{#if separator}
	<div class="mb-9 flex items-center gap-4">
		<hr class="grow border-[#333] opacity-25" />
		<span class="shrink-0 text-sm italic text-[#333] opacity-40">{separator}</span>
		<hr class="grow border-[#333] opacity-25" />
	</div>
{:else}
	<hr class="mb-9 border-[#333] opacity-25" />
{/if}
<div class="mb-9">
	<p class="italic">{formatDates(event.dates)}</p>
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
	{:else if event.links?.length}
		<div class="my-2 flex flex-wrap gap-x-2 gap-y-1">
			{#each event.links as link}
				<EventLink {link} />
			{/each}
		</div>
	{/if}

	{#if event.program && showMore}
		<div class="mb-5 mt-3" transition:slide>
			<p>{@html event.program.replaceAll('\n', '<br>')}</p>
			{#if event.links?.length}
				<div class="my-2 flex flex-wrap gap-x-2 gap-y-1">
					{#each event.links as link}
						<EventLink {link} />
					{/each}
				</div>
			{/if}
		</div>
	{/if}
</div>
