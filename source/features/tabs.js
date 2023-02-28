//@ts-check

import { playgroundObject } from "../pageBuilder";
import { autocompleteExpand, keyWords } from "../utils/autocompletion";



const menuPoints = {
    'Удалить': (e) => {
        if (confirm('Вы уверены, что хотите удалить файл `' + e.target.innerText + '`'))
        {
            playgroundObject.onfileRemove(e.target.innerText + '');
            delete playgroundObject.fileStorage[e.target.innerText];
            e.target.parentElement.removeChild(e.target);
        }
    }
}



// var fileStore = { _active: 0 };

/**
 * @param {{ file?: string; target: any; editors?: object[] }} event
 */
export function fileAttach(event) {

    var fileStore = playgroundObject.fileStorage;

    //! Проверяем имя файла на валидность:

    var editors = event['editors'] || window['editors'];
    var filename = event.file || prompt('Enter file name:');

    if (!filename) return;

    // console.log('__fileAttach');

    let ext = (fileStore['app.ts'] || editors[2].session.getLine(0).match(/typescript/)) ? '.ts' : '.js';
    let title = ~filename.indexOf('.') ? filename : (filename + ext);

    if (!event.file && ~Object.keys(fileStore).indexOf(title)) {
        alert('Файл с таким именем уже существует');
        return;
    }


    let importSnippet = {
        name: "import { * } from './" + title + "'",
        template: "import { ${1} } from './" + title + "'"
    }



    let target = event.target;

    //! Настройка переключения между табами:

    let origTab = target.parentElement.querySelector('.tab.active') || target.parentElement.children[0];
    
    /**
     * Rename existing file
     * @param {MouseEvent} e 
     * @returns 
     */
    origTab.ondblclick = function (/** @type {{ target: { innerText: string; }; }} */ e) {        

        if (!playgroundObject.onfilerename) {
            console.warn('Specify onfilerename callback argument to activate the feature!');
            return;
        }

        const prevName = e.target.innerText;
        if (prevName.match(/app\.\ws/)) {
            return;
        }

        let fileInfo = prevName.split('.')
        let filename = prompt('Enter new file name:', fileInfo[0])
        if (filename === fileInfo[0]) return;
        else if (!filename) {
            alert('Имя файла должно содержать буквы (хотя бы одну)')
            return;
        }
        else {
            let fullname = [filename, fileInfo[1]].join('.')



            if (!playgroundObject.onfilerename) {
                renameOccurrences(prevName, fullname);
                e.target.innerText = fullname;
            }
            else {
                playgroundObject.onfilerename(e.target.innerText, fullname, () => {
                    e.target.innerText = fullname;
                    renameOccurrences(prevName, fullname)
                });
            }
            
            
            /**
             * 
             * @param {string} prevName 
             * @param {string} fullname 
             */
            function renameOccurrences (prevName, fullname) {
                fileStore = playgroundObject.fileStorage
                fileStore[fullname] = fileStore[prevName];
                delete fileStore[prevName];

                for (let file in playgroundObject.fileStorage) {
                    if (typeof playgroundObject.fileStorage[file] === 'string') {
                        playgroundObject.fileStorage[file] = playgroundObject.fileStorage[file].replace(prevName, fullname);
                    }
                }

                let pos = editors[2].find(prevName + "'")
                pos && editors[2].getSession().replace(pos, fullname + "'")
            }

        }
    }

    /**
     * Toggle among active tabs
     * @param {MouseEvent} ev
     * @returns
     */
    origTab.onclick = origTab.onclick || function toggleTab (/** @type {{ target: { classList: { add: (arg0: string) => void; }; innerText: string | number; }; }} */ ev) {
        let prevTab = document.querySelector('.tab.active');
        if (prevTab) {

            fileStore = playgroundObject.fileStorage;  // т.к. при смене языка мы можем переопределить playgroundObject.fileStorage = Object.assign...

            const prevTabName = prevTab['innerText'];

            prevTab.classList.toggle('active');

            fileStore[prevTabName] = editors[2].getValue();
            
            const exports = fileStore[prevTabName].match(/export (function|const|let|class) (\w+)/g) || [];
            const defaultExport = fileStore[prevTabName].match(/export default function (\w+)/);
            
            // atocomplete update:

            exports.forEach((/** @type {string} */ ex) => {
                let exprWords = ex.split(' ');
                let caption = exprWords.pop();
                let meta = exprWords.pop()
                keyWords.push({
                    caption,
                    value: caption,
                    meta,
                    type: '',
                    snippet: undefined // meta == 'function' ? (caption + '(${1})') : undefined
                })
            })


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

        editors[2].setValue(fileStore[ev.target.innerText]);
        fileStore._active = ev.target.innerText;

        globalThis.__debug && console.log('toggle tab...');    

        // console.log(fileStore[ev.target.innerText].split('\n').length);
        editors[2].gotoLine(fileStore[ev.target.innerText].split('\n').length - 1)
        editors[2].focus();        
    }



    // создание нового таба:

    let newTab = origTab.cloneNode();
    newTab.innerText = title;

    let prevTab = document.querySelector('.tab.active');
    prevTab && prevTab.classList.toggle('active');
    newTab.classList.add('active');

    newTab.style.marginRight = '1.25em';
    newTab.onclick = origTab.onclick;
    newTab.ondblclick = origTab.ondblclick;

    if (playgroundObject.onfileRemove) {
        newTab.oncontextmenu = (/** @type {{ target: { innerText: string | number; parentElement: { removeChild: (arg0: any) => void; }; }; clientX: string; clientY: number; }} */ e) => {

            let contextMenu = document.querySelector('.context_menu');
            if (contextMenu) contextMenu.classList.remove('hidden')
            else {
                contextMenu = document.body.appendChild(document.createElement('div'));
                contextMenu.className = 'context_menu';
                //@ts-ignore
                contextMenu.tabIndex = 0;
                Object.keys(menuPoints).forEach(key => {
                    let point = contextMenu.appendChild(document.createElement('div'))
                    point.innerText = key;
                    point.addEventListener('click', () => {

                        contextMenu.classList.toggle('hidden');
                        setTimeout(() => {
                            menuPoints[key] && menuPoints[key](e)                                                        
                        })
                    })
                })
                //@ts-ignore
                contextMenu.onblur = function() {
                    contextMenu.classList.add('hidden');
                }
            }

            console.log(e);


            //@ts-ignore
            contextMenu.style.left = e.clientX + 'px';
            //@ts-ignore
            contextMenu.style.top = e.clientY + 5 + 'px';
            //@ts-ignore
            contextMenu.focus()

            return false;
        }
    }


    if (!event.file) {
        
        console.log('fileAttach: editor setValue');
        fileStore[origTab.innerText] = editors[2].getValue();
        fileStore[newTab.innerText] = '';                   // create new
        // editors[2].setValue(fileStore[newTab.innerText]);

        // добавление нового ключевого слова:
        // editors[2].session.$mode.$highlightRules.$keywordList.push("from './" + newTab.innerText + "'");
        // editors[2].session.$mode.$highlightRules.$keywordList.push("import {*} from './" + newTab.innerText + "'");


        // let moduleName = newTab.innerText.split('.')[0];
        // moduleName = parseInt(moduleName) ? ('_' + moduleName) : moduleName;
        // editors[2].session.$mode.$highlightRules.$keywordList.push("import * as " + moduleName + " from './" + newTab.innerText + "'");

        autocompleteExpand(editors[2], importSnippet)
    }

    target.parentElement.insertBefore(newTab, target);
    editors[2].focus();

    if (!event.file) {
        editors[2].setValue('');
        //@ts-ignore
        const snippetManager = ace.require('ace/snippets').snippetManager;
        snippetManager.insertSnippet(editors[2], "export function ${1:funcName} (${2:args}){\n\t${3}\n}");
    }
    
    if (!event.file) fileStore._active = title;

}
