/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			animation: {
				'fadein-slow': 'fadein 1s ease-in-out .25s forwards'
			},
			keyframes: {
				fadein: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				}
			},
			screens: {
				'3xl': '1920px',
				'low-aspect-ratio': { raw: '(max-width: 640px) and (max-aspect-ratio: 3/4)' },
				'hover-d': { raw: '(hover: hover)' }
			}
		}
	},
	plugins: []
}
