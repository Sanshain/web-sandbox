// @ts-check

import { default as extend } from 'emmet';

import { debounce } from "./utils/utils";
import { expand } from './features/expantion';
import { defaultValues } from './features/compiler';
import { domFuncs, keyWords } from './utils/autocompletion';
import { playgroundObject } from './pageBuilder';



/**
 * 
 * TODO: options {
 *  + fileStore
 * }
 * 
 * @param {{require: (arg: string) => {(): any;new (): any;Range: any;};edit: (arg: any) => any;}} ace
 * @param {{ compileFunc: Function; controlSave?: (ev: object, compileFunc: Function) => void; storage?: Storage, modes?: object[]}} editorOptions
 * @param {string[]} modes
 * @param {string | number} syntax
 * @param {?[string?, string?, string?]} [values]
 */
export default function initializeEditor(ace, editorOptions, modes, syntax, values) {

    const webCompile = editorOptions.compileFunc;

    const Range = ace.require('ace/range').Range;
    const delay = 500;
    const autoPlay = debounce(() => setTimeout(webCompile, delay), delay);
    const fontSize = '.9em';

    values = values || [];


    let cssKeyWords = ["red", "green", "blue", 'gray', 'lightgray', 'lightblue', 'orange', 'white', 'black', 'none'];
    // cssKeyWords = cssKeyWords.concat(['div', 'input', 'select'])


    let editors = [].slice.call(document.querySelectorAll('.editor')).map((/** @type {{ id: any; }} */ element, /** @type {number} */ i, /** @type {any[]} */ arr) =>
    {

        let editor = ace.edit(element.id);        
        editor.setTheme("ace/theme/monokai");
        editor.session.setMode("ace/mode/" + modes[i]);
        
        let value = values[i] || (editorOptions.storage || localStorage).getItem(syntax + '__' + modes[i]) || defaultValues[syntax][modes[i]];
        if (value) {
            editor.session.setValue(value)
        }

        const allCommands = editor.commands.byName;


        // editor.commands.bindKey("F9", null);
                
        editor.commands.removeCommand(allCommands.removeline)        
        // allCommands.removeline.bindKey = { win: "Ctrl-X", mac: "Cmd-X" }
        // editor.commands.addCommand(allCommands.removeline)
        // // editor.commands.addCommand(allCommands.cut_or_delete)

        allCommands.copylinesdown.bindKey = { win: "Ctrl-D", mac: "Cmd-D" }
        editor.commands.addCommand(allCommands.copylinesdown);
        
        
        (i < 2) && editor.textInput.getElement().addEventListener('input', autoPlay);

        editor.textInput.getElement().addEventListener('keydown', function (/** @type {{ ctrlKey: any; keyCode: number; key: string; preventDefault: () => void; }} */ event)
        {

            // console.log(event);

            (event.ctrlKey && event.keyCode === 190) && (arr[i + 1] || arr[0]).querySelector('textarea').focus();
            (event.ctrlKey && event.key === 'ArrowUp') && expand({ currentTarget: document.querySelector('.expand')})            
            if ( event.key === 'F9')      // ctrl+s
            {
                event.preventDefault(), webCompile();
            }
            else if (event.ctrlKey && event.keyCode === 83) {
                
                console.log(editorOptions);
                // event.preventDefault(), (editorOptions.controlSave || webCompile)();

                event.preventDefault(), (editorOptions.controlSave ? editorOptions.controlSave(event, webCompile) : webCompile());
            }
        })

        if (i === 0 && window.outerWidth > 600) {

            
            editor.setOptions(
                {
                    enableBasicAutocompletion: true,
                    enableSnippets: true,
                    enableLiveAutocompletion: true,
                    fontSize,
                    // placeholder: "Enter your " + modes[i] + " Code",
                    // enableEmmet: true,   //                       don't work   
                }
            );

            editor.completers = editor.completers.slice();


            const cursorText = editor.container.querySelector('textarea')
            cursorText.addEventListener('keydown', function tabHandler(/** @type {{ key: string; }} */ e) {                
                if (e.key === 'Tab'){
                    if (editor.completer) {
                        editor.completer.keyboardHandler.removeCommand(editor.completer.keyboardHandler.commands.Tab);
                        cursorText.removeEventListener('keydown', tabHandler)
                        console.log('removing tab hot key from autocomplete popup');
                    }
                }
            })

            editor.commands.addCommand(  // [ indent,
                
                {
                    name: "extend",
                    exec: function () {
                        let cursor = editor.getCursorPosition();
                        let row = cursor.row;

                        // editor.completer && editor.completer.keyboardHandler.removeCommand(editor.completer.keyboardHandler.commands.Tab)

                        if (cursor.column == editor.session.getLine(row).length) {
                            
                            let line = editor.session.getLine(row);
                            
                            let startChar = Math.max(line.lastIndexOf(' ') + 1, 0);
                            let endChar = cursor.column;
                            let range = new Range(row, startChar, row, endChar);

                            let textRange = line.slice(startChar, endChar);
                            let code = extend(textRange)
                            // let text = editor.session.getValue();
                            editor.session.replace(range, code)

                            editor.moveCursorTo(row, !(textRange.startsWith('.') || textRange.startsWith('#'))
                                ? startChar + code.length - textRange.length - 3
                                : startChar + code.length - 6
                            )

                            return;
                        }
                        editor.indent();
                    },
                    bindKey: { win: 'Tab' }
                }, //  expandSnippet ]
                    
                
            );

        }
        else {  //  if (i)

            editor.setOptions(
                {
                    enableBasicAutocompletion: true,
                    enableSnippets: true,
                    enableLiveAutocompletion: true,
                    fontSize,
                    // maxSize: Infinity
                    
                    // placeholder: "Enter your " + modes[i] + " Code",
                    // enableEmmet: true        
                }
            );

            // html (on width < 600)
            if (!i) {
                editor.completers = editor.completers.slice();
                editor.completers.push({
                    getCompletions: function htmlCompleter (editor, session, pos, prefix, callback) {                        
                        callback(null,
                            ['fill'].concat(cssKeyWords)
                                .map(w => {
                                    // editors[i].session.$mode.$highlightRules.$keywordList.push(w);
                                    return {
                                        caption: w,
                                        value: w,
                                        // snippet: '<' + w + '>',
                                        meta: "attribute"
                                    }
                                })
                                .concat(['svg', 'select', 'option'].map(w => {
                                    return {
                                        caption: '<' + w + '>',
                                        value: w,
                                        snippet: '<' + w + '>${1}</' + w + '>',
                                        meta: "tag"
                                    }
                                })).concat(['input'].map(w => {
                                    return {
                                        caption: '<' + w + '>',
                                        value: w,
                                        snippet: '<' + w + '/>',
                                        meta: "tag"
                                    }
                                }))
                        )
                    }
                })                
            }
            // style
            else if (i === +!!i) {

                editor.commands.on("afterExec", function (e) {
                    console.log(e.command.name);
                    if (e.command.name.toLowerCase() === 'return') {
                        webCompile()
                    }
                    // if (e.command.name == "insertstring" && /^[\w.]$/.test(e.args)) {
                    //     editor.execCommand("startAutocomplete")
                    // }
                })

                const colorsCompleter = {                    
                    getCompletions: function cssCompleter (editor, session, pos, prefix, callback) {
                        // console.log(pos);                        
                        callback(null, cssKeyWords.concat(['div', 'input', 'select']).map(
                            function (word) {
                                return {
                                    caption: word,
                                    value: word,
                                    meta: "static"
                                };
                            }
                        ));
                    },
                    // getDocTooltip: function (item) {
                    //     if (item.type == "snippet" && !item.docHTML) {
                    //         item.docHTML = [
                    //             "<b>", lang.escapeHTML(item.caption), "</b>", "<hr></hr>",
                    //             lang.escapeHTML(item.snippet)
                    //         ].join("");
                    //     }
                    // }
                };

                editor.completers = editor.completers.slice();
                editor.completers.push(colorsCompleter)
            }
            // javascript:
            else if(i === 2) {
            

                const domCompleter = {
                    getCompletions: function jsCompleter (editor, session, pos, prefix, callback) {                        
                        // prefix !== '.' ? [] :
                        console.log(pos);
                        // editors[2].session.getLine(2).slice(0, 9).match(/([\w\d]+)\.\w+$/m)[1]
                        // get object for autocompletion

                        // let token = editor.session.getTokenAt(pos.row, pos.column)
                        // if (token.type == 'string') {
                        //     console.log('string token');
                        // }
                        
                        callback(null, keyWords);
                    },
                    getDocTooltip: function (/** @type {{ docHTML: string; caption: string; }} */ item) {
                        // item['type'] === 'snippet'
                        if (!item.docHTML || (item['meta'] === 'function' && domFuncs[item.caption] && domFuncs[item.caption].sign)) {
                            let hint = domFuncs[item.caption];
                            if (hint) {
                                let args = Object.keys(hint.sign || {}).map(item => item + ': ' + hint.sign[item].type).join(', ');
                                // item.docHTML = '<h5>' + (hint.value || item.caption) + '(' + args + ') : ' + hint['return'] + '</h5><hr>'
                                item.docHTML = '<h5>' + item.caption + '(' + args + ') : ' + hint['return'] + '</h5><hr>'
                                item.docHTML += '<p>' + hint.desc + '</p>'
                                let argsDesc = ''
                                for (const key in hint.sign) {
                                    argsDesc += '<li><b>' + key + ':' + (hint.sign[key].type || 'any') + '</b> - ' + hint.sign[key].desc
                                }
                                item.docHTML += '<ul>' + argsDesc + '</ul>'
                                // item.docHTML += '<h6>return ' + hint['return'] + '</h6>'
                            }
                            console.log(item);
                        }
                    }
                };

                // editor.completers = editor.completers.slice();
                editor.completers.push(domCompleter);

                editor.commands.addCommand(
                    {
                        name: "rename",
                        exec: function () {
                            var position = editor.getCursorPosition();
                            var token = editor.session.getTokenAt(position.row, position.column);
                            if (token.type == "identifier") {
                                let newValue = prompt('', token.value)
                                if (newValue !== token.value) {
                                    if (newValue && newValue.match(/^[\w_][\w_\d]*$/m)) {
                                        let range = null;
                                        let options = {
                                            // backwards: true,
                                            wrap: true,
                                            // caseSensitive: true,
                                            // range: null,
                                            wholeWord: true,
                                            // regExp: false
                                        }
                                        let threshold = editor.findAll(token.value);
                                        if (threshold) {
                                            const pattern = 'import \\\{[\w\d_\\\. ,]*' + token.value + '[\w\d_\\\. ,]*\\\} from [\'"]\\\./([\\\w\\\d_\\\.]+)';
                                            editor.find(new RegExp(pattern), { regExp: true })
                                            const match = editor.getSelectedText().match(pattern)
                                            if (match) {
                                                let storeName = match[1];
                                                let module = playgroundObject.fileStorage[storeName];
                                                if (!module) alert('Связанный модуль ' + storeName + ' не найден')
                                                else {
                                                    let replacePattern = '(^' + token.value + ')|( ' + token.value + ')|(' + token.value + ' )';
                                                    console.log(replacePattern);
                                                    playgroundObject.fileStorage[storeName] = module.replace(new RegExp(replacePattern, 'm'), function(substring, args) {
                                                        console.log(arguments);
                                                        return substring.replace(token.value, newValue);
                                                    })
                                                }
                                            }
                                        }
                                        while ((range = editor.find(token.value, options)) && threshold--) {
                                            console.log('replace...');
                                            editor.session.replace(range, newValue);                                            
                                        }
                                    }
                                    else if(newValue !== null) {
                                        alert('Введите корректное имя для идентификатора');
                                    }
                                }
                            }
                        },
                        bindKey: { win: 'F2' }
                        // insted of expand/collapse
                    }
                )

                // move to definition: 
                editor.container.addEventListener('click', function (/** @type {{ ctrlKey: boolean; }} */ e) {
                    
                    var position = editor.getCursorPosition();
                    var token = editor.session.getTokenAt(position.row, position.column);
                    if (e.ctrlKey && token.type == "identifier") {
                        
                        console.log(token);
                        let code = editor.session.getValue();

                        const pattern = new RegExp('(var|let|const|function|class|import \{ ?) ?' + token.value)
                        const match = editor.session.getValue().match(pattern);

                        if (match) {
                            
                            let linesCount = code.slice(0, match.index).split('\n').length - 1;
                            if (linesCount === position.row) {
                                // нашел себя же (ту же строку)
                                // => ищем дальше (//TODO//)
                            }
                            else {
                                let line = editor.session.getLine(2);
                                if (line.startsWith('import')) {
                                    let r = line.match(new RegExp("from ['\"]\\\./([\\\w\\\d_\\\.]+)'"))
                                    if (r) {
                                        let filename = r[1];
                                        // find inside filename: 
                                        let module = playgroundObject.fileStorage[filename];
                                        if (!module) {
                                            editor.removeSelectionMarkers(editor.session.$selectionMarkers);
                                            alert('Отсутвует модуль ' + filename)
                                            return;
                                        }
                                        let submatch = module.match(pattern);
                                        if (submatch) {
                                            // переключаемся на эту вкладку
                                            // let tabIndex = Object.keys(playgroundObject.fileStorage).indexOf(filename)
                                            const tabs = document.querySelector('.tabs').children;
                                            let activeTab = [].slice.call(tabs).filter(f => f.innerText == filename).pop()
                                            //@ts-ignore
                                            activeTab.click()

                                            console.log(submatch);
                                            // переходим к определению
                                            linesCount = module.slice(0, match.index).split('\n').length - 1;
                                            editor.moveCursorTo(linesCount, 8 + submatch[1].length);
                                        }
                                    }
                                }
                                else {
                                    editor.moveCursorTo(linesCount, 0)
                                }                                
                            }
                        }
                        editor.removeSelectionMarkers(editor.session.$selectionMarkers)
                    }
                })

            }
        }                
        
        return editor;

    });

    
    // read modules:

    //@ts-ignore
    let fileStorage = editors.fileStorage = window.fileStorage = window['fileStore'] || {};
    // fileStorage
    let modulesStorage = (editorOptions.storage || localStorage).getItem('_modules');
    if (modulesStorage) {

        // create tabs:

        let _modules = JSON.parse(modulesStorage);
        let fileCreate = document.querySelector('.tabs .tab:last-child');

        let i = 0;

        if (fileCreate) {
            for (const key in _modules) {
                if (Object.hasOwnProperty.call(_modules, key)) {
                    fileStorage[key] = _modules[key];                    
                    
                    if (i++) {
                        console.log(fileCreate);
                        //@ts-ignore
                        fileCreate.click({ target: fileCreate, file: key });
                    }
                    else {                        
                        editors[2].setValue(_modules[key]);                                     // set editor value
                        // clear selection
                        editors[2].session.selection.setRange(new Range(0, 0, 0, 0))
                    }
                }
            }

            let activeTab = document.querySelector('.tabs .tab.active');
            activeTab && activeTab.classList.toggle('active');

            document.querySelector('.tabs .tab').classList.add('active');
        }
    }      


    // initResizers()

    return editors;

}

