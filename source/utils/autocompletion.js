// https://stackoverflow.com/questions/58377763/how-do-i-programmatically-add-a-snippet-in-ace-editor
// https://prog.world/implementing-code-completion-in-ace-editor/

//@ts-check

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