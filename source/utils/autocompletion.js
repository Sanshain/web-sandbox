// https://stackoverflow.com/questions/58377763/how-do-i-programmatically-add-a-snippet-in-ace-editor
// https://prog.world/implementing-code-completion-in-ace-editor/

//@ts-check



export let domFuncs = {
    style: null,
    color: null,

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



    // Array and string methods: 

    indexOf: '',
    // from: '',  // - interferes with import * form
    slice: '',


    // snippets:

    qf: {
        desc: '',
        value: '[].slice.call(document.querySelector(${1:selector})).forEach((${2:elem}) => {\n\t${3}\n})'
    },
    qm: {
        desc: '',
        value: '[].slice.call(document.querySelector(${1:selector})).map(elem => {\n\t${2}\n})'
    },

    // qff: {
    //     desc: '',
    //     value: '[].slice.call(document.querySelector(${1:selector}).filter(elem => elem.${2:innerText} == ${3}).forEach(elem => {\n\t${4}\n})'
    // },
    // qfm: {
    //     desc: '',
    //     value: '[].slice.call(document.querySelector(${1:selector}).filter(elem => elem.${2}).map(elem => {\n\t${3}\n})'
    // },

    fore: {
        desc: 'forEach',
        origin: 'forEach',
        value: 'forEach((${1:elem}, ${2:i}, ${3:array}) => {\n\t${4}\n})',
        sign: {
            callback: { type: ' (elem, i, array) => void', desc: 'функция обратного вызова' },
            context: { type: ' this?', desc: 'контекст' }
        }
    },
    log: {
        desc: 'console.log',
        value: 'console.log(${1})',
        sign: {
            message: {
                type: 'string',
            }
        }
    },


    // DOM:

    target: null,
    classList: null,
    offsetHeight: null,
    offsetWidth: null,
    getComputedStyle: '',

    innerHTML: null,
    innerText: null,

    appendChild: '',
    insertBefore: '',
    createElement: '',

    preventDefault: '',                                         //// - event
    key: '',                                                    //// - event

    closest: '',
    
    getElementById: {
        desc: '',  //  'Найти элемент по его ID',
        'return': 'HTMLElement?'
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
    },

    // Events: 

    addEventListener: {
        desc: '',
        sign: {
            'selector': {
                type: 'string',
                desc: 'element selector'
            }
        },
    },

    onload: '',
    onclick: '',
    oninput: '',
    onkeydown: '',
    onchange: '',

    onmousedown: '',
    onmousemove: '',
    onmouseover: '',
    onmouseout: '',
}


let wordList = Object.keys(domFuncs);

export let keyWords = wordList.map(
    function (word) {
        const metaInfo = domFuncs[word];
        return {
            caption: word,
            value: word + (undefined ? '()' : ''),  // для методов без параметров (таких-то и не могу даже вспомнить)
            // meta: "local",
            // meta: "static",

            // snippet: 'This2(${1})',

            // (metaInfo && metaInfo.sign) - только для описанных сигнатурой
            snippet: metaInfo !== null ? (metaInfo.value || (word.startsWith('on') ? (word + ' = e => {${1}}') : ((metaInfo.value || word) + '(${1})'))) : undefined,

            type: (metaInfo && metaInfo.sign) ? "snippet" : 'static',
            meta: (metaInfo !== null && !word.startsWith('on')) ? (metaInfo.value ? 'function' : 'function') : 'prop',

            // completer: {
            //     insertMatch: function (editor, data) {
            //         editor.completer.insertMatch({ value: data.value })
            //     }
            // }

            // inputParameters: { 1: '?' },
        };
    }
)



/**
 * @param {{
 *  completers: { 
 *      getCompletions: (editor: any, session: any, pos: any, prefix: any, callback: any) => void;
 *      getDocTooltip: (item: {docHTML: string;caption: string;}) => void;
 *   }[];
 * }} editor : ace editor instanse
 * @param {{ hint?: {desc: string, origin?: string, sign: {[x: string]: {type: string, description: string}}}; name: string; template?: string; meta?: 'function'|'property'; }} keyWordInfo
 */
export function autocompleteExpand(editor, keyWordInfo) {

    let hint = keyWordInfo.hint;
    
    editor.completers.push({
        getCompletions: function (editor, session, pos, prefix, callback) {
            // prefix !== '.' ? [] :
            callback(null, [{
                caption: keyWordInfo.name,
                value: keyWordInfo.name,
                snippet: keyWordInfo.template,
                meta: keyWordInfo.meta || '',
            }]);
        },
        getDocTooltip: function (/** @type {{ docHTML: string; caption: string; }} */ item) {
            
            if (hint) {
                let args = Object.keys(hint.sign || {}).map(arg => arg + ': ' + hint.sign[arg].type).join(', ');
                item.docHTML = '<h5>' + (hint.origin || item.caption) + '(' + args + ') : ' + hint['return'] + '</h5><hr>' + '<p>' + hint.desc + '</p>'
                let argsDesc = ''
                for (const key in hint.sign) {
                    argsDesc += '<li><b>' + key + ':' + (hint.sign[key].type || 'any') + '</b> - ' + hint.sign[key].description
                }
                item.docHTML += '<ul>' + argsDesc + '</ul>'
            }
        }
    })
}













//! не используется !//



// динамическое добавление сниппетов:


// var ace = window['ace'];

// export const registerSnippets = function (editor, session, mode, snippetText) {
//     editor.setOptions({
//         enableBasicAutocompletion: true,
//         enableSnippets: true,
//     })

//     var snippetManager = ace.require('ace/snippets').snippetManager

//     var id = session.$mode.$id || ''
//     var m = snippetManager.files[id]

//     m.scope = mode
//     m.snippetText = snippetText
//     m.snippet = snippetManager.parseSnippetFile(snippetText, m.scope)

//     snippetManager.register(m.snippet, m.scope)
// }

// export const createSnippets = snippets =>
//     (Array.isArray(snippets) ? snippets : [snippets])
//         .map(({ name, code }) =>
//             [
//                 'snippet ' + name,
//                 code
//                     .split('\n')
//                     .map(c => '\t' + c)
//                     .join('\n'),
//             ].join('\n')
//         )
//         .join('\n')