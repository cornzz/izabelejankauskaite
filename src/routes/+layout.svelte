<script>
	import { inject } from '@vercel/analytics'
	import '../app.css'

	inject()
</script>

<slot />

<div class="hidden">Prerendered at: {new Date()}</div>
