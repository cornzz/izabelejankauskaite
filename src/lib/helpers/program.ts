export type ProgramRow = { composer: string; title: string }

export function composeProgram(rows: ProgramRow[]): string | undefined {
	if (!rows.length) return undefined

	return rows.map((row) => (row.composer ? `<b>${row.composer}</b>: ${row.title}` : row.title)).join('\n')
}

export function parseProgram(block?: string | null): ProgramRow[] {
	if (!block) return []

	return block
		.split('\n')
		.filter(Boolean)
		.map((line) => {
			const match = line.match(/^<b>(.*?)<\/b>: (.*)$/)
			return match ? { composer: match[1], title: match[2] } : { composer: '', title: line }
		})
}
