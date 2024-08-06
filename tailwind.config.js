/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				'windows-grey': '#c6c6c6',
				'windows-dark-grey': '#404040',
				'windows-blue': '#000080;'
			}
		}
	},
	plugins: []
};
