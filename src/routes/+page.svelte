<script lang="ts">
	import { Biography, Calendar, Gallery, Contact, Navigation } from '$lib'

	const links = ['biography', 'calendar', 'gallery', 'contact']

	let scrollY: number = 0
	let navigation: Navigation
</script>

<header
	class="fixed top-0 z-0 h-screen w-screen bg-[url('/images/home-small.webp')] bg-cover
		   bg-[center_69%] px-4 py-2 md:bg-[size:100%_auto] lg:bg-[url('/images/home.webp')]"
	style="transform: translate3d(0, calc(-0.2 * {scrollY}px), 0)"
>
	<nav class="animate-fadein-slow ps-2 pt-6 opacity-0 sm:ps-6 sm:pt-10">
		<a
			class="low-aspect-ratio:text-white low-aspect-ratio:border-solid low-aspect-ratio:pl-5 inline-block
					border-l-[5px] border-none border-white text-3xl font-extralight text-inherit [word-spacing:9999px]
					sm:pl-0 sm:text-5xl sm:[word-spacing:normal]"
			href="/"
		>
			Izabelė Jankauskaitė
		</a>
		<div class="flex w-fit flex-col gap-4 ps-1 low-aspect-ratio:pt-[18vh] lowercase pt-10">
			{#each links as link}
				<button
					class="text-left transition-all duration-[.25s] ease-in-out
						   hover:translate-x-[5px] hover:transform hover:blur-[2px] hover:filter"
					on:click={() => navigation.setActive(link)}
				>
					<a href="#{link}">{link}</a>
				</button>
			{/each}
		</div>
	</nav>
</header>

<svelte:window bind:scrollY />

<Navigation {links} bind:this={navigation} />

<div class="mt-[100vh]"></div>

<Biography />

<Calendar />

<Gallery />

<Contact />
