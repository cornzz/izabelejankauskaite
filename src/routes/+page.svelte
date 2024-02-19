<script lang="ts">
	import { Biography } from '$lib'

</script>

<header
	class="fixed top-0 z-0 h-screen w-screen bg-[url('/images/home.jpg')]
		   bg-cover bg-[center_68%] px-4 py-2 sm:bg-[size:100%_auto]"
>
	<nav class="ps-2 sm:ps-6 pt-6 sm:pt-10">
		<a
			class="inline-block text-3xl font-extralight text-white [word-spacing:9999px] sm:text-5xl sm:text-inherit sm:[word-spacing:normal]"
			href="/"
		>
			Izabelė Jankauskaitė
		</a>
		<ul class="flex w-fit flex-col gap-4 ps-1 pt-36 sm:pt-10">
			<li><a href="#biography">Biography</a></li>
			<li><a href="#calendar">Calendar</a></li>
			<li><a href="#gallery">Gallery</a></li>
			<li><a href="#contact">Contact</a></li>
		</ul>
	</nav>
</header>

<!-- TODO: sticky header after scroll? -->

<div class="mt-[100vh]"></div>

<Biography />

<style lang="postcss">
	nav ul li {
		@apply lowercase transition-all duration-[.25s] ease-in-out;

		&:hover {
			@apply translate-x-[5px] transform blur-[2px] filter;
		}
	}
</style>
