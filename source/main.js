// @ts-check

import initializeEditor from "./aceInitialize";
import { createPage, webCompile, playgroundObject } from "./pageBuilder";

import { expand } from "./features/expantion";
import { initResizers } from "./features/resizing";
import { babelCompiler, compilers } from "./features/compiler";
import { commonStorage } from "./utils/utils";
import { fileAttach } from "./features/tabs";

import { ChoiceMenu } from "./ui/ChoiceMenu";
import { modes } from "./features/base.js";




/**
 * @param {string[]} values
 * @param {{onControlSave?: Function, tabAttachSelector?: string, modes?: [object?, object?, object?], onfilerename?: Function}?} options
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
    playgroundObject.onfilerename = options.onfilerename
    const frameworkEnvironment = Object.values(compilers)[syntaxMode];
    
    // @ts-ignore
    let compileFunc = syntaxMode ? webCompile.bind(null, jsxMode, frameworkEnvironment) : webCompile;

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
        console.log(options.modes);
        options.modes.forEach(function (/** @type { {[k: string]: {tabs?: true, src?: string, target? : object, ext?: string }} } */ mode, i) {

            let items = [];  // ['css','less','stylus']

            if (mode && (items = Object.keys(mode)).length > 1) {                            

                const settingsElement = editors[i].container.appendChild(document.createElement('choice-menu'));
                settingsElement.className = 'settings';
                settingsElement.addEventListener('selected_changed', (/** @type { CustomEvent } */ e) => {
                    console.log(e.detail);
                    console.log(mode);

                    /**
                     * @type {{src?: string, tabs?: true, mode?: 'html'|'css'|'javascript', ext?: string}}
                     */
                    const modeOptions = mode[e.detail.value];
                    // const link = options.modes[i][e.detail.value];
                    // console.log(link)


                
                
                    // MULTITABS MODE:
                
                    // if (mode[e.detail.value].tabs)
                    {
                        const multitabs = modeOptions && modeOptions.tabs;
                        var tabs = document.querySelector('.tabs');  //  + (multitabs ? '' : '.enabled')
                        if (tabs) {
                            if (multitabs && !tabs.classList.contains('enabled')) {
                                tabs.classList.add('enabled')
                            }
                            else if (!multitabs && tabs.classList.contains('enabled')) {
                                tabs.classList.remove('enabled')
                            }                                
                        }
                    }
                    
                    // upload to frame will in pageBuilder, here just is highlight change
                    editors[i].session.setMode("ace/mode/" + ((modeOptions && modeOptions.mode) || e.detail.value));




                    
                    // REPLACE TITLE MARK OF THE MODE (FLAG) IN BEGIN OF FILE:

                    //@ts-ignore
                    var Range = ace.require("ace/range").Range;

                    let markLine = editors[i].session.getLine(0);
                    const markValue = "/* " + e.detail.value + " */";

                    if (markLine.startsWith('/*')) {
                        editors[i].session.replace(new Range(0, 0, 0, markLine.length), markValue)
                    }
                    else {
                        editors[i].session.insert({ row: 0, column: 0 }, markValue + '\n\n')
                    }
                    

                    // RENAME FILES:

                    console.log('rename');
                    if (tabs && Object.keys(playgroundObject.fileStorage).length > 1 && !playgroundObject.fileStorage['app' + modeOptions.ext]) {

                        // rename tabs:

                        [].slice.call(tabs.querySelectorAll('.tab')).forEach((/** @type {HTMLElement} */ element) => {
                            if (modeOptions.ext && !element.innerText.endsWith(modeOptions.ext)) {                                
                                element.innerText = element.innerText.replace('.js', '.ts');
                            }
                            else if (!element.innerText.endsWith('.js')) {
                                element.innerText = element.innerText.replace('.ts', '.js');
                            }
                        });

                        // file name rename:

                        const extensions = modeOptions.ext ? ['.js', '.ts'] : ['.ts', '.js']

                        let storageFiles = Object.keys(playgroundObject.fileStorage).map(
                            k => ({ [k.replace(extensions[0], extensions[1])]: playgroundObject.fileStorage[k] })
                        );
                        playgroundObject.fileStorage = Object.assign({}, ...storageFiles)


                        // imports refactoring:

                        for (let file in playgroundObject.fileStorage) {
                            if (typeof playgroundObject.fileStorage[file] === 'string') {
                                playgroundObject.fileStorage[file] = playgroundObject.fileStorage[file].replace(extensions[0], extensions[1]);
                            }
                        }
                        
                        let pos = editors[2].find(extensions[0] + "'")
                        pos && editors[2].getSession().replace(pos, extensions[1] + "'")

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





    let [iframe, curUrl] = createPage(playgroundObject.curUrl, frameworkEnvironment, jsxMode ? babelCompiler.mode : undefined, editorOptions)

    playgroundObject.iframe = iframe;
    playgroundObject.curUrl = curUrl;


    document.querySelector('.play').addEventListener('click', () => webCompile(jsxMode, frameworkEnvironment));
    document.querySelector('.expand')['onclick'] = (/** @type {{ currentTarget: any; }} */ e) => expand(e, frameworkEnvironment, jsxMode ? babelCompiler.mode : undefined);
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