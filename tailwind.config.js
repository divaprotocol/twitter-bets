/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx}',
		'./src/components/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		extend: {
			fontFamily: {
				body: ['PPCirka', 'sans-serif'],
				text: ['Gilroy', 'sans-serif'],
				cirka: ['Cirka', 'sans-serif'],
			},
			animation: {
				shine: 'shine 3s ease-in-out infinite',
			},
			keyframes: {
				shine: {
					'0%': { left: '-50%' },
					'100%': { left: '100%' },
				},
			},
		},
	},
	plugins: [],
}
