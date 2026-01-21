const dsTailwind = require('@navikt/ds-tailwind');

module.exports = {
	presets: [dsTailwind],
	content: ['./src/**/*.{js,jsx,ts,tsx}', '/dist/index.html'],
	corePlugins: {
		preflight: false,
	},
	theme: {
		extend: {
			keyframes: {
				highlight: {
					'0%': { boxShadow: '0 0 0 2px rgb(59 130 246)', backgroundColor: 'rgb(239 246 255)' },
					'100%': { boxShadow: '0 0 0 0px rgb(59 130 246)', backgroundColor: 'rgb(249 250 251)' },
				},
			},
			animation: {
				highlight: 'highlight 0.75s ease-out',
			},
		},
	},
	plugins: [],
};
