<script>
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit'
	import '../app.css'

	injectSpeedInsights()
</script>

<slot />
