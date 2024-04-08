<script lang="ts">
	import { events } from '$lib/stores'
</script>

<section id="calendar" class="flex justify-center">
	<div class="mt-6 lg:w-1/2">
		<h1 class="mb-12 text-center text-4xl">Calendar</h1>
		<!-- {#each events as event}
			<div class="mb-5">
				<h2 class="mb-2 text-2xl">{event.title}</h2>
				<p class="mb-2">{event.dates}</p>
				{#if event.link}
					<a href={event.link} target="_blank" class="underline">Information and Tickets</a>
				{/if}
			</div>
		{/each} -->
	</div>
</section>
