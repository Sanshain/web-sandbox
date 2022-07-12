// @ts-check

import initializeEditor from "./aceInitialize";
import { createPage, webCompile, playgroundObject } from "./pageBuilder";

import { expand } from "./features/expantion";
import { initResizers } from "./features/resizing";
import { babelCompiler, compilers } from "./features/compiler";
import { commonStorage } from "./utils/utils";
import { fileAttach } from "./features/tabs";

import { ChoiceMenu } from "./ui/ChoiceMenu";


const modes = [
    'html',
    'css',
    'javascript',
    // 'typescript',
]

/**
 * @param {string[]} values
 * @param {{onControlSave?: Function, tabAttachSelector?: string, modes?: object[]}?} options
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

    
    
    if (options.modes) {
        customElements.define('choice-menu', ChoiceMenu);
        options.modes.forEach(function (mode, i) {

            let items = [];  // ['css','less','stylus']

            if (mode && (items = Object.keys(mode)).length > 1) {
                
                const settingsElement = editors[i].container.appendChild(document.createElement('choice-menu'));
                settingsElement.className = 'settings';
                settingsElement.addEventListener('selected_changed', (/** @type { CustomEvent } */ e) => {
                    console.log(e.detail);

                    const link = modes[i][e.detail.value];
                    // upload to frame;
                })
                
                const list = settingsElement.appendChild(document.createElement('ul'));
                items.forEach((point, i) => {
                    let itemElement = list.appendChild(document.createElement('li'));
                    itemElement.innerText = point;
                    if (!i) settingsElement.selectedElement = itemElement;
                })

            }
        })
    }



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


    
    options.tabAttachSelector && document.querySelector(options.tabAttachSelector).addEventListener('click', function (e) {
        e['editors'] = editors;
        fileAttach(e);
    });


    return editors;
}


// export const {editors}