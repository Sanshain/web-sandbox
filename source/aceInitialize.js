// @ts-check

import { default as extend } from 'emmet';

import { debounce } from "./utils/utils";
import { expand } from './features/expantion';
import { defaultValues } from './features/compiler';



/**
 * @param {{require: (arg: string) => {(): any;new (): any;Range: any;};edit: (arg: any) => any;}} ace
 * @param {Function} webCompile
 * @param {string[]} modes
 * @param {string | number} syntax
 */
export default function initializeEditor(ace, webCompile, modes, syntax) {

    const Range = ace.require('ace/range').Range;
    const delay = 500;
    const autoPlay = debounce(() => setTimeout(webCompile, delay), delay);

    let editors = [].slice.call(document.querySelectorAll('.editor')).map((element, i, arr) =>
    {

        let editor = ace.edit(element.id);
        editor.setTheme("ace/theme/monokai");
        editor.session.setMode("ace/mode/" + modes[i]);
        
        let value = localStorage.getItem(syntax + '__' + modes[i]) || defaultValues[syntax][modes[i]];        
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
        
        
        (i < 2) && editor.textInput.getElement().addEventListener('input', autoPlay)

        editor.textInput.getElement().addEventListener('keydown', function (event)
        {

            // console.log(event);

            (event.ctrlKey && event.keyCode === 190) && (arr[i + 1] || arr[0]).querySelector('textarea').focus();
            (event.ctrlKey && event.key === 'ArrowUp') && expand({ currentTarget: document.querySelector('.expand')})            
            if ((event.ctrlKey && event.keyCode === 83) || event.key === 'F9')
            {
                event.preventDefault();                
                webCompile();
            }
        })

        if (i === 0 && window.outerWidth > 600) editor.commands.addCommand(
            {
                name: "extend",
                exec: function () {
                    let cursor = editor.getCursorPosition();
                    let row = cursor.row;
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
        });
        else {  //  if (i)

            editor.setOptions(
                {
                    enableBasicAutocompletion: true,
                    enableSnippets: true,
                    enableLiveAutocompletion: true,
                    // placeholder: "Enter your " + modes[i] + " Code",
                    // enableEmmet: true        
                }
            );
            // style
            if (i === +!!i) {

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
                    getCompletions: function (editor, session, pos, prefix, callback) {
                        let wordList = ["red", "green", "blue", 'gray', 'lightgray', 'lightblue', 'orange', 'white', 'black'];
                        wordList = wordList.concat(['div', 'input', 'select'])
                        // console.log(pos);                        
                        callback(null, wordList.map(
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

                editor.completers.push(colorsCompleter)
            }
            else {
                
                let domFuncs = {
                    style: '',
                    color: '',

                    // ReactDOM: {
                    //     desc: 'only for react lib namespace',
                    //     return: 'namespace'
                    // },
                    render: {
                        desc: 'render preact/react component to html DOM',
                        sign: {
                            'component': {
                                desc: 'react/preact component',
                                type: 'VNode<any>'
                            },
                            parent: {
                                desc: 'app root inside DOM tree',
                                type: 'HTMLElement'
                            }
                        },
                        return: 'HTMLElement'
                    },
                    

                    useRef: {
                        desc: 'get a reference to a DOM node inside a functional components',
                        sign: {
                            initialValue: {
                                desc: 'initial value'
                            }
                        },
                        'return': 'Ref<T>'
                    },
                    useState: {
                        desc: 'assigns the starting state value, and returns an array of two elements',
                        sign: {
                            initialState: {
                                type: '<T>(initialState: T | (() => T))',
                                desc: 'initial state'
                            }
                        },
                        'return': '[T, StateUpdater<T>]'
                    },
                    useEffect: {
                        desc: '',
                        sign: {
                            effect: {
                                type: 'EffectCallback',
                                desc: 'callback function'
                            },
                            inputs: {
                                type: 'Inputs?',
                                desc: ''
                            }
                        }
                    },
                    


                    querySelectorAll: '',
                    querySelector: {
                        desc: 'get element by selector',
                        sign: {
                            'selector': {
                                type: 'string',
                                desc: 'element selector'
                            }
                        },
                        'return': 'HTMLElement'
                    }
                }

                const domCompleter = {
                    getCompletions: function (editor, session, pos, prefix, callback) {
                        let wordList = Object.keys(domFuncs);
                        // prefix !== '.' ? [] :
                        callback(null, wordList.map(
                            function (word) {
                                return {
                                    caption: word,
                                    value: word,
                                    meta: "static"
                                };
                            }
                        ));
                    },
                    getDocTooltip: function (item) {
                        if (!item.docHTML) {                            
                            let hint = domFuncs[item.caption];
                            if (hint) {
                                let args = Object.keys(hint.sign || {}).map(item => item + ': ' + hint.sign[item].type).join(', ');
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

                editor.completers.push(domCompleter)
            }
        }
        
        
        return editor;

    });

    // initResizers()

    return editors;

}

