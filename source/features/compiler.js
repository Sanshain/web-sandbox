const reactCompiler = {
    react: 'https://unpkg.com/react@17/umd/react.production.min.js',
    reactDOM: 'https://unpkg.com/react-dom@17/umd/react-dom.production.min.js',
}

const vueCompiler = {
    // vue: "https://unpkg.com/vue@2.5.17/dist/vue.js"
    vue: 'https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.14/vue.min.js'
}

const preactCompiler = {
    // set: './build/_preact.js',
    // set: '~/build/_preact.js',

    // preact: 'https://cdnjs.cloudflare.com/ajax/libs/preact/11.0.0-experimental.1/preact.umd.min.js',     // preact
    // hooks: 'https://cdnjs.cloudflare.com/ajax/libs/preact/11.0.0-experimental.1/hooks.umd.min.js',      // hooks
    // compat: 'https://cdnjs.cloudflare.com/ajax/libs/preact/11.0.0-experimental.1/compat.umd.min.js'     // react

    // set: 'http://127.0.0.1:3000/build/_preact.js',

    set: document.location.origin + (~document.location.host.indexOf('3000') ? '/build/_preact.js' : '/static/js/compiler_libs/_preact.js'),
}


export const babelCompiler = {
    link: 'https://unpkg.com/@babel/standalone/babel.min.js',
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


export const compilers = {
    vanile: undefined,
    preact: [babelCompiler.link].concat(Object.values(preactCompiler)),
    vue: Object.values(vueCompiler),
    react: [babelCompiler.link].concat(Object.values(reactCompiler)),    
};


export const defaultValues = [
    // html
    {
        html: '<h2 onclick="greeting(event)">\n\tHello world!\n</h2>',
        css: 'h2 {\n\tcolor: green;\n\tcursor: pointer; \n}',
        javascript: 'function greeting(event){\n\talert("greeting!")\n}'
    },
    // preact
    {
        html: '<div id="root"></div>',
        css: '#root{\n\tcolor: red;\n}',
        javascript: "const name = 'world'; \n\trender(\n\t<h1>Hello {name}</h1>, \n\tdocument.getElementById('root')\n);"
    },
    // vue
    {
        html: '<div id="app">\n\t<input type="text" v-on:input="setMsg" />\n\t<p>{{msg}}</p>\n</div>',
        css: '#app { \n\tcolor: green; \n}',
        javascript: "new Vue({\n\tel: '#app', \n\tdata: {\n\t\tmsg: 'Hello Vue!'\n\t}, \n\tmethods: {\n\t\tsetMsg: function(e){\n\t\t\tthis.msg = e.target.value;\n\t\t}\n\t}\n})"
    },
    // react
    {
        html: '<div id="root"></div>',
        css: '#root{\n\tcolor: red;\n}\nh1{\n\tcursor: pointer;\n\tuser-select: none;\n}',
        // javascript: "const name = 'world'; \n\nReactDOM.render(\n\t<h1>Привет, {name}!</h1>, \n\tdocument.getElementById('root')\n);"
        javascript: "const name = 'world';function App(){\n\tconst [count, setCount] = React.useState(0);" +
                    "\n\treturn <h1 onClick={()=>setCount(count+1)}>Привет, {name} {count}!</h1>;\n}\n\nReactDOM.render(\n\t<App/>,\n\tdocument.getElementById('root')\n);"
    },
]