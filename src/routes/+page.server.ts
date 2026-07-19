import { composeProgram } from '$lib/helpers'
import { db } from '$lib/server/db'
import { events } from '$lib/server/db/schema'
import { getBiography } from '$lib/server/content'
import { DEFAULT_BIOGRAPHY } from '$lib/defaultContent'
import type { Event } from '$lib/types'
import type { Config } from '@sveltejs/adapter-vercel'
import type { PageServerLoad } from './$types'

// ISR: cache the public page for up to a day; a write action revalidates it on
// demand via the bypass token (see src/lib/server/revalidate.ts). Scoped to this
// route so the dynamic /admin routes stay uncached.
export const config: Config = {
	isr: {
		expiration: 60 * 60 * 24, // 1 day
		bypassToken: process.env.ISR_BYPASS_TOKEN
	}
}

export const load: PageServerLoad = async () => {
	try {
		const [rows, biography] = await Promise.all([db.select().from(events), getBiography()])

		rows.sort((a, b) => (a.dates[0] < b.dates[0] ? 1 : a.dates[0] > b.dates[0] ? -1 : 0))

		const calendarEvents: Event[] = rows.map((row) => ({
			title: row.title,
			dates: row.dates,
			program: composeProgram(row.program),
			links: row.links
		}))

		return { calendarEvents, biography }
	} catch (error) {
		console.error('Public content DB unavailable; using empty calendar + default biography.', error)

		return { calendarEvents: [] as Event[], biography: DEFAULT_BIOGRAPHY }
	}
}
