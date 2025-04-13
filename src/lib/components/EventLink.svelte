<script lang="ts">
	import type { Event } from '$lib/types'

	export let event: Event
</script>

<a class="group my-2 block" href={event.link} target="_blank">
    <span class="underline">Buy Tickets</span>
    <div class="inline-flex h-5 w-[18px] items-center overflow-hidden">
        <span class="-ml-3.5 transition-all group-hover:-ml-1"> &nbsp;→ </span>
        <img class="ml-[2px] h-4 -rotate-45 group-hover:ml-3" src="/icons/ticket.svg" alt="Ticket Icon" />
    </div>
</a>
