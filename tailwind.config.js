/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			animation: {
				'fadein-slow': 'fadein 1s ease-in-out .5s forwards'
			},
			keyframes: {
				'fadein': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				}
			}
		}
	},
	plugins: []
}
