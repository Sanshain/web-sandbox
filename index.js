//@ts-check

/**
 * @typedef {import("./source/main").SyntaxMode} SyntaxMode
 * @typedef {import("./source/main").LangMode} LangMode
 * @typedef {import("./source/aceInitialize").AceEditor} AceEditor
 * @typedef {import("./source/aceInitialize").EditorsEnv} EditorsEnv
 * @typedef {import("typescript").LanguageServiceHost} LanguageServiceHost
 * @typedef {import("./source/ui/ChoiceMenu").ChoiceDetails} ChoiceDetails
 */



/**
* to .close
*/
// function hideConsole(event) {
//     event.target.parentElement.classList.toggle('hidden');
//     ['.play', '.save'].forEach(function (s) { 
//         let el = document.querySelector(s); 
//         console.log(el);
//         el && el.classList.remove('hidden'); 
//     })

//     // this.parentElement.classList.toggle('hidden'); ['.play', '.save'].map(s => {let el = document.querySelector(s); el && el.classList.toggle('hidden')})
//     // ['.play', '.save'].map(s => document.querySelector(s)).concat(event.target.parentElement).forEach(el => el && el.classList.toggle('hidden'))
// }


// let link = document.createElement('link')
// link.href = './static/css/web-pground.css'
// link.onload = () => alert(99)
// link.rel = 'stylesheet'
// document.head.appendChild(link)
// document.head.insertAdjacentHTML('beforeend', '<link rel="stylesheet" id="link_css" href="./static/css/web-pground.css">')
// document.querySelector('#link_css').onload = (e) => (console.log(e), alert(e))


var __debug = true;

let v2 = [
    "common.d.ts", 
    "index.d.ts", 
    "jsx.d.ts", 
    "ls.txt", 
    "options.d.ts", 
    "plugin.d.ts", 
    "umd.d.ts", 
    "v3-component-options.d.ts", 
    "v3-component-props.d.ts", 
    "v3-component-public-instance.d.ts", 
    "v3-define-async-component.d.ts", 
    "v3-define-component.d.ts", 
    "v3-directive.d.ts", 
    "v3-generated.d.ts", 
    "v3-manual-apis.d.ts", 
    "v3-setup-context.d.ts", 
    "v3-setup-helpers.d.ts", 
    "vnode.d.ts", 
    "vue.d.ts",     
]

const additionalTypings = {
    vue: {
        2: [
            // './static/ts/vue2/types.d.ts',
            './static/ts/vue2/vue.d.ts'
        ]
        // .concat(v2.map(v => './static/ts/vue2/raw/' + v))
        ,
        3: [
            './static/ts/vue3/vue.min.d.ts',
            './static/ts/vue3/csstype.ts',
        ],
        clarifyframework(code) {
            const isES = !!~code.indexOf('import ');
            const ver = +Object.keys(this)[0] + +!!~code.indexOf('createApp')
            return isES
                ? this[ver]
                : this[ver].map(l => l.replace('.d.ts', 'iife.d.ts'))
        }
    }
}


// TODO check debounce?


//@ts-expect-error
const editors = IDE.initialize([], {
    // for ts editor:
    aliases: {
        vue: () => './static/ts/vue2/vue.d.ts',  // additionalTypings['vue'][additionalTypings['vue'].clarifyframework()][0]
    },
    // tabAttachSelector: '.tab:last-child',
    tabAttachSelector: '.tab:last-child',
    // additionalFiles: {
    //     'dd.js': 'export var r = 5;'
    // },
    // multitab: {
    //     selector: '.tab:last-child'
    // },

    /**
     * @param {{editor: {getValue: () => string, setValue: (s: string) => void}, mode: string, prevMode?: string}} event
     */
    onModeChange(event) {

        /**
        * @descriotion remove \r and first line with marker
        */
        const getPureCode = (/** @type {string} */ w) => w.split('\n').slice(1).join('\n').replace(/\r/g, '');


        if (1) {
            //@ts-ignore
            if (event.prevMode === 'less' && event.mode === 'scss') event.editor.setValue(procCompiler.compileToSass(event.editor.getValue()))            
            else if (event.prevMode === 'scss' && event.mode === 'less') {
                //@ts-ignore
                event.editor.setValue(procCompiler.compileToLess(event.editor.getValue()))
            }
            else if (event.prevMode === 'css' && event.mode == 'less') {

                const code = event.editor.getValue()

                // если в css были изменения, то less = css
                if (sessionStorage.getItem('__css') !== getPureCode(code)) event.editor.setValue(code);
                else {
                    // иначе возвращаем less
                    let scssCode = sessionStorage.getItem('__less')
                    event.editor.setValue(scssCode || code);
                }
            }
            else if (event.prevMode === 'css' && event.mode == 'scss') {

                const code = event.editor.getValue()

                if (sessionStorage.getItem('__css') !== getPureCode(code)) event.editor.setValue(code);
                else {

                    let scssCode = sessionStorage.getItem('__scss')
                    event.editor.setValue(scssCode || code);
                }

            }

            else if (event.prevMode === 'less' && event.mode == 'css') {

                let code = event.editor.getValue()

                if (getPureCode(code) === sessionStorage.getItem('__less')) {
                    // если в less не было изменений, то оставляем css
                    return;
                }

                sessionStorage.setItem('__less', getPureCode(code))

                let indent = (code.match(/\/\* less \*\/(\s*)/) || []).pop()

                /// possible options:
                // {"javascriptEnabled":false,"depends":false,"compress":false,"lint":false,"paths":[],"color":true,"strictImports":false,"insecure":false,"rootpath":"","rewriteUrls":false,"math":1,"strictUnits":false,"globalVars":null,"modifyVars":null,"urlArgs":"","isFileProtocol":false,"async":false,"fileAsync":false,"poll":1500,"env":"production","useFileCache":true,"onReady":true,"plugins":[],"logLevel":1,"loggers":[{ }],"mime":"text/css"}
                //@ts-ignore
                less.render(code, {}, function (e, result) {

                    let css = result.css
                        .replace('/* less */', '/* less */' + (indent || ' ').split('\n').slice(1).join('\n'))
                        .replace('}\n', '}\n\n')

                    event.editor.setValue(css)
                    sessionStorage.setItem('__css', getPureCode(css))
                })

            }
            else if (event.prevMode === 'scss' && event.mode == 'css') {
                
                convertSassToCss(event, getPureCode);
            }

        }

        // target.value = procCompiler[!select.selectedIndex ? 'compileToSass' : 'compileToLess'](source.value)
    },
    modes: [
        {
            html: null,
        },
        {
            css: null,
            less: {
                extension: '.less',

                // additional script to handling (uploading after target)

                // src: document.location.origin + '/static/js/preproc/less.min.js',
                src: document.location.origin + '/static/js/preproc/less/less.js',

                // where does the src scripts move:
                inside: true,                                                               // true|false = false (true - inside sandbox, else - to root)
                prehandling: (code) => code,                                                // inside === true ? null : (code: string) => string
                // mode: 'javascript',                                                         // ace editor mode

                // where does the source less code move:
                target: {                                                                   // as a rule, it makes sense only when inside = true
                    // inside: true,                                                        // 1|true    
                    external: true,                                                         // true|false = by default allways `true` if not paired tag specified (like `link`)
                    tag: 'link',                                                            // external ? ('script'|'link') : ('script'|'style'|'body')
                    attributes: ' rel="stylesheet/less" type="text/css" href="{ }" ',        // ` ${Object.extries([\w\/\{\}]).map([k,v] => k + '="' + v + '"').join(' '))} `
                }
            },
            scss: {
                extension: '.scss',
                src: document.location.origin + '/static/js/preproc/sass/sass.js',
                inside: true,                                                               // true|false = false (true - inside sandbox, else - to root)           
            }
        },
        Object.assign({
            javascript: null,
            'ES module': {
                tabs: true,
                mode: 'javascript',                                                         // ace editor mode
            },
        },
        {
            typescript: {

                // src: 'https://unpkg.com/typescript@latest/lib/typescriptServices.js',
                // src: 'https://cdnjs.cloudflare.com/ajax/libs/typescript/4.9.5/typescript.min.js',
                src: 'https://cdnjs.cloudflare.com/ajax/libs/typescript/4.6.4/typescript.min.js',
                // src: 'https://unpkg.com/typescript@4.9.5/lib/typescriptServices.js',
                target: 'self',     // TODO change to `root`|`top`|`parent`|undefined!
                tabs: true,
                extension: '.ts',
                /**
                 * 
                 * @param {{disable?: boolean, enable: boolean, editor: AceEditor, editors: EditorsEnv}} arg
                 */
                onModeChange({ disable, enable, editor, editors }) {                    

                    if (enable || (enable === false && disable === false)) {

                        const config = {
                            // selector: editor.container.id,
                            // content: editor.getValue(),
                            // position: editor.selection.getCursor(),

                            fileNavigator: Object.assign(editors.fileStorage, {
                                _active: 'app.ts'
                            }),
                            editor,
                            libFiles: [
                                "./static/js/preproc/typescript/4.9.5/lib.dom.d.ts",
                                "./static/js/preproc/typescript/4.9.5/lib.es5.d.ts",
                                "./static/js/preproc/typescript/4.9.5/lib.dom.iterable.d.ts",
                                "./static/js/preproc/typescript/4.9.5/es2015.core.d.ts",
                            ],
                            signatureToolTip: true,
                            autocompleteStart: 1
                        }                        

                        const tsEditorInitialize = () => {
                            //@ts-expect-error `AceEditor is uncompatible with AceAjax.Editor`
                            const [tsService, ace] = tsEditor.initialize(config);

                            ace.setOptions({
                                enableBasicAutocompletion: false,
                                // enableSnippets: true,
                                enableLiveAutocompletion: false,
                            });
                            //@ ts-expect-error `AceEditor is uncompatible with AceAjax.Editor`
                            editors[2] = ace;
                            this.runtimeService = tsService;

                            return { tsService, ace };
                        }                        

                        if (window['ts']) {

                            if (window['tsEditor']) tsEditorInitialize()    // && editor.clearSelection()
                            else {
                                
                                //TODO?? deny to add ts files before runtimeService will uploaded

                                let scr = document.createElement('script')
                                scr.src = './node_modules/ts-a-editor/build/ts-editor.js'   // scr.src = './static/js/ts-editor/ts-editor.js'
                                scr.onload = () => {

                                    let compileMode = document.getElementById('compiler_mode')['value'];
                                    if (additionalTypings[compileMode]) {
                                        
                                        // TODO inside clarifyframework:
                                        // TODO check root file instead of edittor:
                                        let value = editor.getValue();
                                        if (Array.isArray(additionalTypings[compileMode])) {                                            
                                            config.aliasedLibFiles = {
                                                [compileMode+ '.d.ts']: additionalTypings[compileMode][0]
                                            }
                                            config.libFiles = config.libFiles.concat(additionalTypings[compileMode].slice(1))
                                        }
                                        else {
                                            // if object
                                            // let libFiles = additionalTypings[compileMode].clarifyframework(value)
                                            // console.log(libFiles);

                                            const initialVersion = Object.keys(additionalTypings[compileMode])[0]
                                            let libFiles = additionalTypings[compileMode][+initialVersion + +!!~value.indexOf('createApp')];

                                            config.aliasedLibFiles = {
                                                ['' + compileMode + '.d.ts']: libFiles[0]
                                            }                                            
                                            config.libFiles = config.libFiles.concat(libFiles.slice(1));
                                        }                                         
                                    }

                                    const { tsService, ace } = tsEditorInitialize()
                                    window['tsService']= tsService

                                    /// if exists initial tabs:
                                    Object.entries(editors.fileStorage).forEach(([file, content]) => {

                                        if (file != 'app.ts' && file.split('.').pop() == 'ts') {
                                            tsService.loadContent(file, content + '', true); debugger
                                            //@ ts-expect-error
                                            ace.session.$worker.emit("addLibrary", { data: { name: file, content } });
                                        }
                                    })
                                    
                                }
                                document.head.appendChild(scr)
                            }

                        }
                        else {
                            
                            let tsServ = document.head.appendChild(document.createElement('script'))
                            tsServ.id = 'typescript';
                            tsServ.src = this.src
                            tsServ.onload = () => {
                                this.onModeChange({ enable, disable, editor, editors })
                            }

                            // stop load and drop
                            // console.warn('ts onModeChange awaiting');

                            // setTimeout(this.onModeChange.bind(this), 650, {enable, editor})
                        }
                    }
                    else if (window['tsEditor'] && disable) {
                        
                        //@ts-expect-error `AceEditor is uncompatible with AceAjax.Editor`
                        const ace = tsEditor.dropMode(editor)
                        ace.setOptions({
                            enableBasicAutocompletion: true,
                            enableSnippets: true,
                            enableLiveAutocompletion: true,
                        });
                        //@ ts-expect-error `find is uncompatible`
                        editors[2] = ace;
                    }
                    
                    console.log('enable', enable);
                    console.log('disable', disable);
                },
                prehandling: code => {
                    //@ts-ignore
                    if (window.ts) {
                        //@ts-ignore
                        let r = ts.transpile(code, { jsx: +sessionStorage.getItem('mode') % 2 });
                        return r;
                    }
                    else {
                        console.warn('Something went wrong: ts is undefind...');
                        return code;
                    }
                }
            },
        })
    ],
    onControlSave: function (event) {
        // alert(99)
    },
    onfilerename: function (prevName, name, rnCallback) {
        alert(99)
    },
    onfileRemove: function (name) {

    }
});





window.addEventListener('DOMContentLoaded', function (event) {
    // document.querySelector('.tabs').style.display = 'block'

    // setTimeout(function() {
    //     editors[2].session.$mode.$highlightRules.$keywordList.push("from ")
    // }, 1000)

    ['c', 'le', 'sc'].forEach(pref => sessionStorage.removeItem('__' + pref + 'ss'))
})





/**
 * @param {{ editor: any; mode?: string; prevMode?: string; }} event
 * @param {{ (w: string): string; (arg0: any): string; }} getPureCode
 */
function convertSassToCss(event, getPureCode) {
    let code = event.editor.getValue();

    if (getPureCode(code) === sessionStorage.getItem('__scss')) {
        // если в less не было изменений, то оставляем css
        // return;
    }

    sessionStorage.setItem('__scss', getPureCode(code));
    let indent = (code.match(/\/\* scss \*\/(\s*)/) || []).pop();
    //@ts-ignore
    let css = sassToCss(code)
        .replace('/* scss */', '/* scss */' + (indent || ' ').split('\n').slice(1).join('\n'))
        .replace('}\n', '}\n\n');
    event.editor.setValue(css);
    sessionStorage.setItem('__css', getPureCode(css));
}

