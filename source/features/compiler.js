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

    set: 'http://127.0.0.1:3000/build/_preact.js',
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
    vue: Object.values(vueCompiler),
    react: [babelCompiler.link].concat(Object.values(reactCompiler)),    
    preact: [babelCompiler.link].concat(Object.values(preactCompiler)),    
}