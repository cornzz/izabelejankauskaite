<script lang="ts">
	import { page } from '$app/stores'
	import { Biography, Calendar, Contact, /*Gallery,*/ Navigation } from '$lib'
	import type { PageData } from './$types'

	export let data: PageData

	const links = ['biography', 'calendar', /*'gallery',*/ 'contact']

	let scrollY: number = 0
	let navigation: Navigation
	let v2: boolean = $page.url.searchParams.has('2')
</script>

<svelte:window bind:scrollY />

<header
	class="fixed top-0 z-0 h-screen w-screen bg-[url('/images/home-new.webp')] bg-cover bg-[33%_0] bg-no-repeat"
	class:v2
	style="transform: translate3d(0, calc(-0.2 * {scrollY}px), 0)"
>
	<nav class="animate-fadein-slow pl-6 pt-8 opacity-0 sm:pl-10 sm:pt-12">
		<a
			class="inline-block border-l-[5px] border-none border-white text-3xl font-extralight
				   text-inherit text-white [word-spacing:9999px] sm:pl-0 sm:text-5xl sm:[word-spacing:normal]
				   low-aspect-ratio:border-solid low-aspect-ratio:pl-5"
			href="/"
		>
			Izabelė Jankauskaitė
		</a>
		<div class="buttons flex w-fit flex-col gap-4 pl-1 pt-10 lowercase text-white low-aspect-ratio:pt-[50vh]">
			{#each links as link}
				<button
					class="text-left transition-all duration-[.25s] ease-in-out hover-d:hover:translate-x-[5px]
						   hover-d:hover:transform hover-d:hover:blur-[2px] hover-d:hover:filter"
					on:click={() => navigation.setActive(link)}
				>
					<a href="#{link}">{link}</a>
				</button>
			{/each}
		</div>
	</nav>
</header>

<Navigation {links} bind:this={navigation} />

<div class="mt-[100vh]"></div>

<Biography />

<Calendar events={data.calendarEvents} />

<!-- <Gallery /> -->

<Contact />

<footer class="flex flex-col items-center justify-center gap-x-2 bg-[aliceblue] py-2 text-sm sm:flex-row">
	<span>© {new Date().getFullYear()} Izabelė Jankauskaitė</span>
	<span class="hidden sm:block">|</span>
	<span><a href="https://corny.me" class="underline" target="_blank">Design</a></span>
</footer>

<style lang="postcss">
	.v2 {
		@apply bg-[url('/images/home-new-2.webp')];

		.buttons {
			@apply low-aspect-ratio:pt-[37vh];
		}
	}
</style>
