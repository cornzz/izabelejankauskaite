<script lang="ts">
	import type { Event } from '$lib/types'

	export let event: Event
</script>

<div class="mb-12 last:mb-0">
	<h2 class="mb-1 text-xl transition-all lg:text-2xl">{@html event.title}</h2>
	<p class="text-lg italic">{event.dates}</p>
	{#if event.program}
		<p class="my-2">{@html event.program.replaceAll('\n', '<br>')}</p>
	{/if}
	{#if event.link}
		<a class="group mt-2" href={event.link} target="_blank">
			<span class="underline">Tickets / More</span>
			<span class="-ml-3 opacity-0 transition-all group-hover:-ml-1 group-hover:opacity-100"> &nbsp;→ </span>
		</a>
	{/if}
</div>
