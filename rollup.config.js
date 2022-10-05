import autoExternal from 'rollup-plugin-auto-external';
import tsPlugin from '@rollup/plugin-typescript';
import resolve from "@rollup/plugin-node-resolve";
import json from '@rollup/plugin-json';
import pkg from "./package.json";
import commonjs from "@rollup/plugin-commonjs";
// import tsconfig from './tsconfig.json';

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
        json(),
        autoExternal(),
        tsPlugin(),
        commonjs(),
        resolve({
            exportConditions: ["import", "require", "default"],
            preferBuiltins: true
        }),
    ],
}