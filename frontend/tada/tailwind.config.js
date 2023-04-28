/** @type {import('tailwindcss').Config} */

module.exports = {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			fontFamily: {
				noto: 'Noto Sans',
				sans: 'Nanum Square',
			},
			colors: {
				transparent: 'transparent',
				white2: '#F4FAFF',
				main: '#488AF9',
				main2: '#50A6FE',
				main3: '#69BFFF',
				main4: '#FF8AD1',
				orange: '#FBC046',
				orange2: '#FF9861',
				blue: '#2BDCDB',
				blue2: '#0CC3F5',
				red: '#FE536B',
				green: '#8DD54F',
				gray: '#DFE0DF',
				gray2: '#AEAFAE',
				gray3: '#7F807F',
				gray4: '#535453',
				gray5: '#2B2C2B',
			},
		},
	},
	plugins: [],
};
