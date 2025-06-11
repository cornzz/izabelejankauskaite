<script lang="ts">
	import PhotoSwipeDynamicCaption from 'photoswipe-dynamic-caption-plugin'
	import 'photoswipe-dynamic-caption-plugin/photoswipe-dynamic-caption-plugin.css'
	import PhotoSwipeLightbox from 'photoswipe/lightbox'
	import 'photoswipe/style.css'
	import { onMount } from 'svelte'

	const gallery = [
		{
			large: 'photo_1.jpg',
			thumb: 'photo_1.jpg',
			width: 1500,
			height: 1000,
			caption: 'Caption for Image 1',
			css: 'col-span-3 row-span-2 mb-[15%] mx-[10%]'
		},
		{
			large: 'photo_5.webp',
			thumb: 'photo_5.webp',
			width: 2000,
			height: 3000,
			caption: 'Caption for Image 5',
			css: ''
		},
		{
			large: 'photo_7.webp',
			thumb: 'photo_7.webp',
			width: 2000,
			height: 3000,
			caption: 'Caption for Image 7',
			css: 'mt-[75%]'
		},
		{
			large: 'photo_6.webp',
			thumb: 'photo_6.webp',
			width: 2000,
			height: 3000,
			caption: 'Caption for Image 6',
			css: 'mt-[150%] mb-[50%]'
		},
		{
			large: 'photo_3.jpg',
			thumb: 'photo_3.jpg',
			width: 2048,
			height: 1366,
			caption: 'Caption for Image 3',
			css: 'col-span-3 row-span-2 mb-[15%] mx-[10%]'
		},
		{
			large: 'photo_2.jpg',
			thumb: 'photo_2.jpg',
			width: 1500,
			height: 1000,
			caption: 'Caption for Image 2',
			css: 'col-span-1 ml-[50%] mr-[-50%]'
		},
		{
			large: 'photo_4.webp',
			thumb: 'photo_4.webp',
			width: 3000,
			height: 2000,
			caption: 'Caption for Image 4',
			css: 'col-span-1 ml-[50%] mr-[-50%] mb-[75%]'
		}
	]

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

<section id="gallery">
	<!-- py-48 -->
	<h1 class="sticky top-0 -z-10 flex h-screen flex-col justify-center text-center text-4xl sm:text-5xl">Gallery</h1>

	<!-- mt-[35vh] -->
	<div class="mt-[-10vh] bg-[aliceblue] sm:px-32 2xl:px-64">
		<div class="grid grid-cols-3 justify-center gap-2 sm:gap-16">
			{#each gallery as photo}
				<a
					class="relative overflow-hidden {photo.css ?? ''}"
					href="/images/gallery/{photo.large}"
					data-pswp-width={photo.width}
					data-pswp-height={photo.height}
					target="_blank"
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
