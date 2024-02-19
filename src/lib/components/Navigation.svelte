<script lang="ts">
	import { clickOutside } from '$lib/helpers'
	import { onMount } from 'svelte'

	export let links: string[]

	let open: boolean = false
	let innerHeight: number = 0
	let scrollY: number = -11
	let menu: HTMLElement
	let menuItems: HTMLElement
	let menuItemsOffset: number = 0
	let scrolling: boolean = false
	let ready: boolean = false

	export function setActive(id: string): void {
		menuItemsOffset = links.indexOf(id) + 1
		scrolling = true
		setTimeout(() => (scrolling = false), 500)
	}

	function toggleMenu(event: MouseEvent | null, forceClose: boolean = false): void {
		open = forceClose ? false : !open
		if (event?.target instanceof HTMLAnchorElement) {
			if (open) {
				event.preventDefault()
			} else {
				const id = event.target.href.split('#')[1]
				setActive(id)
			}
		}
		menu.style.minHeight = open ? `${menuItems.scrollHeight}px` : '0'
	}

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					const top = entry.boundingClientRect.top
					const bottom = entry.boundingClientRect.bottom
					const threshold = innerHeight * 1/3
					if (!scrolling && top < threshold && bottom > threshold) {
						menuItemsOffset = links.indexOf(entry.target.id) + 1
					}
				})
			},
			{
				threshold: Array(10).fill(1).map((_, i) => (i + 1) / 10)
			}
		)

		document.querySelectorAll('section').forEach((section) => observer.observe(section))
		setTimeout(() => (ready = true), 50)

		return () => observer.disconnect()
	})
</script>

<svelte:window bind:innerHeight bind:scrollY />

<button
	class="fixed top-0 z-50 flex h-12 min-h-0 w-full transform justify-between overflow-hidden bg-[aliceblue]
           px-8 shadow-lg transition-all duration-300
		   {open || scrollY >= innerHeight - 10 ? 'translate-y-0' : '-translate-y-16'}"
	class:!transition-none={!ready}
	on:click={toggleMenu}
	use:clickOutside={() => toggleMenu(null, true)}
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
