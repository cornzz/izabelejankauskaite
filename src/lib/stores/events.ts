import type { Event } from '$lib'

// lastDate: m/d/yyyy format of the last date of the event after which it will not be displayed

export const events: Event[] = [
	{
		title: 'Tonkünstler-Orchester',
		dates: '26th of April 2025',
		link: 'https://www.stadttheater-wn.at/de/programm/fruhlingssymphonie/26741',
		lastDate: new Date('4/26/2025')
	},
	{
		title: 'Tonkünstler-Orchester',
		dates: '25th of April 2025',
		link: '',
		lastDate: new Date('4/25/2025')
	},
	{
		title: 'Basel Chamber Orchestra',
		dates: '10th and 11th of April 2025',
		link: 'https://www.kammerorchesterbasel.ch/de/konzerte/von-der-muse-gekuesst.html',
		lastDate: new Date('4/11/2025')
	},
	{
		title: 'Darmstadt State Theatre',
		dates: '2nd and 3rd of March 2025',
		link: 'https://www.staatstheater-darmstadt.de/veranstaltungen/5-sinfoniekonzert.1754/#event-10655',
		lastDate: new Date('3/3/2025')
	},
	{
		title: 'Sønderjyllands Symfoniorkester',
		dates: '20th and 21st of February 2025',
		link: 'https://sdjsymfoni.dk/koncerter/griegs-klaverkoncert',
		lastDate: new Date('2/21/2025')
	},
	{
		title: 'Tonhalle-Orchester Zürich',
		dates: '12th and 13th of January 2025',
		link: 'https://www.tonhalle-orchester.ch/konzerte/kalender/familienkonzert-konferenz-der-tiere-1871224',
		lastDate: new Date('1/13/2025')
	},
	{
		title: 'hr-Sinfonieorchester',
		dates: '1st of January 2025',
		link: 'https://meisterkonzerte-wiesbaden.de/konzerte/neujahrskonzert-in-wiener-tradition-hr-sinfonieorchester-guido-sant-anna',
		lastDate: new Date('1/1/2025')
	},
	{
		title: 'Theater und Orchester Heidelberg',
		dates: '4th and 5th of December 2024',
		link: 'https://www.theaterheidelberg.de/de/produktionen/12551-rhapsody',
		lastDate: new Date('12/5/2024')
	},
	{
		title: 'Argovia Philharmonic',
		dates: '25th through 27th of October 2024',
		link: 'https://argoviaphil.ch/event/loewenkonzert-3',
		lastDate: new Date('10/27/2024')
	},
	{
		title: 'MDR Sinfonieorchester',
		dates: '19th and 20th of October 2024',
		link: 'https://www.mdr.de/konzerte/konzertkalender/konzert4500_day-20_month-10_year-2024_zc-6fffa2b4.html',
		lastDate: new Date('10/20/2024')
	},
	{
		title: 'Royal Stockholm Philharmonic',
		dates: '1st through 5th of October 2024',
		link: 'https://www.konserthuset.se/en/programme/calendar/concert/2024/school-concert-baltic-the-environmental-robot/20241001-1100',
		lastDate: new Date('10/5/2024')
	},
	{
		title: 'Kammerorchester Basel',
		dates: '8th of September 2024',
		link: '',
		lastDate: new Date('9/8/2024')
	},
	{
		title: 'Orquesta De Extremadura',
		dates: '9th and 10th of May 2024',
		link: 'https://www.orquestadeextremadura.com/calendario/',
		lastDate: new Date('5/10/2024')
	},
	{
		title: 'Landesjugend&shy;sinfonieorchester Hessen',
		dates: '19th, 20th and 21st of April 2024',
		link: 'https://www.tauberphilharmonie.de/programm-tickets/veranstaltung/landesjugendorchester-hessen',
		lastDate: new Date('4/21/2024')
	},
	{
		title: 'Folkwang Kammerorchester',
		dates: '09th of March 2024',
		link: 'https://www.folkwang-kammerorchester.de/konzerte-zollverein-philharmonie/#a2',
		lastDate: new Date('3/9/2024')
	}
].reverse()
