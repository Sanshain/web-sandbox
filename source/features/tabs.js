//@ts-check

import { playgroundObject } from "../pageBuilder";
import { autocompleteExpand, keyWords } from "../utils/autocompletion";
import { getExtension, getSelectedModeName } from "../utils/utils";
import { createEditorFile } from "./fs/editor";
import * as fs from "./fs/store";


/**
 * @param {string} activeTabName
 */
function generateImportSnippets(activeTabName) {
    let snippets = {
        name: "import { * } from './" + activeTabName + "'",
        template: "import { ${1} } from './" + activeTabName + "'"
    }
    return snippets;
}



const menuPoints = {
    'Удалить': (/** @type {{ target: HTMLDivElement }} */ e) => {
        if (confirm('Вы уверены, что хотите удалить файл `' + e.target.innerText + '`'))
        {
            let filename = e.target.innerText;

            playgroundObject.onfileRemove(filename);
            delete playgroundObject.fileStorage[filename];
            e.target.parentElement.removeChild(e.target);


            let langModes = playgroundObject.modes[2];
            let selMode = getSelectedModeName(2)
            if (langModes[selMode] && langModes[selMode].runtimeService) {
                // langModes[selMode].runtimeService.removeScript(filename)

                langModes[selMode].runtimeService.removeFile(filename)
                playgroundObject.editors[2].getSession().$worker.emit("removeLibrary", { data: { name: filename }});
            }
        }
    }
}


// var fileStore = { _active: 0 };

/**
 * attach new file
 * @param {{ file?: string; target: any; editors?: object[] }} event
 */
export function fileAttach(event) {

    let fileStore = playgroundObject.fileStorage;

    /// Проверяем имя файла на валидность:

    /** @type {import("../aceInitialize").EditorsEnv} */
    const editors = event['editors'] || window['editors'];
    const filename = event.file || prompt('Enter file name:');

    if (!filename) return;    

    const ext = (fileStore['app.ts'] || editors[2].session.getLine(0).match(/typescript/)) ? '.ts' : '.js';
    
    /** @type {string} */
    let activeTabName = ~filename.indexOf('.') ? filename : (filename + ext);

    if (!event.file && ~Object.keys(fileStore).indexOf(activeTabName)) {
        alert('Файл с таким именем уже существует');
        return;
    }

    const target = event.target;


    //! Настройка переключения между табами:

    const origTab = target.parentElement.querySelector('.tab.active') || target.parentElement.children[0];
    
    /**
     * Rename existing file
     * @param {MouseEvent} ev 
     * @returns 
     */
    origTab.ondblclick = function (/** @type {{ target: { innerText: string; }; }} */ ev) {        

        if (!playgroundObject.onfilerename) {
            console.warn('Specify onfilerename callback argument to activate the feature!');
            return;
        }

        const prevName = ev.target.innerText;
        if (prevName.match(/app\.\ws/)) {
            return;
        }

        const fileInfo = prevName.split('.')
        let filename = prompt('Enter new file name:', fileInfo[0])
        if (filename === fileInfo[0]) return;

        ({ activeTabName, fileStore } = renameTab({filename, fileInfo, prevName, ev, activeTabName}));
    }

    /**
     * Toggle among active tabs
     * @param {MouseEvent} ev
     * @returns
     */
    origTab.onclick = origTab.onclick || function toggleTab(/** @type {{ target: HTMLElement }} */ ev) {

        ({ activeTabName, fileStore } = switchTab(ev, activeTabName));
    }



    /// создание нового таба:

    /** @type {HTMLElement & {oncontextmenu: any}} */

    const newTab = createNewTab(origTab, activeTabName);

    if (playgroundObject.onfileRemove) newTab.oncontextmenu = onContextMenu;

    if (!event.file) {
        
        fs.createAndSaveFile(newTab, origTab);                                          // create new

        autocompleteExpand(editors[2], generateImportSnippets(activeTabName))           // editors[2].setValue(fileStore[newTab.innerText]);
    }

    target.parentElement.insertBefore(newTab, target);
    editors[2].focus();

    if (!event.file) {
        createEditorFile(fileStore, activeTabName);
    }

}



/**
 * @param {{ cloneNode: () => HTMLDivElement; onclick: any; ondblclick: any; }} origTab
 * @param {string} activeTabName
 * @returns {HTMLElement & {oncontextmenu: any}}
 */
function createNewTab(origTab, activeTabName) {
    let newTab = origTab.cloneNode();
    newTab.innerText = activeTabName;

    let prevTab = document.querySelector('.tab.active');
    prevTab && prevTab.classList.toggle('active');
    newTab.classList.add('active');

    newTab.style.marginRight = '1.25em';
    newTab.onclick = origTab.onclick;
    newTab.ondblclick = origTab.ondblclick;
    return newTab;
}



function renameTab({filename, fileInfo, prevName, ev, activeTabName}) {

    let {editors, fileStorage: fileStore} = playgroundObject;        

    if (!filename) {
        alert('Имя файла должно содержать буквы (хотя бы одну)');
    }
    else {
        let fullname = [filename, fileInfo[1]].join('.');

        if (!playgroundObject.onfilerename) {
            renameOccurrences(prevName, fullname);
            ev.target.innerText = fullname;
        }
        else {
            playgroundObject.onfilerename(ev.target.innerText, fullname, () => {
                ev.target.innerText = fullname;
                renameOccurrences(prevName, fullname);
            });
        }

        activeTabName = fullname;

        /**
         *
         * @param {string} prevName
         * @param {string} fullname
         */
        function renameOccurrences(prevName, fullname) {
            fileStore = playgroundObject.fileStorage;
            fileStore[fullname] = fileStore[prevName];
            delete fileStore[prevName];

            for (let file in playgroundObject.fileStorage) {
                if (typeof playgroundObject.fileStorage[file] === 'string') {
                    debugger
                    playgroundObject.fileStorage[file] = playgroundObject.fileStorage[file].replace(prevName, fullname);
                }
            }

            let pos = editors[2].find(prevName + "'");
            pos && editors[2].getSession().replace(pos, fullname + "'");
        }

    }
    return { activeTabName, fileStore };
}




/**
 * toggle tabs
 * @param {{ target: HTMLElement; }} ev
 * @param {string} activeTabName
 */
function switchTab(ev, activeTabName) {

    var fileStore = playgroundObject.fileStorage;
    const editors = playgroundObject.editors;

    let prevTab = document.querySelector('.tab.active');
    if (prevTab) {

        fileStore = playgroundObject.fileStorage; // т.к. при смене языка мы можем переопределить playgroundObject.fileStorage = Object.assign... ? window.fileStore - ?

        const prevTabName = prevTab['innerText'];

        prevTab.classList.toggle('active');

        fileStore[prevTabName] = editors[2].getValue();

        const exports = fileStore[prevTabName].match(/export (function|const|let|class) (\w+)/g) || [];
        const defaultExport = fileStore[prevTabName].match(/export default function (\w+)/);

        // atocomplete update:
        exports.forEach((/** @type {string} */ ex) => {
            let exprWords = ex.split(' ');
            let caption = exprWords.pop();
            let meta = exprWords.pop();
            keyWords.push({
                caption,
                value: caption,
                meta,
                type: '',
                snippet: undefined // meta == 'function' ? (caption + '(${1})') : undefined
            });
        });


        // extension changing:
        // if (importSnippet.template.endsWith(".ts") && !fileStore['app.ts']) {
        //     // autocomplete refactoring:                
        //     importSnippet.name = importSnippet.template = importSnippet.template.replace(prevTabName + '"', title + '"');
        // }
        // let actualExt = prevTabName.split('.').pop();
        // if (!title.endsWith(actualExt)) {
        //     // autocomplete refactoring:
        //     importSnippet.name = importSnippet.template = importSnippet.template.replace(title + "'",prevTabName + "'");
        //     // code refactoring:
        //     // let importFilename = importSnippet.template.split('from ').pop()
        //     // console.log('importFilename', importFilename);
        //     fileStore['app.' + actualExt] = fileStore['app.' + actualExt].replace(title + "'", prevTabName + "'");
        //     //@ts-ignore
        //     title = prevTabName;
        // }
        // let newComplete = exports.map((/** @type {string} */ exp) => exp.split(' ').pop()).join(', ');
        // importSnippet.name = importSnippet.template = importSnippet.template.replace(
        //     new RegExp('(\\\{ \\\$\\\{1\\\} \\\})|(\\\{ [\\\w\\\d_, ]* \\\})'), '{ ' + newComplete + ' }'
        // );
        // console.log('{ ' + newComplete + ' }');
        // console.log(importSnippet.template);
        // if (defaultExport) {
        //     // editors[2].session.$mode.$highlightRules.$keywordList.unshift("import " + defaultExport.pop() + " from './" + newTab.innerText + "'");
        //     keyWords.push({
        //         caption: defaultExport[1],
        //         value: defaultExport[1],
        //         meta: 'function',
        //         type: '',
        //         snippet: undefined,  // (defaultExport[1] + '({$1})')
        //     })
        // }
    }

    ev.target.classList.add('active');

    activeTabName = ev.target.innerText;
    editors[2].session.setValue(fileStore[ev.target.innerText]);
    fileStore._active = ev.target.innerText;


    // now update tsserv
    let langModes = playgroundObject.modes[2];
    let selMode = getSelectedModeName(2);
    if (langModes[selMode] && langModes[selMode].runtimeService) {

        const content = fileStore[activeTabName]; // editors[2].getValue();



        // langModes[selMode].runtimeService.addScript(title, content)
        // langModes[selMode].runtimeService.loadContent(title, content, true)
        langModes[selMode].runtimeService.updateFile(activeTabName, content);
        // playgroundObject.editors[2].getSession().$worker.emit("addLibrary", { data: { name: title, content } });
        playgroundObject.editors[2].getSession().$worker.emit("updateModule", { data: { name: activeTabName, content } });
        langModes[selMode].runtimeService.changeSelectFileName(activeTabName);
    }


    globalThis.__debug && console.log('toggle tab...');

    // console.log(fileStore[ev.target.innerText].split('\n').length);
    editors[2].gotoLine(fileStore[ev.target.innerText].split('\n').length - 1);
    editors[2].focus();
    return { fileStore, activeTabName };
}







/**
 * @description menu to remove some tab
 * @param {{ target?: { innerText: string | number; parentElement: { removeChild: (arg0: any) => void; }; }; clientX: string; clientY: number; }} e
 */
function onContextMenu(e) {
    
    /** @type {HTMLDivElement} */
    let contextMenu = document.querySelector('.context_menu');

    if (contextMenu) contextMenu.classList.remove('hidden');
    else {
        contextMenu = document.body.appendChild(document.createElement('div'));
        contextMenu.className = 'context_menu';
        contextMenu.tabIndex = 0;
        Object.keys(menuPoints).forEach(key => {
            let point = contextMenu.appendChild(document.createElement('div'));
            point.innerText = key;
            point.addEventListener('click', () => {

                contextMenu.classList.toggle('hidden');
                setTimeout(() => {
                    menuPoints[key] && menuPoints[key](e);
                });
            });
        });
        contextMenu.onblur = function () {
            contextMenu.classList.add('hidden');
        };
    }

    // console.log(e);

    contextMenu.style.left = e.clientX + 'px';
    contextMenu.style.top = e.clientY + 5 + 'px';
    contextMenu.focus();

    return false;
}

