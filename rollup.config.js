import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

// import typescript from '@rollup/plugin-typescript';

module.exports = {
    input: './source/em_initialize.js',
    output: {
        file: './build/editor.js',
        format: 'iife',
        name: "extend",
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
};