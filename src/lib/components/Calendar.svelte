<script lang="ts">
	import { events } from '$lib/stores'

	const yesterday = new Date(+new Date() - 1000 * 60 * 60 * 24)

	let section: HTMLElement
	let scrollY: number = 0
	let innerHeight: number = 0

	$: titleTop =
		scrollY + innerHeight < section?.offsetTop
			? 0
			: 10 + (20 * (scrollY + innerHeight - section?.offsetTop)) / section?.offsetHeight
</script>

<svelte:window bind:scrollY bind:innerHeight />

<section id="calendar" class="flex flex-col pt-12 lg:pt-0 lg:flex-row" bind:this={section}>
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
		>
			Calendar
		</h1>
	</div>
	<div class="relative flex flex-col justify-center bg-[aliceblue] px-6 py-20 lg:w-1/2 lg:pl-8 lg:pr-24">
		{#if !events.filter((ev) => !ev.lastDate || yesterday < ev.lastDate).length}
			<p class="text-lg">No upcoming events.</p>
		{/if}
		{#each events.filter((ev) => !ev.lastDate || yesterday < ev.lastDate) as event}
			<div class="mb-12 last:mb-0">
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
