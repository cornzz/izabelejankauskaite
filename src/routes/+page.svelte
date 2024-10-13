<script lang="ts">
	import { Biography, Calendar, Contact, Gallery, Navigation } from '$lib'

	const links = ['biography', 'calendar', /*'gallery',*/ 'contact']

	let scrollY: number = 0
	let navigation: Navigation
</script>

<svelte:window bind:scrollY />

<header
	class="fixed top-0 z-0 h-screen w-screen bg-[url('/images/home-new.jpeg')] bg-cover bg-no-repeat bg-[33%_0]"
	style="transform: translate3d(0, calc(-0.2 * {scrollY}px), 0)"
>
	<!-- animate-fadein-slow opacity-0 -->
	<nav class="pr-6 pt-8 text-right sm:pr-12 sm:pt-12">
		<div class="absolute w-full h-full z-[-1] bg-[radial-gradient(circle_at_100%_0,rgba(11,11,11,0.4),transparent_30%)] inset-0"></div>
		<a
			class="inline-block w-full border-r-[5px] border-none border-white text-3xl font-extralight
				   text-inherit text-white [word-spacing:9999px] sm:pr-0 sm:text-5xl sm:[word-spacing:normal]
				   low-aspect-ratio:border-solid low-aspect-ratio:pr-5 low-aspect-ratio:text-white"
			href="/"
		>
			Izabelė Jankauskaitė
		</a>
		<div class="ml-auto flex w-fit flex-col gap-4 pr-1 pt-10 lowercase text-white low-aspect-ratio:pt-[18vh]">
			{#each links as link}
				<button
					class="text-right transition-all duration-[.25s] ease-in-out hover-d:hover:translate-x-[-5px]
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

<Calendar />

<!-- <Gallery /> -->

<Contact />
