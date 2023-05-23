//@ts-check

import { encode } from "sourcemap-codec";

/**
 * @typedef {import("../main").LangMode} LangMode
 * @type {{
 *      editors: import("../aceInitialize").EditorsEnv | [],                                             // any[],
 *      iframe?: HTMLIFrameElement,
 *      curUrl?: string,
 *      fileStorage: {[k: string]: string | string[]} & { _active: string, },                            // _entryPoint?: string = ? || { _active: number|string, },
 *      modes?: [import("../main").LangMode?, LangMode?, LangMode?],                                     // [object?, object?, object?]
 *      onfilerename?: Function,
 *      onfileRemove?: (name: string) => void
 *      frameworkID: number                                                                              // 0 | 1 | 2 | 3
 *      entryPointName: string
 * }}
 *      activeModes?: [number?, number?, number?],                                                       // UNUSED - use getSelectedModeName now
 */
export const playgroundObject = {
   editors: [],
   iframe: void 0,
   curUrl: void 0,
   fileStorage: new Proxy(
      {
         // _active: 0
         _active: "app.js",
      },
      {
         set(target, prop, value) {
            // if (prop === '_active') {
            //    debugger
            // }
            // else {
            //    debugger
            // }            
            target[prop] = value;
            return true
         },
      }
   ),
   modes: void 0,
   // activeModes: [],
   onfilerename: void 0,
   onfileRemove: void 0,
   frameworkID: 0,
   get entryPointName() {
      const xExt = !!(this.frameworkID % 2) ? 'x' : '';
      const framweworkName = compilerNames[this.frameworkID];
      if (~singleFileTypes.indexOf(framweworkName)) return 'App.' + framweworkName;
      else {
         let m = this.fileStorage._active.match(/\.ts(x)?$/m)
         if (m) return 'app' + m[0];
         else {
            return 'app.js' + xExt; // + x;
            // return 'app.js';
         }
      }
   }
}

/**
 * @type {{ 
 *  [K in "svelte"] : {                                                       // |"vue"
 *      links?: string[],
 *      mode?: string,
 *      join?: (code: string, html: string, style: string) => string,
 *      split?: (code: string) => [string, string, string],
 *      onload?: (source: string, callback: Function) => unknown
 *  } | undefined
 * }}
 */
export const singleFileEnv = {
   svelte: {
      links: ["../../build/svelte-compile.js"],
      mode: ' type="text/svelte"',
      /**
       * @description join all scripts to the single file
       * @param {string} script 
       * @param {string} html 
       * @param {string} style 
       * @returns 
       */
      join(script, html, style) {

         const svelteFileContent = html + "\n\n<style>\n\n" + style + "\n\n</style>\n\n<script>\n\n" + script + "\n\n</script>";
         return svelteFileContent
      },
      split(code) {
         let script = '', style = '';

         code = code.replace(/\<script(?: lang=['"]ts['"])?\>(?<code>[\s\S]*?)\<\/script\>/, function (source, _script) {
            script = _script || '//';
            return ''
         });
         const html = code.replace(/\<style(?: lang=['"]\w+['"])?\>(?<style>[\s\S]*?)\<\/style\>/, function (source, _style) {
            style = _style || '';
            return ''
         });
         return [html, style, script];

      },
      /**
       * @description svelte code transforms and occurs on `this.links` scripts loaded
       * @param {(rawCode: string, getFile: (arg: string) => string) => {code: string;matches?: any[];}} svelteTransform
       * @param {string} entryPointCode
       * @param {Function} webCompile
       */
      onload(entryPointCode, webCompile) {
         /**
          * @type {(rawCode: string, opts: {sourceMaps?: boolean | 'js', getFile?: (arg: string) => string}) => {
          *    code: string, 
          *    matches?: any[],
          *    maps?: Record<string, {
          *       mappings: string,
          *       sources: string[],
          *       sourcesContent: string[],
          *       names?: string[]
          *    }>
          * }}
         */

         /**
          * @type {{
          *    transform: import("svelte-compiler").svelteTransform,
          *    mergeMaps: import("svelte-compiler").mergeSvelteMaps,
          * }}
          */
         // const svelteTransform = window["svelteTransform"]
         const svelteCompiler = window["svelteCompiler"];
         if (svelteCompiler) {

            const svelteApp = svelteCompiler.transform(entryPointCode, {
               sourceMaps: 'js',
               getFile(filename) {
                  const file = playgroundObject.fileStorage[filename] || playgroundObject.fileStorage[filename.replace(/^\.\//m, "")]
                  if (Array.isArray(file)) {
                     // TODO Inject less compilation
                     const style = file[1]
                     // TODO get ts from modes instead of global
                     const script = window["ts"] ? window["ts"].transpile(file[2]) : file[2]

                     const svelteFileContent = file[0] + "\n\n<style>\n\n" + style + "\n\n</style>\n\n<script>\n\n" + script + "\n\n</script>"
                     return svelteFileContent
                  }
                  else {
                     throw new Error("Unexpected file format for `" + filename + "`")
                  }
               }
            })

            const rootMapping = svelteCompiler.mergeMaps(entryPointCode, svelteApp.maps);
            if (svelteApp.maps) {
               svelteApp.maps.Root.sources[0] = 'App.svelte';
               // svelteApp.maps['Root'].mappings = encode(rootMapping); // if w/o require 
               svelteApp.maps['Root']['mappingsSchema'] = rootMapping
            }


            webCompile(svelteApp.code, svelteApp.maps)

            window.postMessage({ svelteApp: svelteApp }, playgroundObject.curUrl || '')
            window.postMessage({ svelteApp: svelteApp }, "*")
         }
      },
   },
   // vue: void 0,
}

export const singleFileTypes = Object.keys(singleFileEnv)



const reactCompiler = {
   react: "https://unpkg.com/react@17/umd/react.production.min.js",
   // react: '/static/js/compiler_libs/react.production.min.js',
   reactDOM: "https://unpkg.com/react-dom@17/umd/react-dom.production.min.js",
   // reactDOM: 'https://cdnjs.cloudflare.com/ajax/libs/react-dom/17.0.2/umd/react-dom.production.min.js',
   // reactDOM: '/static/js/compiler_libs/react-dom@17.production.min.js'
}

const vueCompiler = {
   // vue: "https://unpkg.com/vue@2.5.17/dist/vue.js"
   // vue: 'https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.14/vue.min.js',
   vue: "https://unpkg.com/vue@3/dist/vue.global.js",
}

const preactCompiler = {
   // set: './build/_preact.js',
   // set: '~/build/_preact.js',

   // preact: 'https://cdnjs.cloudflare.com/ajax/libs/preact/11.0.0-experimental.1/preact.umd.min.js',     // preact
   // hooks: 'https://cdnjs.cloudflare.com/ajax/libs/preact/11.0.0-experimental.1/hooks.umd.min.js',      // hooks
   // compat: 'https://cdnjs.cloudflare.com/ajax/libs/preact/11.0.0-experimental.1/compat.umd.min.js'     // react

   // set: 'http://127.0.0.1:3000/build/_preact.js',

   set:
      document.location.origin +
      (document.location.port.slice(0, 3) == "300" ? "/build/_preact.js" : "/static/js/compiler_libs/_preact.js"),
}

export const jscriptxCompiler = {
   // download babel
   // link: 'https://unpkg.com/@babel/standalone/babel.min.js',
   // link: "https://unpkg.com/@babel/standalone@7.21.4/babel.min.js",   
   // link: 'https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.21.4/babel.min.js',
   link: "http://127.0.0.1:3001/build/jsx.convert.js",
   // mode: ' type="text/babel" ',
   mode: ' type="text/jsx" ',
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
      createApp: ["https://unpkg.com/vue@3.2.47/dist/vue.global.js"],
      "new Vue": ["https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.14/vue.min.js"],
   },
   react: {
      createRoot: [
         "https://unpkg.com/react@18.2.0/umd/react.production.min.js",
         // 'https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js',
         "https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js",
      ],
      "ReactDOM.render": [
         "https://unpkg.com/react@17/umd/react.production.min.js",
         // '/static/js/compiler_libs/react.production.min.js',
         "https://unpkg.com/react-dom@17/umd/react-dom.production.min.js",
         // 'https://cdnjs.cloudflare.com/ajax/libs/react-dom/17.0.2/umd/react-dom.production.min.js'
         // '/static/js/compiler_libs/react-dom@17.production.min.js',
      ],
   },
}

// export const sfeCompilers = {
//     svelte(html, style, script) {
//         svelteCompile(html + `<style>${style}</style><script>${script}</script>`)
//     },
//     vue: undefined
// }

export const compilersSet = {
   vanile: [],
   preact: [jscriptxCompiler.link].concat(Object.values(preactCompiler)),
   vue: Object.values(vueCompiler),
   react: Object.values(reactCompiler).concat([jscriptxCompiler.link]),

   // TODO CHANGE TO MORE UNIVERSAL PATH:

   svelte: ["http://127.0.0.1:3001/build/svelte-runtime.js"],
}

export const compilerNames = Object.keys(compilersSet);



export const defaultValues = [
   // html
   {
      html: '<h2 onclick="greeting(event)">\n\tHello world!\n</h2>',
      // css: 'h2 {\n\tcolor: orangered;\n\tcursor: pointer; \n\tfont-family: arial;\n}',
      css: "body{\n    background-color: #555;\n}\n\nh2 {\n\tcolor: #aaa;\n\tcursor: pointer; \n\tfont-family: arial;\n}",
      javascript: 'function greeting(event){\n\talert("greeting!")\n}',
   },
   // preact
   {
      html: '<div id="root"></div>',
      css: "body{\n    background-color: #555;\n}\n\n#root{\n\tcolor: orangered;\n\tfont-family: arial;\n}",
      javascript: "const name = 'world'; \nrender(\n\t<h1>Hello {name}</h1>, \n\tdocument.getElementById('root')\n);",
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
      css: "#app button{ \n\tcolor: green; \n}",
      javascript:
         "i" + "mport { createApp } from 'vue'\n\nVue.createApp({\n\tdata() {\n\t\treturn {\n\t\t\tcount: 0\n\t\t}\n\t}\n}).mount('#app')",
   },
   // react
   {
      html: '<div id="root"></div>',
      // css: '#root{\n\tcolor: red;\n\tfont-family: arial;\n}\nh1{\n\tcursor: pointer;\n\tuser-select: none;\n}',
      css: "body{\n    background-color: #555;\n}\n\n#root{\n\tcolor: #aaa;\n\tfont-family: arial;\n}\nh1{\n\tcursor: pointer;\n\tuser-select: none;\n}",
      // javascript: "const name = 'world'; \n\nReactDOM.render(\n\t<h1>Привет, {name}!</h1>, \n\tdocument.getElementById('root')\n);"

      // "import React from 'react';\nimport ReactDOM from 'react-dom';"

      javascript:
         "function App(){\n\n\tconst [count, setCount] = React.useState(0);\n" +
         "\n\treturn <h1 onClick={()=>setCount(count+1)}>\n\t\tClick me: {count}!\n\t</h1>;\n}\n\nReactDOM.render(\n\t<App/>,\n\tdocument.getElementById('root')\n);",
   },
   // svelte
   {
      html: "<h1>Hello {place}!</h1>",
      // css: '#root{\n\tcolor: red;\n\tfont-family: arial;\n}\nh1{\n\tcursor: pointer;\n\tuser-select: none;\n}',
      css: "h1{ \n\tcolor: green; \n}",
      // javascript: "const name = 'world'; \n\nReactDOM.render(\n\t<h1>Привет, {name}!</h1>, \n\tdocument.getElementById('root')\n);"
      javascript: "let place = 'world'",
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
      let packageName = module.split("/").shift() /// preact/hooks => preact
      let packageNameParts = packageName.split("-") /// react-dom    => ['react', 'dom']; ['preact']
      let firstPart = packageNameParts[0][0].toUpperCase() + packageNameParts[0].slice(1) /// ['react', 'dom'] => React; Preact; Vue;
      const spreadedName = firstPart + (packageNameParts[1] || "").toUpperCase() /// React + dom => ReactDOM; React; Preact; Vue;

      // import defaultExport, { export1, /* … */ } from "module-name";
      if (~spreadedBlock.indexOf("{") && (spreadedBlock[0] != "{" || spreadedBlock.slice(-1) != "}")) {
         let r = spreadedBlock.match("{[w, _]+}")
         if (r) {
            spreadedBlock = r[0]
         }
      }

      // import * as name from "module-name";
      spreadedBlock = spreadedBlock.replace(/\* as \w+/, spreadedName)

      // import { export1, export2 as alias2, /* … */ } from "module-name";
      let result = "var " + spreadedBlock.replace(" as", ":") + " = " + spreadedName

      return result
   })

   // * -> Object.assign(window, default?) - unsupported
   // default, {a1, a2}                    - unsupported

   return code
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

window.onmessage = function (ev) {
   console.log("rootWindow catched this one: ", ev)
   // if from svelte => sent compiled code to evaluation

   console.log(arguments)
}

export const averageCompilerOptions = {}

