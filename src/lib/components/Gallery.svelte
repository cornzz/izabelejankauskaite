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
			css: 'col-span-1 sm:translate-x-[15%] w-[calc(100%*1.5)] sm:w-[calc(100%*1.3333)] mb-[25vh]'
		},
		{
			large: 'photo_4.webp',
			thumb: 'photo_4.webp',
			width: 3000,
			height: 2000,
			css: 'col-span-2 sm:translate-x-[-15%] w-[calc((100%-0.5rem)/1.3333)] sm:w-[calc((100%-4rem)/1.5)] ml-auto mb-[25vh]'
		},
		{
			large: 'maxresdefault_zmDwmrGN7jg.webp',
			thumb: 'maxresdefault_zmDwmrGN7jg.webp',
			width: 1280,
			height: 720,
			css: 'col-span-1 sm:translate-x-[15%] w-[calc(100%*1.5)] sm:w-[calc(100%*1.3333)] mb-[10vh]',
			caption: 'Zoltán Kodály: Dances of Galánta',
			video: 'https://www.youtube.com/watch?v=zmDwmrGN7jg'
		},
		{
			large: 'maxresdefault_3MkH_YRdY08.webp',
			thumb: 'maxresdefault_3MkH_YRdY08.webp',
			width: 1280,
			height: 720,
			css: 'col-span-2 sm:translate-x-[-15%] w-[calc((100%-0.5rem)/1.3333)] sm:w-[calc((100%-4rem)/1.5)] ml-auto mb-[10vh]',
			caption: 'Béla Bartók: Romanian Folk Dances, Sz. 56 BB 68',
			video: 'https://www.youtube.com/watch?v=3MkH_YRdY08'
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
			children: 'a[data-pswp-width]',
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

	<div class="bg-slate-300 lg:px-20 xl:px-36 2xl:px-64 3xl:px-96">
		<div class="grid grid-cols-3 justify-center gap-2 sm:gap-16">
			{#each gallery as photo, index}
				<a
					class="group relative block overflow-hidden {photo.css ?? ''}"
					style={photo.style ? photo.style(getTranslate(index, scrollY)) : ''}
					href={photo.video ?? `/images/gallery/${photo.large}`}
					data-pswp-width={photo.video ? undefined : photo.width}
					data-pswp-height={photo.video ? undefined : photo.height}
					target="_blank"
					rel={photo.video ? 'noopener noreferrer' : undefined}
					title={photo.video ? `Watch: ${photo.caption}` : photo.caption}
					bind:this={photos[index]}
				>
					<img
						class="w-full"
						src="/images/gallery/{photo.thumb}"
						width={photo.width}
						height={photo.height}
						alt={photo.video ? 'Video thumbnail' : 'Gallery Item'}
					/>
					{#if photo.video}
						<span class="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
							<svg
								class="w-[18%] max-w-[68px] opacity-80 drop-shadow-lg transition duration-200 group-hover:scale-110 group-hover:opacity-100"
								viewBox="0 0 68 48"
							>
								<path
									fill-rule="evenodd"
									clip-rule="evenodd"
									d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26zM45 24 27 14v20z"
									fill="#fff"
								/>
							</svg>
						</span>
					{/if}
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
