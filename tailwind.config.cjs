const dsTailwind = require('@navikt/ds-tailwind');

module.exports = {
	presets: [dsTailwind],
	content: ['./src/**/*.{js,jsx,ts,tsx}', '/dist/index.html'],
	corePlugins: {
		preflight: false,
	},
	theme: {
		extend: {},
	},
	plugins: [],
};
