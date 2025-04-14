import path from 'path';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import { DEFAULT_EXTENSIONS } from '@babel/core';
import alias from 'rollup-plugin-alias';

const VERSION = process.env.VERSION || require('./package.json').version;
const pathResolve = dir => path.join(__dirname, dir);

const banner =
	'/*!\n' +
	` * @fe-hl/monitor-sdk v${VERSION}\n` +
	` * (c) 2022-${new Date().getFullYear()} hl\n` +
	' * Released under the MIT License.\n' +
	' */';

export default {
	input: pathResolve('src/index.ts'),
	output: [
		{
			file: pathResolve('lib/index.common.js'),
			format: 'cjs',
			banner,
		},
		{
			file: pathResolve('lib/index.esm.js'),
			format: 'es',
			banner,
		},
		{
			file: pathResolve('lib/index.browser.js'),
			format: 'umd',
			name: '__MONITOR_SDK__',
			banner,
		},
	],
	plugins: [
		alias({
			'@': pathResolve('src'),
		}),
		typescript({
			tsconfig: 'tsconfig.json',
			useTsconfigDeclarationDir: true,
		}),
		nodeResolve(),
		commonjs(),
		babel({
			exclude: 'node_modules/**', // 防止打包node_modules下的文件
			babelHelpers: 'runtime', // 使plugin-transform-runtime生效
			// 解析 拓展名为ts的文件
			extensions: [...DEFAULT_EXTENSIONS, '.ts'],
			// 使用预设
			presets: [
				[
					'@babel/preset-env',
					{
						modules: false,
						useBuiltIns: 'usage',
						corejs: '3.25.0',
						// 目标浏览器
						targets: {
							edge: '17',
							firefox: '60',
							chrome: '67',
							safari: '11.1',
							ie: '10',
						},
					},
				],
			],
			plugins: [
				//  多次导入的文件，只导入一次
				['@babel/plugin-transform-runtime'],
			],
		}),
	],
};
