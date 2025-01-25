<script>
	import { inject } from '@vercel/analytics'
	import '../app.css'

	inject()
</script>

<svelte:head>
	<title>Izabelė Jankauskaitė</title>
</svelte:head>

<slot />

<div class="hidden">Prerendered at: {new Date()}</div>