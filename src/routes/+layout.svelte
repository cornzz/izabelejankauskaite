<script>
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit'
	import '../app.css'

	injectSpeedInsights()
</script>

<svelte:head>
	<title>Izabelė Jankauskaitė</title>
</svelte:head>

<slot />
