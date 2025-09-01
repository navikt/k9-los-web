module.exports = function (api) {
	// eslint-disable-next-line no-unused-expressions
	api ? api.cache(true) : null;

	return {
		presets: [
			[
				'@babel/preset-react',
				{
					runtime: 'automatic', // This enables automatic JSX runtime
				},
			],
			[
				'@babel/preset-env',
				{
					targets: { node: 'current', esmodules: true },
				},
			],
			'@babel/preset-typescript',
		],
	};
};
