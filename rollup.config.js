import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

// import typescript from '@rollup/plugin-typescript';

let modules = [
    // {
    //     inputFile: './source/em_initialize.js',
    //     outputFile: 'editor.js',

    //     outputName: 'extend',
    // },
    {
        inputFile: './source/pageBuilder.js',
        outputFile: 'page_builder.js',
        
        outputName: '__',
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
        ]
    }

    return r;
})