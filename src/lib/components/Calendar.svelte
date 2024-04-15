<script lang="ts">
	import { events } from '$lib/stores'

	const yesterday = new Date(+new Date() - 1000 * 60 * 60 * 24)
</script>

<section id="calendar" class="flex justify-center">
	<div class="mt-6 lg:w-1/2">
		<h1 class="mb-12 text-center text-4xl">Calendar</h1>
		{#each events.filter(ev => !ev.lastDate || yesterday < ev.lastDate) as event}
			<div class="mb-5">
				<h2 class="mb-2 text-2xl transition-all">{event.title}</h2>
				<p class="mb-2">{event.dates}</p>
				{#if event.link}
					<a href={event.link} target="_blank" class="group underline">
						Tickets / More<span class="-ml-3 opacity-0 transition-all group-hover:ml-0 group-hover:opacity-100">&nbsp;→</span>
					</a>
				{/if}
			</div>
		{/each}
	</div>
</section>
