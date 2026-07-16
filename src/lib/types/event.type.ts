import type { Link } from './link.type'

export type Event = {
	dates: string[] // Chronological list of YYYY-MM-DD
	title: string
	program?: string
	links: Link[]
}
