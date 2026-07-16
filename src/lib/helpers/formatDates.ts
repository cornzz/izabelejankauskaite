export const MONTH_NAMES = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December'
]

function ordinal(n: number): string {
	const v = n % 100
	const suffixes = ['th', 'st', 'nd', 'rd']

	return n + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0])
}

// A run of days within one month: "3rd" | "3rd and 4th" | "4th through 6th" (contiguous
// run of 3+) | "2nd, 4th and 5th" (non-contiguous).
function formatDayGroup(days: number[]): string {
	if (days.length === 1) return ordinal(days[0])
	if (days.length === 2) return `${ordinal(days[0])} and ${ordinal(days[1])}`
	const contiguous = days.every((day, index) => index === 0 || day === days[index - 1] + 1)
	if (contiguous) return `${ordinal(days[0])} through ${ordinal(days.at(-1)!)}`

	return days.slice(0, -1).map(ordinal).join(', ') + ' and ' + ordinal(days.at(-1)!)
}

// Turns a chronological list of YYYY-MM-DD dates into the natural-language string shown in
// the calendar, e.g. "24th and 30th of April, 2nd of May 2027". The year is appended once,
// after the last month of each year. Month groups are joined with ", " when the previous
// group has several days (to avoid a second "and"), otherwise with " and ".
export function formatDates(dates: string[]): string {
	const parsed = dates
		.map((date) => {
			const [year, month, day] = date.split('-').map(Number)
			return { year, month, day }
		})
		.sort((a, b) => a.year - b.year || a.month - b.month || a.day - b.day)

	const groups: { year: number; month: number; days: number[] }[] = []
	for (const p of parsed) {
		const last = groups.at(-1)
		if (last && last.year === p.year && last.month === p.month) last.days.push(p.day)
		else groups.push({ year: p.year, month: p.month, days: [p.day] })
	}

	return groups
		.map((group, i) => {
			const withYear = i === groups.length - 1 || groups[i + 1].year !== group.year
			const chunk = `${formatDayGroup(group.days)} of ${MONTH_NAMES[group.month - 1]}${withYear ? ' ' + group.year : ''}`
			if (i === 0) return chunk
			return (groups[i - 1].days.length > 1 ? ', ' : ' and ') + chunk
		})
		.join('')
}
