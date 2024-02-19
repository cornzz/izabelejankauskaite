<script lang="ts">
	import { Biography, Calendar, Gallery, Contact, Navigation } from '$lib'

	const links = ['biography', 'calendar', 'gallery', 'contact']

	let navigation: Navigation
</script>

<header
	class="fixed top-0 z-0 h-screen w-screen bg-[url('/images/home-small.webp')] bg-cover
		   bg-[center_69%] px-4 py-2 sm:bg-[size:100%_auto] lg:bg-[url('/images/home.webp')]"
>
	<nav class="ps-2 pt-6 sm:ps-6 sm:pt-10">
		<a
			class="inline-block text-3xl font-extralight text-white [word-spacing:9999px]
				   sm:text-5xl sm:text-inherit sm:[word-spacing:normal]"
			href="/"
		>
			Izabelė Jankauskaitė
		</a>
		<div class="flex w-fit flex-col gap-4 ps-1 pt-36 lowercase sm:pt-10">
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

<Navigation {links} bind:this={navigation} />

<div class="mt-[100vh]"></div>

<Biography />

<Calendar />

<Gallery />

<Contact />
