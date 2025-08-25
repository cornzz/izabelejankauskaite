<script lang="ts">
	import type { Photo } from '$lib'
	import PhotoSwipeDynamicCaption from 'photoswipe-dynamic-caption-plugin'
	import 'photoswipe-dynamic-caption-plugin/photoswipe-dynamic-caption-plugin.css'
	import PhotoSwipeLightbox from 'photoswipe/lightbox'
	import 'photoswipe/style.css'
	import { onMount } from 'svelte'

	export let scrollY: number
	export let innerHeight: number

	const gallery: Photo[] = [
		{
			large: 'photo_1.jpg',
			thumb: 'photo_1.jpg',
			width: 1500,
			height: 1000,
			css: 'col-span-3 row-span-2 mb-[30vh] sm:mx-[10%]'
		},
		{
			large: 'photo_5.webp',
			thumb: 'photo_5.webp',
			width: 2000,
			height: 3000,
			css: '',
			style: (translate: number) => `transform: translate3d(0, ${translate * 0.1}px, 0)`
		},
		{
			large: 'photo_7.webp',
			thumb: 'photo_7.webp',
			width: 2000,
			height: 3000,
			css: '',
			style: (translate: number) => `transform: translate3d(0, ${translate * 0.25}px, 0)`
		},
		{
			large: 'photo_6.webp',
			thumb: 'photo_6.webp',
			width: 2000,
			height: 3000,
			css: 'mb-[30vh]',
			style: (translate: number) => `transform: translate3d(0, ${translate * 0.4}px, 0)`
		},
		// TODO: carousel
		{
			large: 'photo_3.jpg',
			thumb: 'photo_3.jpg',
			width: 2048,
			height: 1366,
			css: 'col-span-3 row-span-2 mb-[30vh] sm:mx-[10%]'
		},
		{
			large: 'photo_2.jpg',
			thumb: 'photo_2.jpg',
			width: 1500,
			height: 1000,
			css: 'col-span-1 translate-x-[15%] w-[calc(100%*1.33)]'
		},
		{
			large: 'photo_4.webp',
			thumb: 'photo_4.webp',
			width: 3000,
			height: 2000,
			css: 'col-span-2 w-[calc((100%-4rem)/1.5)] ml-auto mb-[10vh] translate-x-[-15%]'
		}
	]

	let section: HTMLElement
	let photos: HTMLAnchorElement[] = []

	function smooth(scrollY: number, a: number, b: number): number {
		let t = (scrollY - a) / (b - a)
		t = Math.min(Math.max(t, 0), 1)

		return t * t * (3 - 2 * t)
	}

	function getTranslate(index: number, scrollY: number): number {
		if (!photos[index] || !section) return 0

		const photoTop = photos[index].offsetTop
		const photoHeight = photos[index].firstElementChild?.clientHeight ?? 0
		const sectionTop = section.offsetTop
		const photoMiddle = sectionTop + photoTop + photoHeight / 2

		return photoMiddle - innerHeight / 2 - scrollY
	}

	onMount(() => {
		const lightbox = new PhotoSwipeLightbox({
			gallery: '#gallery',
			children: 'a',
			imageClickAction: 'close',
			tapAction: 'close',
			pswpModule: () => import('photoswipe')
		})

		new PhotoSwipeDynamicCaption(lightbox)

		lightbox.init()
	})
</script>

<section
	id="gallery"
	class="before:sticky before:top-12 before:z-10 before:block before:h-[10vh] before:w-full before:bg-slate-300 before:opacity-[var(--opacity)]
		   after:sticky after:bottom-[-20vh] after:z-10 after:block after:h-[30vh] after:w-full after:bg-slate-300 after:opacity-[var(--opacity)]"
	style="--opacity: {smooth(scrollY, section?.offsetTop, section?.offsetTop)}"
	bind:this={section}
>
	<h1
		class="sticky top-0 -z-10 mt-[-10vh] flex h-screen flex-col justify-center bg-slate-300 text-center text-4xl sm:text-5xl"
		style="opacity: {smooth(scrollY, section?.offsetTop - innerHeight / 4, section?.offsetTop)}"
	>
		Gallery
	</h1>

	<div class="3xl:px-96 bg-slate-300 sm:px-36 2xl:px-64">
		<div class="grid grid-cols-3 justify-center gap-2 sm:gap-16">
			{#each gallery as photo, index}
				<a
					class="relative overflow-hidden {photo.css ?? ''}"
					style={photo.style ? photo.style(getTranslate(index, scrollY)) : ''}
					href="/images/gallery/{photo.large}"
					data-pswp-width={photo.width}
					data-pswp-height={photo.height}
					target="_blank"
					bind:this={photos[index]}
				>
					<img
						class="w-full"
						src="/images/gallery/{photo.thumb}"
						width={photo.width}
						height={photo.height}
						alt="Gallery Item"
					/>
					<span class="pswp-caption-content hidden">{photo.caption ?? ''}</span>
				</a>
			{/each}
		</div>
	</div>
</section>

<style lang="postcss">
	:global(.pswp__dynamic-caption--on-hor-edge) {
		@apply !top-auto bottom-4;
	}
</style>
