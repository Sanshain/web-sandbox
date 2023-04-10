//@ts-check




const reactCompiler = {
    react: 'https://unpkg.com/react@17/umd/react.production.min.js',
    // react: '/static/js/compiler_libs/react.production.min.js',
    reactDOM: 'https://unpkg.com/react-dom@17/umd/react-dom.production.min.js',
    // reactDOM: 'https://cdnjs.cloudflare.com/ajax/libs/react-dom/17.0.2/umd/react-dom.production.min.js',
    // reactDOM: '/static/js/compiler_libs/react-dom@17.production.min.js'
}

const vueCompiler = {
    // vue: "https://unpkg.com/vue@2.5.17/dist/vue.js"
    // vue: 'https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.14/vue.min.js',
    vue: 'https://unpkg.com/vue@3/dist/vue.global.js'
}

const preactCompiler = {
    // set: './build/_preact.js',
    // set: '~/build/_preact.js',

    // preact: 'https://cdnjs.cloudflare.com/ajax/libs/preact/11.0.0-experimental.1/preact.umd.min.js',     // preact
    // hooks: 'https://cdnjs.cloudflare.com/ajax/libs/preact/11.0.0-experimental.1/hooks.umd.min.js',      // hooks
    // compat: 'https://cdnjs.cloudflare.com/ajax/libs/preact/11.0.0-experimental.1/compat.umd.min.js'     // react

    // set: 'http://127.0.0.1:3000/build/_preact.js',

    set: document.location.origin + (document.location.port.slice(0, 3) == '300' ? '/build/_preact.js' : '/static/js/compiler_libs/_preact.js'),
}


export const babelCompiler = {
    // download babel
    // link: 'https://unpkg.com/@babel/standalone/babel.min.js',
    link: 'https://unpkg.com/@babel/standalone@7.21.4/babel.min.js',
    // link: 'https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.21.4/babel.min.js',
    mode: ' type="text/babel" '
}


// export const reactCompilers = [babelCompiler.link, reactCompiler.react, reactCompiler.reactDOM];

// export const reactCompilers = [
//     preactCompiler.set,
//     babelCompiler.link,
// ];

// export const reactCompilers = [
//     vueCompiler.vue
// ];


// v.1
// export const versionClarifier = {
//     __versions: [],
//     vue: (/** @type {string} */ value) => {
//         if (value.indexOf('createApp')) return {
//             version: '^3.2.47',
//             url: 'https://unpkg.com/vue@3/dist/vue.global.js'
//         }
//         // new Vue
//         else return {
//             version: '^2.6.14',
//             url: 'https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.14/vue.min.js'
//         }
//     }
// }

// // v.2
export const versionController = {
    vue: {
        // 'createApp': 'https://unpkg.com/vue@3/dist/vue.global.js',
        'createApp': ['https://unpkg.com/vue@3.2.47/dist/vue.global.js'],
        'new Vue': ['https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.14/vue.min.js']
    },
    react: {
        'createRoot': [
            'https://unpkg.com/react@18.2.0/umd/react.production.min.js',
            // 'https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js'
        ],
        'ReactDOM.render': [
            'https://unpkg.com/react@17/umd/react.production.min.js',
            // '/static/js/compiler_libs/react.production.min.js',
            'https://unpkg.com/react-dom@17/umd/react-dom.production.min.js',
            // 'https://cdnjs.cloudflare.com/ajax/libs/react-dom/17.0.2/umd/react-dom.production.min.js'
            // '/static/js/compiler_libs/react-dom@17.production.min.js',
        ]
    }
}


export const compilers = {
    vanile: [],
    preact: [babelCompiler.link].concat(Object.values(preactCompiler)),
    vue: Object.values(vueCompiler), 
    react: Object.values(reactCompiler).concat([babelCompiler.link]),    
};

console.log(compilers);


export const defaultValues = [
    // html
    {
        html: '<h2 onclick="greeting(event)">\n\tHello world!\n</h2>',
        // css: 'h2 {\n\tcolor: orangered;\n\tcursor: pointer; \n\tfont-family: arial;\n}',
        css: 'body{\n    background-color: #555;\n}\n\nh2 {\n\tcolor: #aaa;\n\tcursor: pointer; \n\tfont-family: arial;\n}',
        javascript: 'function greeting(event){\n\talert("greeting!")\n}'
    },
    // preact
    {
        html: '<div id="root"></div>',
        css: 'body{\n    background-color: #555;\n}\n\n#root{\n\tcolor: orangered;\n\tfont-family: arial;\n}',
        javascript: "const name = 'world'; \nrender(\n\t<h1>Hello {name}</h1>, \n\tdocument.getElementById('root')\n);"
    },
    // vue
    {
        // v2:
        // html: '<div id="app">\n\t<input type="text" v-on:input="setMsg" />\n\t<p>{{msg}}</p>\n</div>',
        // css: 'body{\n    background-color: #555;\n}\n\n#app { \n\tcolor: green; \n}',
        // // "import { Vue } from 'vue'"
        // javascript: "new Vue({\n\tel: '#app', \n\tdata: {\n\t\tmsg: 'Hello Vue!'\n\t}, \n\tmethods: {\n\t\tsetMsg: function(e){\n\t\t\tthis.msg = e.target.value;\n\t\t}\n\t}\n})"
        
        // v3:
        html: '<div id="app">\n\t<button @click="count++">\n\t\tCount is: {{ count }}\n\t</button>\n</div>',
        css: '#app button{ \n\tcolor: green; \n}',
        javascript: "import { createApp } from 'vue'\n\ncreateApp({\n\tdata() {\n\t\treturn {\n\t\t\tcount: 0\n\t\t}\n\t}\n}).mount('#app')"
    },
    // react
    {
        html: '<div id="root"></div>',
        // css: '#root{\n\tcolor: red;\n\tfont-family: arial;\n}\nh1{\n\tcursor: pointer;\n\tuser-select: none;\n}',
        css: 'body{\n    background-color: #555;\n}\n\n#root{\n\tcolor: #aaa;\n\tfont-family: arial;\n}\nh1{\n\tcursor: pointer;\n\tuser-select: none;\n}',
        // javascript: "const name = 'world'; \n\nReactDOM.render(\n\t<h1>Привет, {name}!</h1>, \n\tdocument.getElementById('root')\n);"
        
        // "import React from 'react';\nimport ReactDOM from 'react-dom';"

        javascript: "function App(){\n\n\tconst [count, setCount] = React.useState(0);\n" +
                    "\n\treturn <h1 onClick={()=>setCount(count+1)}>\n\t\tClick me: {count}!\n\t</h1>;\n}\n\nReactDOM.render(\n\t<App/>,\n\tdocument.getElementById('root')\n);"
    },
]


/**
 * Replace imprt to spread. 
 * @param {string} code 
 * @returns {string}
 */
export function spreadImports(code) {
    
    code = code.replace(/import ([\{\w, _\*\}]+) \s*from \s*['"]([\w-_\.\/]+)['"]/gm, function (match, spreadedBlock, module) {
        
        /**
         * @type {string}
         */
        let packageName = module.split('/').shift()                                             /// preact/hooks => preact
        let packageNameParts = packageName.split('-');                                          /// react-dom    => ['react', 'dom']; ['preact']
        let firstPart = packageNameParts[0][0].toUpperCase() + packageNameParts[0].slice(1)     /// ['react', 'dom'] => React; Preact; Vue;
        const spreadedName = firstPart + (packageNameParts[1] || '').toUpperCase()              /// React + dom => ReactDOM; React; Preact; Vue;        

        // import defaultExport, { export1, /* … */ } from "module-name";
        if (~spreadedBlock.indexOf('{') && (spreadedBlock[0] != '{' || spreadedBlock.slice(-1) != '}')) {
            let r = spreadedBlock.match('\{[\w, _]+\}')
            if (r) {
                spreadedBlock = r[0];
            }
        }
        
        // import * as name from "module-name";
        spreadedBlock = spreadedBlock.replace(/\* as \w+/, spreadedName)

        // import { export1, export2 as alias2, /* … */ } from "module-name";
        let result = 'var ' + spreadedBlock.replace(' as', ':') + ' = ' + spreadedName;

        return result;
    })
    
    // * -> Object.assign(window, default?) - unsupported
    // default, {a1, a2}                    - unsupported

    return code;
}



// vue3: 

// const { createApp } = Vue

// createApp({
//     data() {
//         return {
//             message: 'Hello Vue!'
//         }
//     }
// }).mount('#app')