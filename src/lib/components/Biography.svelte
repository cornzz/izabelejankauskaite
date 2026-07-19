<script lang="ts">
	import { DEFAULT_BIOGRAPHY } from '$lib/defaultContent'

	export let biography: string = DEFAULT_BIOGRAPHY

	$: paragraphs = biography
		.split('\n')
		.map((paragraph) => paragraph.trim())
		.filter(Boolean)
</script>

<section id="biography" class="flex flex-col px-6 pb-32 pt-20 md:block lg:pt-32 xl:flex xl:flex-row-reverse xl:px-0">
	<div class="mx-auto px-6 py-[3.75rem] md:float-right md:w-1/2 md:pl-[4.5rem] md:pr-0 xl:float-none xl:px-32">
		<img
			class="ml-auto max-h-[75vh] max-w-full xl:sticky xl:top-[100px] 2xl:static"
			src="/images/biography.webp"
			alt="Portrait - Izabelė Jankauskaitė"
		/>
	</div>
	<div class="inline leading-loose xl:w-1/2 xl:px-12">
		<h1 class="mb-5 text-2xl sm:text-3xl">Biography</h1>
		{#each paragraphs as paragraph}
			<p>{paragraph}</p>
		{/each}
	</div>
</section>

<style lang="postcss">
	p:not(:last-child) {
		@apply mb-4;
	}
</style>
