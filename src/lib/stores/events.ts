import type { Event } from "$lib"

// lastDate: m/d/yyyy format of the last date of the event after which it will not be displayed

export const events: Event[] = [
    {
        dates: '09th of March 2024',
        title: 'Folkwang Kammerorchester',
        link: 'https://www.folkwang-kammerorchester.de/konzerte-zollverein-philharmonie/#a2',
        lastDate: new Date('3/9/2024')
    },
    {
        dates: 'tba',
        title: 'Konzerthausorchester - Ivan Fischer',
        link: '',
        lastDate: null
    },
    {
        dates: '19th, 20th and 21st of April 2024',
        title: 'Landesjugendsinfonieorchester Hessen',
        link: 'https://www.tauberphilharmonie.de/programm-tickets/veranstaltung/landesjugendorchester-hessen',
        lastDate: new Date('4/21/2024')
    },
    {
        dates: '9th and 10th of May 2024',
        title: 'Orquesta De Extremadura',
        link: 'https://www.orquestadeextremadura.com/calendario/',
        lastDate: new Date('5/10/2024')
    },
    {
        dates: '8th of September 2024',
        title: 'Kammerorchester Basel',
        link: '',
        lastDate: new Date('9/8/2024')
    },
    {
        dates: '1st through 5th of October 2024',
        title: 'Royal Stockholm Philharmonic',
        link: '',
        lastDate: new Date('10/5/2024')
    },
    {
        dates: '19th and 20th of October 2024',
        title: 'MDR Sinfonieorchester',
        link: '',
        lastDate: new Date('10/20/2024')
    },
    {
        dates: '25th through 27th of October 2024',
        title: 'Argovia Philhamonia',
        link: '',
        lastDate: new Date('10/27/2024')
    },
    {
        dates: '5th of December 2024',
        title: 'Philharmonisches Orchester Heidelberg',
        link: '',
        lastDate: new Date('12/5/2024')
    },
    {
        dates: '20th and 21st of February 2025',
        title: 'South Denmark SO',
        link: '',
        lastDate: new Date('2/21/2025')
    }
]