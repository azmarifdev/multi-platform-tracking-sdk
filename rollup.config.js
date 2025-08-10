import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import { readFileSync } from 'fs';

const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));

export default [
    // ESM and CJS builds
    {
        input: 'src/index.ts',
        output: [
            {
                file: packageJson.main,
                format: 'cjs',
                sourcemap: true,
                exports: 'named',
            },
            {
                file: packageJson.module,
                format: 'esm',
                sourcemap: true,
            },
        ],
        plugins: [
            resolve(),
            commonjs(),
            typescript({
                tsconfig: './tsconfig.json',
                exclude: ['**/*.test.ts', '**/*.spec.ts', '**/__tests__/**'],
            }),
        ],
        external: ['tslib'],
    },
    // TypeScript definitions
    {
        input: 'src/index.ts',
        output: {
            file: packageJson.types,
            format: 'esm',
        },
        plugins: [
            dts({
                exclude: ['**/*.test.ts', '**/*.spec.ts', '**/__tests__/**'],
            }),
        ],
    },
];
