import autoExternal from 'rollup-plugin-auto-external';
import tsPlugin from '@rollup/plugin-typescript';
import resolve from "@rollup/plugin-node-resolve";
import { terser } from 'rollup-plugin-terser';
import json from '@rollup/plugin-json';
import pkg from "./package.json";
import tsconfig from './tsconfig.json';

export default {
    input: "src/index.ts",
    output: [
        {
            file: pkg.module,
            format: 'es',
            sourcemap: true
        },
    ],
    plugins: [
        autoExternal(),
        tsPlugin(tsconfig),
        resolve({
            preferBuiltins: true
        }),
        json(),
        terser({
            compress: {
                ecma: 2020,
                dead_code: false,
                drop_console: true,
                drop_debugger: true,
                keep_classnames: true,
                properties: false,
                reduce_funcs: false,
                reduce_vars: false
            },
            ecma: 2020,
            keep_classnames: true,
            mangle: false
        })
    ],
}