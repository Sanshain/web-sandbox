// @ts-check

import initializeEditor from "./aceInitialize";
import { createPage, webCompile, playgroundObject } from "./pageBuilder";

import { expand } from "./features/expantion";
import { initResizers } from "./features/resizing";
import { babelCompiler, compilers } from "./features/compiler";
import { commonStorage } from "./utils/utils";
import { fileAttach } from "./features/tabs";

import { ChoiceMenu } from "./ui/ChoiceMenu";
import { modes } from "./features/base";




/**
 * @param {string[]} values
 * @param {{onControlSave?: Function, tabAttachSelector?: string, modes?: [object?, object?, object?]}?} options
 * @returns {any[]}
 */
export function initialize(values, options) {

    options = options || {};
    
    let syntaxMode = Number.parseInt((commonStorage || localStorage).getItem('mode') || '0');
    //@ts-ignore
    document.getElementById('compiler_mode').selectedIndex = syntaxMode;

    // js mode:
    const jsxMode = !!(syntaxMode % 2);
    if (jsxMode) {
        document.getElementById('jseditor').classList.add('dis_errors');
    }

    playgroundObject.modes = options.modes;
    const compilerModes = Object.values(compilers)[syntaxMode];
    
    // @ts-ignore
    let compileFunc = syntaxMode ? webCompile.bind(null, jsxMode, compilerModes) : webCompile;

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

                    // const link = options.modes[i][e.detail.value];
                    // console.log(link)

                    // upload to frame will in pageBuilder, here just is highlight change
                    editors[i].session.setMode("ace/mode/" + e.detail.value);

                    //@ts-ignore
                    var Range = ace.require("ace/range").Range;
                    
                    let markLine = editors[i].session.getLine(0);
                    const markValue = "/* " + e.detail.value + " */";

                    if (markLine.startsWith('/*')) {
                        editors[i].session.replace(new Range(0, 0, 0, markLine.length), markValue)
                    }
                    else {
                        editors[i].session.insert({ row: 0, column: 0 }, markValue + '\n')
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





    let [iframe, curUrl] = createPage(playgroundObject.curUrl, compilerModes, jsxMode ? babelCompiler.mode : undefined, editorOptions)

    playgroundObject.iframe = iframe;
    playgroundObject.curUrl = curUrl;


    document.querySelector('.play').addEventListener('click', () => webCompile(jsxMode, compilerModes));
    document.querySelector('.expand')['onclick'] = (/** @type {{ currentTarget: any; }} */ e) => expand(e, compilerModes, jsxMode ? babelCompiler.mode : undefined);
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