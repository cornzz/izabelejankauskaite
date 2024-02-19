<script lang="ts">
	import { onMount } from 'svelte'

	export let links: string[]

	let open: boolean = false
	let innerHeight: number = 0
	let scrollY: number = -11
	let menu: HTMLElement
	let menuItems: HTMLElement
	let menuItemsOffset: number = 0
	let ready: boolean = false

	function toggleMenu(event: MouseEvent) {
		if (!open && event.target instanceof HTMLAnchorElement) {
			event.preventDefault()
		}
		open = !open
		menu.style.minHeight = open ? `${menuItems.scrollHeight}px` : '0'
	}

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					const top = entry.boundingClientRect.top
					const bottom = entry.boundingClientRect.bottom
					if (top < innerHeight / 2 && bottom > innerHeight / 2) {
						menuItemsOffset = links.indexOf(entry.target.id) + 1
					}
				})
			},
			{
				threshold: Array(10)
					.fill(1)
					.map((_, i) => (i + 1) / 10)
			}
		)

		document.querySelectorAll('section').forEach((section) => observer.observe(section))
		setTimeout(() => (ready = true), 100)

		return () => observer.disconnect()
	})
</script>

<svelte:window bind:innerHeight bind:scrollY />

<button
	class="fixed top-0 z-50 flex h-12 min-h-0 w-full transform justify-between overflow-hidden bg-[aliceblue]
           px-8 shadow-lg transition-all duration-300
		   {scrollY >= innerHeight - 10 ? 'translate-y-0' : '-translate-y-16'}"
	class:!transition-none={!ready}
	on:click={toggleMenu}
	bind:this={menu}
>
	<div
		class="flex flex-col lowercase transition-transform duration-500"
        class:!transition-none={!ready}
		style="transform: translateY(-{!open ? menuItemsOffset * 3 : 0}rem)"
		bind:this={menuItems}
	>
		<a href="/">home</a>
		{#each links as link}
			<a href="#{link}">{link}</a>
		{/each}
	</div>
	<div class="leading-[3rem]">menu</div>
</button>

<style lang="postcss">
	button a {
		@apply text-left leading-[3rem];
	}
</style>
