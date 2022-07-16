//@ts-check

import { playgroundObject } from "../pageBuilder";
import { autocompleteExpand, keyWords } from "../utils/autocompletion";


// var fileStore = { _active: 0 };

/**
 * @param {{ file?: string; target: any; }} event
 */
export function fileAttach(event) {

    var fileStore = playgroundObject.fileStorage;

    //! Проверяем имя файла на валидность:

    var editors = event['editors'] || window['editors'];
    var filename = event.file || prompt('Enter file name:');

    if (!filename) return;

    let title = ~filename.indexOf('.') ? filename : (filename + '.js');

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

    let origTab = target.parentElement.children[0];
    origTab.onclick = origTab.onclick || function toggleTab (/** @type {{ target: { classList: { add: (arg0: string) => void; }; innerText: string | number; }; }} */ ev) {
        let prevTab = document.querySelector('.tab.active');
        if (prevTab) {

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

            let newComplete = exports.map((/** @type {string} */ exp) => exp.split(' ').pop()).join(', ');
            importSnippet.template = importSnippet.template.replace(
                new RegExp('(\\\{ \\\$\\\{1\\\} \\\})|(\\\{ [[\w\d_, ]*] \\\})'), '{ ' + newComplete + ' }'
            );

            console.log('{ ' + newComplete + ' }');
            console.log(importSnippet.template);

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

        console.log('toggle tab...');    

        console.log(fileStore[ev.target.innerText].split('\n').length);
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

    if (!event.file) {
        fileStore[origTab.innerText] = editors[2].getValue();
        fileStore[newTab.innerText] = '';                   // create new
        editors[2].setValue(fileStore[newTab.innerText]);

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

    //@ts-ignore
    const snippetManager = ace.require('ace/snippets').snippetManager;    
    snippetManager.insertSnippet(editors[2], "export function ${1:funcName} (${2:args}){\n\t${3}\n}");
    
}
