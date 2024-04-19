<script lang="ts">
	import { events } from '$lib/stores'

	const yesterday = new Date(+new Date() - 1000 * 60 * 60 * 24)

	let section: HTMLElement
	let scrollY: number = 0
	let innerHeight: number = 0

	$: titleTop =
		scrollY + innerHeight < section?.offsetTop
			? 0
			: (20 * (scrollY + innerHeight - section?.offsetTop)) / section?.offsetHeight
</script>

<svelte:window bind:scrollY bind:innerHeight />

<section id="calendar" bind:this={section}>
	<div class="relative w-full bg-[aliceblue] lg:sticky lg:top-12">
		<img src="/images/calendar.webp" class="min-w-[135%] lg:absolute" alt="Calendar" loading="lazy" />
		<h1
			class="absolute top-12 mb-12 w-full px-12 text-4xl text-white lg:top-0 lg:text-right"
			style="margin-top: {titleTop}%"
		>
			Calendar
		</h1>
	</div>
	<div class="relative flex flex-col justify-center bg-[aliceblue] px-6 py-20 lg:w-1/2 lg:px-8">
		{#each events.filter((ev) => !ev.lastDate || yesterday < ev.lastDate) as event}
			<div class="mb-8 last:mb-0 lg:mb-12">
				<h2 class="mb-1 text-2xl transition-all">{@html event.title}</h2>
				<p class="italic">{event.dates}</p>
				{#if event.link}
					<a class="group mt-2 underline" href={event.link} target="_blank">
						Tickets / More
						<span class="-ml-3 opacity-0 transition-all group-hover:ml-0 group-hover:opacity-100"> &nbsp;→ </span>
					</a>
				{/if}
			</div>
		{/each}
	</div>
</section>
