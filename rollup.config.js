import autoExternal from 'rollup-plugin-auto-external';
import tsPlugin from '@rollup/plugin-typescript';
import resolve from "@rollup/plugin-node-resolve";
import json from '@rollup/plugin-json';
import commonjs from "@rollup/plugin-commonjs";
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const pkg = require('./package.json')
const tsconfig = require('./tsconfig.json')

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
        tsPlugin(tsconfig),
        commonjs(),
        resolve({
            exportConditions: ["import", "require", "default"],
            preferBuiltins: true
        }),
    ],
}