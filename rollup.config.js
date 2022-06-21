import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from "rollup-plugin-terser";


// import typescript from '@rollup/plugin-typescript';

let modules = [
    // {
    //     inputFile: './source/em_initialize.js',
    //     outputFile: 'editor.js',

    //     outputName: 'extend',
    // },
    {
        inputFile: './source/libs/Preact.js',
        outputFile: '_preact.js',

        outputName: '_preact',
    },
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
    {
        inputFile: './source/utils/bundler.js',
        outputFile: 'bundler.js',
        outputName: 'simplestBundler'
    }
]

module.exports = modules.map(function (config) {
    
    let r = {
        input: config.inputFile,
        output: {
            file: './build/' + (config.outputFile || config.inputFile.split('/').pop()),
            format: 'iife',
            name: config.outputName,
            sourcemap: true,
            globals: {
                fs: undefined + '',
                // fs: 'window'
            }
        },
        plugins: [
            resolve({
                browser: true
            }),
            commonjs(),

            // typescript({
            //     // module: 'CommonJS', 
            //     // tsconfig: false, 
            //     lib: ["es6", "dom"], //es5
            //     target: "es5",
            //     sourceMap: true
            // }),

            // terser({
            //     output: {
            //         comments: false,
            //     }
            // }),
        ]
    }

    return r;
})