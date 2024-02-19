<script lang="ts">
	import { Biography } from '$lib'
</script>

<header
	class="fixed top-0 z-0 h-screen w-screen bg-[url('/images/home.jpg')]
		   bg-[size:100%_auto] bg-[center_68%] px-4 py-2"
>
	<nav>
		<a class="inline-block ps-6 pt-10 text-5xl font-extralight" href="/">Izabelė Jankauskaitė</a>
		<ul class="flex w-fit flex-col gap-4 ps-7 pt-10">
			<li><a href="/">Home</a></li>
			<li><a href="#biography">Biography</a></li>
			<li><a href="#calendar">Calendar</a></li>
			<li><a href="#gallery">Gallery</a></li>
			<li><a href="#contact">Contact</a></li>
		</ul>
	</nav>
</header>

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
