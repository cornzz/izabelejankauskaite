import type { Link } from './link.type'

export type Event = {
	dates: string
	title: string
	program?: string
	links: Link[]
	lastDate: Date
}
