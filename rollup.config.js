import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import dts from 'rollup-plugin-dts';
import { readFileSync } from 'fs';

const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));
const isProduction = process.env.NODE_ENV === 'production';

export default [
    // ESM and CJS builds
    {
        input: 'src/index.ts',
        output: [
            {
                file: packageJson.main,
                format: 'cjs',
                sourcemap: !isProduction,
                exports: 'named',
            },
            {
                file: packageJson.module,
                format: 'esm',
                sourcemap: !isProduction,
            },
        ],
        plugins: [
            resolve(),
            commonjs(),
            typescript({
                tsconfig: './tsconfig.json',
                exclude: ['**/*.test.ts', '**/*.spec.ts', '**/__tests__/**'],
            }),
            ...(isProduction
                ? [
                      terser({
                          compress: {
                              drop_console: true,
                              drop_debugger: true,
                          },
                          mangle: {
                              keep_classnames: true,
                              keep_fnames: true,
                          },
                      }),
                  ]
                : []),
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
                // Bundle all type definitions into single file
                respectExternal: false,
            }),
        ],
    },
];
