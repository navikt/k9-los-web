import CircularDependencyPlugin from 'circular-dependency-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import { fileURLToPath } from 'url';

const isDevelopment = JSON.stringify(process.env.NODE_ENV) === '"development"';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const CORE_DIR = path.resolve(dirname, '../node_modules');
const ROOT_DIR = path.resolve(dirname, '../src/client');
const APP_DIR = path.join(ROOT_DIR, 'app');
const STYLE_DIR = path.join(ROOT_DIR, 'styles');
const config = {
	module: {
		rules: [
			{
				test: /\.(tsx?|ts?)$/,
				loader: 'babel-loader',
				options: {
					cacheDirectory: true,
				},
				include: [APP_DIR],
			},
			{
				test: /\.m?js/,
				resolve: {
					fullySpecified: false,
				},
			},
			{
				test: /\.css?$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							publicPath: isDevelopment ? './' : '',
						},
					},
					{
						loader: 'css-loader',
						options: {
							importLoaders: 1,
							modules: {
								localIdentName: '[name]_[local]_[contenthash:base64:5]',
							},
						},
					},
				],
				include: [APP_DIR],
			},
			{
				test: /\.(less|css)?$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							publicPath: isDevelopment ? './' : '',
						},
					},
					{
						loader: 'css-loader',
					},
					{
						loader: 'less-loader',
						options: {
							lessOptions: {
								modifyVars: {
									nodeModulesPath: '~',
									coreModulePath: '~',
								},
							},
						},
					},
				],
				include: [CORE_DIR],
			},
			{
				test: /\.css$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							publicPath: isDevelopment ? './' : '',
						},
					},
					'css-loader',
					'postcss-loader',
				],
				include: [STYLE_DIR],
			},
			{
				test: /\.svg/,
				type: 'asset/inline',
			},
		],
	},

	plugins: [
		new MiniCssExtractPlugin({
			filename: 'style_[contenthash].css',
			ignoreOrder: true,
		}),
		new CircularDependencyPlugin({
			exclude: /node_modules/,
			failOnError: true,
		}),
	],

	resolve: {
		alias: {
			react: path.resolve(dirname, '../node_modules/react'),
			'react-dom': path.resolve(dirname, '../node_modules/react-dom'),
			styles: path.join(ROOT_DIR, 'styles'),
			images: path.join(ROOT_DIR, 'images'),
			testHelpers: path.join(ROOT_DIR, 'testHelpers'),
			app: path.join(APP_DIR, 'app'),
			types: path.join(APP_DIR, 'types'),
			hooks: path.join(APP_DIR, 'hooks'),
			navAnsatt: path.join(APP_DIR, 'navAnsatt'),
			form: path.join(APP_DIR, 'form'),
			saksbehandler: path.join(APP_DIR, 'saksbehandler'),
			avdelingsleder: path.join(APP_DIR, 'avdelingsleder'),
			api: path.join(APP_DIR, 'api'),
			kodeverk: path.join(APP_DIR, 'kodeverk'),
			sharedComponents: path.join(APP_DIR, 'sharedComponents'),
			utils: path.join(APP_DIR, 'utils'),
			filter: path.join(APP_DIR, 'filter'),
		},
		fullySpecified: false,
		extensions: ['.js', '.ts', '.tsx', '.mjs', '.cjs', '.jsx', '.less', '.css'],
	},

	externals: {
		cheerio: 'window',
		'react/addons': 'react',
		'react/lib/ExecutionEnvironment': 'react',
		'react/lib/ReactContext': 'react',
	},
};

export default config;
