import type { PageServerLoad } from './$types'
import fs from 'fs'
import YAML from 'yaml'

export const load: PageServerLoad = () => {
	const calendarEvents = YAML.parse(fs.readFileSync('src/calendar.yaml', 'utf8'))

	return {
		calendarEvents
	}
}
