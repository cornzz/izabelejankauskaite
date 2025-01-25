import type { PageServerLoad } from './$types'
import fs from 'fs'
import YAML from 'yaml'

export const load: PageServerLoad = async () => {
	const calendarFile = await import('../calendar.yaml?raw')
	const calendarEvents = YAML.parse(calendarFile.default)

	return {
		calendarEvents
	}
}
