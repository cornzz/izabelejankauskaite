// One-time migration: read src/calendar.yaml and insert the entries into Postgres.
// Run once, locally, after the tables exist (drizzle-kit push):
//   node --env-file=.env.local --import tsx scripts/migrate-calendar.ts
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import fs from 'node:fs'
import YAML from 'yaml'
import { parseProgram } from '../src/lib/helpers/program'
import { events } from '../src/lib/server/db/schema'

const db = drizzle(neon(process.env.DATABASE_URL!))

type YamlEvent = {
	title: string
	dates: string[]
	program?: string
	links?: { href: string; info?: string }[]
}

const parsed = YAML.parse(fs.readFileSync('src/calendar.yaml', 'utf8')) as YamlEvent[]

let fallbackLines = 0
for (const entry of parsed) {
	const program = parseProgram(entry.program)
	fallbackLines += program.filter((row) => !row.composer).length
	await db.insert(events).values({
		title: entry.title,
		dates: [...entry.dates].sort(),
		program,
		links: entry.links ?? []
	})
}

console.log(`Inserted ${parsed.length} events.`)
if (fallbackLines) {
	console.log(
		`Note: ${fallbackLines} program line(s) weren't in "<b>Composer</b>: Title" shape and were kept verbatim (composer=""). This is expected for "TBA"/prose/date-label lines — spot-check them.`
	)
}
