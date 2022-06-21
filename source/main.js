// @ts-check

import initializeEditor from "./aceInitialize";
import { createPage, webCompile, playgroundObject } from "./pageBuilder";

import { expand } from "./features/expantion";
import { initResizers } from "./features/resizing";
import { babelCompiler, compilers } from "./features/compiler";
import { options } from 'preact';
import { commonStorage } from "./utils/utils";


const modes = [
    'html',
    'css',
    'javascript',
    // 'typescript',
]

/**
 * @param {string[]} values
 * @param {{onControlSave?: Function}?} options
 * @returns {any[]}
 */
export function initialize(values, options) {

    options = options || {};
    
    let syntaxMode = Number.parseInt((commonStorage || localStorage).getItem('mode') || '0');
    //@ts-ignore
    document.getElementById('compiler_mode').selectedIndex = syntaxMode;

    const jsxMode = !!(syntaxMode % 2);

    if (jsxMode) {
        document.getElementById('jseditor').classList.add('dis_errors');
    }

    const compilerMode = Object.values(compilers)[syntaxMode];
    // @ts-ignore
    let compileFunc = syntaxMode ? webCompile.bind(null, jsxMode, compilerMode) : webCompile;

    initResizers()

    // let compileFunc = mode ? webCompile.bind(null, mode > 1, mode) : webCompile;
    // console.log(mode);
    // console.log(Object.values(compilers)[mode]);

    const editorOptions = {
        compileFunc,
        controlSave: options.onControlSave,
        storage: commonStorage
    }
    // @ts-ignore
    let editors = playgroundObject.editors = initializeEditor(ace, editorOptions, modes, syntaxMode, values)

    let [iframe, curUrl] = createPage(playgroundObject.curUrl, compilerMode, jsxMode ? babelCompiler.mode : undefined, editorOptions)

    playgroundObject.iframe = iframe;
    playgroundObject.curUrl = curUrl;


    document.querySelector('.play').addEventListener('click', compileFunc);
    document.querySelector('.expand')['onclick'] = (/** @type {{ currentTarget: any; }} */ e) => expand(e, compilerMode, jsxMode ? babelCompiler.mode : undefined);
    document.getElementById('compiler_mode').addEventListener('change', function (event) {

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
    });

    return editors;
}


// export const {editors}