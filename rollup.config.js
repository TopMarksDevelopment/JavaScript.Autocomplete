import rollupTypescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import commonjs from '@rollup/plugin-commonjs';

export default {
    input: 'src/index.ts',
    external: ['@topmarksdevelopment/javascript-logger'],
    output: [
        {
            file: 'lib/index.js',
            format: 'umd',
            sourcemap: true,
            compact: false,
            name: 'TopMarksDevelopment',
        },
        {
            file: 'lib/index.cjs',
            format: 'cjs',
            sourcemap: true,
            compact: false,
        },
        {
            file: 'lib/index.m.js',
            format: 'es',
            sourcemap: true,
            compact: false,
        },
    ],
    plugins: [
        rollupTypescript(),
        terser({ sourceMap: true }),
        commonjs(),
        nodeResolve(),
    ],
};
