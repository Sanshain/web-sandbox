//@ts-check

import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from "rollup-plugin-terser";
// import { uglify } from "rollup-plugin-uglify";
import typescript from '@rollup/plugin-typescript';
import dts from "rollup-plugin-dts";


// import typescript from '@rollup/plugin-typescript';

const svelteEnv = [
    {
        inputFile: './source/libs/svelte-compiler.js',
        outputFile: 'svelte-compile.js',

        //   outputName: 'svelteTransform',
        outputName: 'svelteCompiler',
    },
    {
        inputFile: './source/libs/svelte-runtime.js',
        outputFile: 'svelte-runtime.js'
    },
]


/**
 * @type {Array<{inputFile: string, outputFile: string, outputName?: string, plugins?: any}>}
 */
const modules = [
    ...svelteEnv,
    // {
    //     inputFile: './index.ts',
    //     outputFile: './index.js',

    //     outputName: 'IDE',
    // },    
    {
        inputFile: './source/libs/preact.js',
        outputFile: '_preact.js',

        outputName: '_preact',
    },
    // {
    //     inputFile: './source/libs/preact.d.ts',
    //     outputFile: '_preact.d.ts',
    //     plugins: [dts()]
    // },    
    {
        inputFile: './source/main.js',
        outputFile: 'page_builder.js',

        outputName: 'IDE',
    },
    {
        // just page builder (w/o ui)
        inputFile: './source/pageBuilder.js',
        outputFile: 'page_compiler.js',

        outputName: 'pageBuilder',
    },
    //  {
    //      inputFile: './source/utils/bundler.js',
    //      outputFile: 'bundler.js',
    //      outputName: 'simplestBundler'
    //  },
    {
        inputFile: './source/utils/builder.js',
        outputFile: 'bundler.js',
        outputName: 'pageBundler'
    }
]


module.exports = modules.map(function (config) {

    let r = {
        input: config.inputFile,
        output: {
            file: config.outputFile && config.outputFile.startsWith('./')
                ? config.outputFile
                : ('./build/' + (config.outputFile || config.inputFile.split('/').pop())),
            format: 'iife',
            name: config.outputName,
            sourcemap: true,
            globals: {
                fs: undefined + '',
                path: 'null'
                // fs: 'window'
            }
        },
        plugins: config.plugins || [
            resolve({
                browser: true
            }),
            commonjs(),

            // typescript({
            //     // module: 'CommonJS', 
            //     // tsconfig: false, 
            //     lib: ["es6", "dom"], //es5
            //     target: "es5",
            //     sourceMap: true,
            //     exclude: [
            //         'node_modules/**/*',
            //         'node_modules_linux/**/*'
            //     ]
            // }),

            // terser({
            //     keep_fnames: /(loclog|onmessage)/,
            //     // mangle: true,
            //     mangle: false,
            //     compress: {
            //         drop_debugger: false,
            //         // drop_console: true
            //     },
            //     output: {
            //         comments: false,
            //     }
            // }),            
        ]
    }

    return r;
})