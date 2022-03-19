import { default as extend } from 'emmet';
import { webplay } from "./pageBuilder";
import { debounce } from "./utils/utils";


export default function initializeEditor(ace, modes) {

    const Range = ace.require('ace/range').Range;
    const delay = 500;
    const autoPlay = debounce(() => setTimeout(webplay, delay), delay);

    return [].slice.call(document.querySelectorAll('.editor')).map((element, i, arr) =>
    {

        let editor = ace.edit(element.id);
        editor.setTheme("ace/theme/monokai");
        editor.session.setMode("ace/mode/" + modes[i]);
        
        let value = localStorage.getItem(modes[i])        
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
            (event.ctrlKey && event.keyCode === 190) && (arr[i + 1] || arr[0]).querySelector('textarea').focus();            
            // console.log(event);
            if ((event.ctrlKey && event.keyCode === 83) || event.key === 'F9') {
                event.preventDefault();                
                webplay();
                // return false;
            }
        })

        if (i === 0) editor.commands.addCommand(
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
        else if (i) {
            editor.setOptions(
                {
                    enableBasicAutocompletion: true,
                    enableSnippets: true,
                    enableLiveAutocompletion: true,
                    // enableEmmet: true        
                }
            );
            // style
            if (i === +!!i) {

                editor.commands.on("afterExec", function (e) {
                    console.log(e.command.name);
                    if (e.command.name.toLowerCase() === 'return') {
                        webplay()
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

}

