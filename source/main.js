// @ts-check

import initializeEditor from "./aceInitialize";
import { createPage, webCompile, playgroundObject } from "./pageBuilder";

import { expand } from "./features/expantion";
import { initResizers } from "./features/resizing";
import { babelCompiler, compilers, defaultValues, versionController } from "./features/compiler";
import { commonStorage } from "./utils/utils";
import { fileAttach } from "./features/tabs";

import { ChoiceMenu } from "./ui/ChoiceMenu";
import { modes } from "./features/base.js";


// import { dropMode, initialize as tsInitialize } from "ts-a-editor";


/**
 * @typedef {import("typescript").LanguageServiceHost} LanguageServiceHost
 * @typedef {import("typescript").CompilerOptions} CompilerOptions
 */

// tsInitialize({

// })


import "./features/consoleDebug";


/**
 * @typedef {import("./ui/ChoiceMenu").ChoiceDetails} ChoiceDetails
 */

/**
 * @type { Array<keyof compilers>}
 */
const frameworkEnvironment = []

/**
 * @type {string[]?}
 */
let cachedEnvironment = null;

/**
 * @description Do full environment cleaning and filling from scratch
 * @param {string[]} environment - environment - list of external (or internal) scripts or another resources to load content
 * @param {keyof compilers} envName - framework environment name
 * @param {string} [entryPoint=''] - code
 */
function updateEnvironment(environment, envName, entryPoint) {

    const isJSX = Object.keys(compilers).indexOf(envName) % 2

    environment.splice(0, environment.length);

    if (versionController[envName] && !entryPoint && cachedEnvironment) {
        
        cachedEnvironment.forEach(link => environment.push(link));
        return environment;
    }
    else if (versionController[envName] && entryPoint) {
        
        let entries = Object.entries(versionController[envName])
        
        /**
         * @type {[string, [string]]?}
         */
        let ver = entries.find(([k, v]) => ~entryPoint.indexOf(k))
        if (ver && ver.length && ver[1].length) {
            // version x.x.x            
            let verNum = ver[1][0].match(/\d+\.\d+\.\d+/);
            if (verNum) {
                console.log(envName, 'version: ', verNum.pop())
            }

            (cachedEnvironment = ver[1].concat(isJSX ? [babelCompiler.link] : [])).forEach(link => environment.push(link));
            return environment;
        }
    }
    

    const libs = compilers[envName] || [];
    
    libs.forEach((/** @type {string} */ lib) => {

        environment.push(lib);
    });
    
    
    // window['__DEBUG'] && console.log(environment);
    
    return environment;
}


window.addEventListener('message', function (event) {
    
    console.log(event.data);
    
    // let value = event.data.value;
    let consoleJar = document.querySelector('.console .lines');
    if (consoleJar) {
        let line = consoleJar.appendChild(document.createElement('div'));        
        // line.innerText = event.data.value;
        let snipElem = line.appendChild(document.createElement('div'));
        snipElem.textContent = '> ' + typeof event.data.value === 'object'
            ? (~event.data.value.toString().indexOf('HTML')
                ? event.data.value
                : JSON.stringify(event.data.value))
            : event.data.value;

        if (event.data.error) {
            snipElem.style.color = 'red';
            // resultElem.style.fontFamily = "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif";
            snipElem.style.fontFamily = "monospace";
        }

        consoleJar.scrollTo(0, consoleJar.scrollHeight);

        // event.target.focus()
    }

    // let line = window.parent.document.querySelector('.console .lines').appendChild(document.createElement('div'));
    // line.innerText = typeof value === 'object' ? JSON.stringify(value) : value;
})


/**
 * 
 * @typedef {{
 *  [k: string]: {
 *      extension?: `.${string}`,
 *      src?: string | string[],
 *      inside?: boolean,
 *      prehandling?: (code: string) => string,
 *      mode?: string,
 *      tabs?: boolean,
 *      runtimeService?: {
 *           loadPackages(libFiles?: string[]): LanguageServiceHost,                                                         // to load Vue etc
 *           loadContent(filename: string, content: string, keepExistContent: true): void,                                   // load entry point content on tab creation
 *           changeSelectFileName(filename: string): void;                                                                   // change select file on tab switching
 *           getFileContent(name: string): string,
 *           getSelectFileName(): string,
 *           removeFile: (fileName: string) => void;                                                                         // remove file from host on remove tab
 *           getLoadedFilenames: () => string[];
 *           hasFile: (fileName: any) => boolean;
 *           updateFile: (fileName: string, content: string) => void;                                                        // update file content for type checking on tab switching (when works - its autoupdates)
 *           setCompilationSettings: (settings: CompilerOptions) => void;
 *           getCompilationSettings: () => CompilerOptions;
 *           _$editFile: (fileName: string, minChar: number, limChar: number, newText: string) => void;
 *      },
 *      onModeChange?: (arg: {enable: boolean, disable?: boolean, editor: AceEditor, editors?: ReturnType<initializeEditor>}) => void,
 *      target?:{
 *          external?: boolean,
 *          tag?: 'link'|'script'|'style'|'body',
 *          attributes?: string
 *      } 
 *  } 
 * }} LangMode
 * 
 * @typedef { 0 | 1 | 2 | 3 } SyntaxMode - keyof (Object.keys(compilers) | ['vanile', 'preact', 'vue', 'react'])
 * @typedef {import("./aceInitialize").AceEditor} AceEditor
 * 
 * @param {[string, string, string, Storage|object?]} values
 * @param {{
 *      onControlSave?: Function,                                                           // on ctrl+save callback
 *      tabAttachSelector?: string,                                                         // selector for tab attach (tabs must be decorated in DOM outside the package)
 *      modes?: [LangMode?, LangMode?, LangMode?],                                          // list of modes sets
 *      onModeChange?: (a: {editor: AceEditor, mode: string, prevMode?: string}) => void,   // on chenge mode (for example less => scss)
 *      onfilerename?: Function,                                                            // on file reneme event
 *      onfileRemove?: (s: string) => void,                                                 // on file remove event
 *      additionalFiles?: Storage|object,                                                   // ? implemented?
 *      quickCompileMode?: boolean,                                                         // ? not implemented - the quick mode compilation via onmessages iver sandbox communication
 *      syntaxMode?: SyntaxMode,                                                            // index of initial selected  framawork 
 *      frameworkJug?: string,                                                              // html selector for input element w actual framework
 *      clarifyframework?: (code: string, fwmode: number | SyntaxMode) => SyntaxMode        // ? identifier rfamework on depend of source code
 * }?} options
 * @returns {ReturnType<initializeEditor>} {unknown[]}
 */
export function initialize(values, options) {

    options = options || {};
    
    /**
     * @type {number} - 0 | 1 | 2 | 3 - its mean vanile|preact|vue|react
     */
    let frameworkID = options.syntaxMode != undefined ? options.syntaxMode : Number.parseInt((commonStorage || localStorage).getItem('mode') || '0');
    playgroundObject.frameworkID = frameworkID = (options.clarifyframework && values) ? options.clarifyframework(values[2], frameworkID) : frameworkID;
    console.log(frameworkID, 'syntaxMode');

    //@ts-ignore
    document.getElementById('compiler_mode').selectedIndex = frameworkID;

    // js mode:
    const jsxMode = !!(frameworkID % 2);
    if (jsxMode) {
        // document.getElementById('jseditor').classList.add('dis_errors');
    }

    playgroundObject.modes = options.modes;
    playgroundObject.onfilerename = options.onfilerename
    playgroundObject.onfileRemove = options.onfileRemove
    
    updateEnvironment(frameworkEnvironment,
        //@ts-expect-error
        Object.keys(compilers)[frameworkID],
        values[2] || commonStorage.getItem(frameworkID + '__' + modes[2]) 
    )

    // Object.values(compilers)[syntaxMode].forEach(link => frameworkEnvironment.push(link));
    const updateEnv = updateEnvironment.bind(null, frameworkEnvironment);
    
    // @ts-ignore
    let compileFunc = frameworkID ? webCompile.bind(null, jsxMode) : webCompile;

    initResizers()

    // let compileFunc = mode ? webCompile.bind(null, mode > 1, mode) : webCompile;
    // console.log(mode);
    // console.log(Object.values(compilers)[mode]);

    /**
     * @_type // TODO
     */
    const editorOptions = {
        compileFunc,
        frameworkEnvironment,
        quickCompileMode: options.quickCompileMode,
        controlSave: options.onControlSave,
        storage: commonStorage,
        frameworkID,
        updateEnv
    }

    if (options.additionalFiles) {
        //@ts-ignore
        values = values || [];
        values[3] = options.additionalFiles
    }

    // @ts-ignore
    let editors = playgroundObject.editors = initializeEditor(ace, editorOptions, values)

    

    /**
     * Choice arg settings:
     */


    
    if (options.modes) {
        !customElements.get('choice-menu') && customElements.define('choice-menu', ChoiceMenu);
        console.log(options.modes);
        
        options.modes.forEach(function (/** @type {LangMode} */mode, /** @type {number} */ i) {  

            let items = [];  // ['css','less','stylus']

            if (mode && (items = Object.keys(mode)).length > 1) {

                /**
                 * @type {ChoiceMenu}
                */
                //@ts-expect-error
                const settingsElement = editors[i].container.appendChild(document.createElement('choice-menu'));
                settingsElement.className = 'settings';

                //@ts-expect-error
                settingsElement.addEventListener('selected_changed', (/** @type { CustomEvent<ChoiceDetails> } */ ev) => {

                    /**
                     * @_type {{src?: string, tabs?: true, mode?: 'html'|'css'|'javascript', extension?: string}}
                     * @type {LangMode[string]}
                     */
                    const modeOptions = mode[ev.detail.value] || {
                        extension: '.js',
                        // mode: 'javascript'
                    };
                    // const link = options.modes[i][e.detail.value];
                    
                    console.log(ev.detail.value);

                    options.onModeChange && options.onModeChange({ mode: ev.detail.value, prevMode: ev.detail.previousValue, editor: editors[i] })
                    if (options.modes[i]) {
                        
                        let langmode = options.modes[i][ev.detail.value] || options.modes[i][ev.detail.previousValue]

                        if (langmode && langmode.onModeChange) {

                            let currentMode = (modeOptions.mode || '').split('/').pop() || modes[i];
                        
                            langmode.onModeChange({
                                disable: currentMode === ev.detail.value,
                                enable: currentMode === ev.detail.previousValue,
                                editor: editors[i],
                                editors: editors
                            })
                        }
                    }

                    if (!(options.modes[i] && options.modes[i][ev.detail.value] && options.modes[i][ev.detail.value].onModeChange)) {
                        
                        // upload to frame will in pageBuilder, here just is highlight change
                        (i === 1) && editors[i].session.setMode("ace/mode/" + ((modeOptions && modeOptions.mode) || ev.detail.value));
                                                
                        if (i === 2) {
                            const mode = playgroundObject.frameworkID % 2 ? 'jsx' : ((modeOptions && modeOptions.mode) || ev.detail.value)
                            
                            Object.values(editors[i].session.getMarkers(true)).forEach(m => editors[i].session.removeMarker(+m.id))

                            editors[i].session.setMode("ace/mode/" + mode)
                            // debugger
                            // editors[i].session.setMode("ace/mode/" + ((modeOptions && modeOptions.mode) || ev.detail.value))
                        }                        
                    }

                            
                    // MULTITABS MODE:
                
                    if (i && i - 1)
                    {
                        const multitabs = modeOptions && modeOptions.tabs;
                        var tabs = document.querySelector('.tabs');  //  + (multitabs ? '' : '.enabled')                        
                        if (tabs) {
                            //@ts-ignore
                            tabs.style.transition = null;
                            if (multitabs) {
                                if (!tabs.classList.contains('enabled')) {
                                    // enable tab:
                                    tabs.classList.add('enabled')
                                }
                                else {
                                    // switch to first tab:
                                    //@ts-ignore
                                    tabs.children[0] && tabs.children[0].click()
                                }
                            }
                            else if (!multitabs && tabs.classList.contains('enabled')) {
                                tabs.classList.remove('enabled')
                            }                                
                        }
                    }

                    
                    // REPLACE TITLE MARK OF THE MODE (FLAG) IN BEGIN OF FILE:

                    //@ts-ignore
                    var Range = ace.require("ace/range").Range;

                    let markLine = editors[i].session.getLine(0);
                    const markValue = "/* " + ev.detail.value + " */";

                    if (markLine.startsWith('/*')) {
                        editors[i].session.replace(new Range(0, 0, 0, markLine.length), markValue)
                    }
                    else {
                        editors[i].session.insert({ row: 0, column: 0 }, markValue + '\n\n')
                    }
                    
                    editors[i].clearSelection()
                    

                    // RENAME FILES:

                    console.log('rename');
                    
                    if (tabs) {

                        // const modeExt = (modeOptions || { ext: '.js' }).extension; // TODO may be fix error on modeOptions = undefined

                        if (Object.keys(playgroundObject.fileStorage).length > 1) {
                            
                            if (!playgroundObject.fileStorage['app' + modeOptions.extension]) {

                                // rename tabs:

                                const jsPattern = /([\w_\d]+)\.js(x)?$/m;
                                const tsPattern = /([\w_\d]+)\.ts(x)?$/m;
                                
                                [].slice.call(tabs.querySelectorAll('.tab')).forEach((/** @type {HTMLElement} */ element) => {
                                    if (modeOptions.extension) {
                                        if (!element.innerText.endsWith(modeOptions.extension)) {
                                            element.innerText = element.innerText.replace(jsPattern, '$1.ts$2');
                                        }
                                    }
                                    else if (!element.innerText.endsWith('.js')) {
                                        element.innerText = element.innerText.replace(tsPattern, '$1.js$2');
                                    }
                                });

                                // file name rename:

                                /**
                                 * @type {[RegExp, string]}
                                 */
                                const extensions = modeOptions.extension ? [jsPattern, '$1.ts$2'] : [tsPattern, '$1.js$2']

                                let storageFiles = Object.keys(playgroundObject.fileStorage).map(
                                    k => ({ [k.replace(extensions[0], extensions[1])]: playgroundObject.fileStorage[k] })
                                );
                                playgroundObject.fileStorage = Object.assign({}, ...storageFiles)

                                // imports refactoring:

                                for (let file in playgroundObject.fileStorage) {
                                    if (typeof playgroundObject.fileStorage[file] === 'string') {
                                        // debugger;
                                        playgroundObject.fileStorage[file] = playgroundObject.fileStorage[file].replace(extensions[0], extensions[1]);
                                    }
                                }

                                let cursor = editors[2].selection.getCursor()
                                editors[2].session.setValue(
                                    editors[2].session.getValue().replace(
                                        new RegExp(extensions[0].toString().slice(1, -2).replace('$', '([\'"])$'), 'm'),
                                        extensions[1] + '$3'
                                    )
                                )
                                editors[2].moveCursorTo(cursor.row, cursor.column)

                                // let pos = editors[2].find(new RegExp(extensions[0].toString().slice(1, -2).replace('$', '([\'"])$'), 'm'))
                                /// replace value idoes not applying as regex value (with groups $1, $2 etc)
                                // pos && editors[2].getSession().replace(pos, extensions[1])
                            }

                        }
                        
                        if (modeOptions.extension) {
                            const firstTab = tabs.children[0];
                            //@ts-ignore
                            if (!~firstTab.innerText.indexOf(modeOptions.extension, firstTab.innerText.length - modeOptions.extension.length)) {
                                //@ts-ignore
                                firstTab.innerText = firstTab.innerText.split('.').shift() + modeOptions.extension
                            }
                        }

                    }                    
                })

                // const value = editors[i].getValue()
                const markLine = editors[i].session.getLine(0);
                
                const list = settingsElement.appendChild(document.createElement('ul'));
                items.forEach((point, j) => {
                    let itemElement = list.appendChild(document.createElement('li'));
                    itemElement.innerText = point;
                    
                    let mark = markLine.match(new RegExp('/\\\* (' + point + ') \\\*/'));
                    
                    if (!j) settingsElement.selectedElement = itemElement;
                    else if (mark) {
                        // mark[1]
                        settingsElement.selectedElement = itemElement;
                        settingsElement.dispatchEvent(new CustomEvent('selected_changed', {
                            detail: {
                                // id: itemElement.id,
                                value: point
                            }
                        }))
                    }                    
                })

            }
        })
    }


    /**
     * terminal button:
     */
    let terminal = editors[2].container.appendChild(document.createElement('div'));
    terminal.className = 'terminal'
    terminal.onclick = () => {
        
        const logContainer = document.querySelector('.console');
        const play = document.querySelector('.play');
        const save = document.querySelector('.save');

        // don`t work for mobile chrome (for some reason):        
        // logContainer.parentElement.style.zIndex = 6 + '';


        //@ts-ignore
        if (logContainer && !logContainer.classList.toggle('hidden'))
        {
            let input = logContainer.querySelector('input');
            input.focus()
        }

        play.classList.toggle('hidden');
        save && save.classList.toggle('hidden');
    }



    let [iframe, curUrl] = createPage(playgroundObject.curUrl, frameworkEnvironment, jsxMode ? babelCompiler.mode : undefined)  // editorOptions

    //@ts-expect-error
    playgroundObject.iframe = iframe;
    playgroundObject.curUrl = curUrl;


    document.querySelector('.play').addEventListener('click', () => {
        const frameworkEnvironment = editorOptions.updateEnv(Object.keys(compilers)[frameworkID], editors[2].getValue());
        webCompile(jsxMode, frameworkEnvironment)
    });
    document.querySelector('.expand')['onclick'] = (/** @type {{ currentTarget: any; }} */ e) => expand(e, frameworkEnvironment, jsxMode ? babelCompiler.mode : undefined);
    document.getElementById('compiler_mode').onchange = function (event) {

        // @ts-ignore
        (editorOptions.storage || localStorage).setItem('mode', event.target.selectedIndex)

        // @ts-ignore
        if (event.target.selectedIndex || true) location.reload()
        else {
            for (let i = 0; i < editors.length; i++) {
                //@ts-ignore
                let value = (editorOptions.storage || localStorage).getItem(event.target.selectedIndex + '__' + modes[i]) || '';
                editors[i].session.setValue(value)  
            }
            // document.querySelector('.play').click();
        }

        // localStorage.setItem('mode', event.target.selectedOptions[event.target.selectedIndex].value)
        // console.log(event.target.selectedIndex);
    };
    
    
    options.tabAttachSelector && document.querySelector(options.tabAttachSelector).addEventListener('click', function (e) {
        e['editors'] = editors;
        fileAttach(e);
    });

    editors.playgroundObject = playgroundObject;
    editors.updateEnv = updateEnv;

    return editors;
}


// export const {editors}