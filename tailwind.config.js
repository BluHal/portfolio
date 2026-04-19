/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				'windows-grey': 'var(--win-grey)',
				'windows-dark-grey': 'var(--win-dark-grey)',
				'windows-blue': 'var(--win-blue)'
			}
		}
	},
	plugins: []
};
