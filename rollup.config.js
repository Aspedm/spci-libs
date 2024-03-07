import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import { dts } from 'rollup-plugin-dts';

import pkg from './package.json' assert { type: 'json' };

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

const plugins = [
    json(),
    nodeResolve({ extensions }),
    commonjs(),
    babel({
        extensions,
        babelHelpers: 'bundled',
    }),
    terser(),
];

export default [
    {
        input: 'src/index.ts',
        external: [Object.keys(pkg.dependencies || {}), Object.keys(pkg.peerDependencies || {})].flat(),
        output: [
            {
                file: pkg.module,
                format: 'esm',
            },
            {
                file: pkg.main,
                format: 'cjs',
            },
        ],
        plugins,
    },
    {
        input: './src/index.ts',
        output: [{ file: pkg.types, format: 'es' }],
        plugins: [dts()],
    },
];
