// @ts-check

import { default as extend } from "emmet"

import { debounce, getExtension, getSelectedModeName, loadScripts, typeFromExtention } from "./utils/utils"
import { expand } from "./features/expantion"
import { compilersSet, defaultValues as initialValues, singleFileEnv, playgroundObject, compilerNames, singleFileTypes } from "./features/compiler"
import { domFuncs, keyWords } from "./utils/autocompletion"
import { webCompile } from "./pageBuilder"
import { modes } from "./features/base"
import { globalStore, saveFile } from "./features/fs/store"
import { fileAttach } from "./features/tabs"
import { cssKeyWords } from "./features/fs/editor"

/**
 * setup ace editor: hangs events and configures compilers
 * @typedef {0 | 1 | 2 | 3} FrameworkID - keyof Object.keys(compilers)
 * @typedef {ReturnType<initializeEditor>} EditorsEnv
 *
 *
 * @typedef {{row: number, column: number}} Position
 * @typedef {{start: Position, end: Position}} Range
 * @typedef {{
 *      getLine: (x: number) => string,
 *      setValue: (v: string) => void,
 *      getValue: () => string,
 *      setMode: (s: string) => void,
 *      replace: (range: Range, s: string) => unknown,
 *      insert: (pos: Position, v: string) => void,
 *      getMarkers(front?: true): Record<number, {id: number, range: {start?: Position, end: Position}}>,
 *      removeMarker(id: number),
 *      getMode: () => {
 *          $id: `ace/mode/${string}`
 *      },
 *      $worker: {
 *          emit: (cmd: "addLibrary"|"removeLibrary"|"updateModule", {data: unknown}) => void
 *      }
 *  }} EditorSession
 * AceAjax.Editor |
 * @typedef { {
 *  container: HTMLElement,
 *  find: (s: string|RegExp) => Range,
 *  session: EditorSession,
 *  resize(),
 *  selection: {
 *      setRange: (range: Range, selection?: boolean) => unknown;
 *      getCursor: () => Position
 *  },
 *  clearSelection: () => void,
 *  moveCursorTo(line: number, col: number),
 *  getValue: () => string,
 *  getSession: () => EditorSession
 *  focus(),
 *  gotoLine(line: number),
 *  completers?: {
 *      getCompletions: (editor: any, session: any, pos: any, prefix: any, callback: any) => void;
 *      getDocTooltip: (item: {docHTML: string;caption: string;}) => void;
 *   }[];
 * } } AceEditor - custom AceEditor type (particular) (because of laziness to drag origin types)
 */

/**
 * @param {{require: (arg: string) => {(): any;new (): any;Range: any;};edit: (arg: any) => any;}} ace - ace library instance
 * @param {{
 *      compileFunc: Function;                                                  //// prebinded webCompile
 *      frameworkID: FrameworkID                                                 //// syntax mode (implied corresponding with vanile/preact/vue/react)
 *      controlSave?: (ev: object, compileFunc: Function) => void;              //// callback on ctrlSave
 *      storage?: Storage,                                                      //// (custom?) file storage instead of localStorage
 *      quickCompileMode: boolean,                                              //// ? not implements: quick compile vua messages communitation among DOM and frame
 *      modes?: object[],                                                       //// ? - deprecated field
 *      frameworkEnvironment: string[]                                          //// list of lib links to page downloading
 *      updateEnv: (frameworkName: string, code?: string) => string[]           //// update additionalScripts
 * }} editorOptions - options contained prebinded webCompile (compileFunc) and etc
 * @obsolete {string[]} modes
 * @obsolete {string|number} syntaxMode
 * @param {?[string?, string?, string?, object?]} [values] - initial values for editors
 * @returns {[AceEditor, AceEditor, AceEditor] & {
 *      playgroundObject: typeof playgroundObject,
 *      fileStorage: (typeof playgroundObject)['fileStorage'],
 *      updateEnv: (mode: string) => string[]
 * }}
 */
export default function initializeEditor(ace, editorOptions, values) {
   /**
    * @type {FrameworkID}
    */
   const initialFramework = editorOptions.frameworkID
   const frameworksList = Object.keys(compilersSet)

   const Range = ace.require("ace/range").Range
   const delay = 1500

   const autoPlay = debounce(() => {
      const frameworkEnvironment = editorOptions.updateEnv(frameworksList[editorOptions.frameworkID])
      const jsxEnabled = Boolean(editorOptions.frameworkID % 2)
      setTimeout(webCompile.bind(null, jsxEnabled, frameworkEnvironment, editorOptions.quickCompileMode))
   }, delay)

   const fontSize = ".9em"

   values = values || []

   /// read modules:

   const fileStorage = (window["fileStorage"] = window["fileStore"] || playgroundObject.fileStorage || { _active: 0 })

   const modulesStorage = values[3] || JSON.parse((editorOptions.storage || localStorage).getItem("_modules")) // files storage from outside

   let editors = [].slice.call(document.querySelectorAll(".editor")).map(initializeEditor)

   function initializeEditor(/** @type {{ id: any; }} */ element, /** @type {number} */ i, /** @type {any[]} */ arr) {
      let editor = ace.edit(element.id)
      editor.setTheme("ace/theme/monokai")

      let mode = modes[i]
      // (i && !(i % 2)
      if (i == 2 && initialFramework % 2) {
         //  javascript == 2   &&   syntax == 1 | 3 (preact|react)
         // mode = syntax % 2 ? 'tsx' : mode;  // jsx?
         mode = "jsx" // jsx
      }
      editor.session.setMode("ace/mode/" + mode)
      editor.setFontSize(fontSize)      

      
      let value = values[i];
      
      if (!value && modulesStorage) {
         const frameworkName = frameworksList[editorOptions.frameworkID]
         if (~singleFileTypes.indexOf(frameworkName)) {
            value = modulesStorage["App." + frameworkName][i]
            
         }
         else if(i === 2) {
            value = modulesStorage["app.js"] || modulesStorage["app.ts"] || modulesStorage["app.tsx"]  
         }               
      }

      value = value || (editorOptions.storage || localStorage).getItem(initialFramework + "__" + modes[i])      

      value = value || initialValues[initialFramework][modes[i]]
      if (value) {
         editor.session.setValue(value)
      }

      const allCommands = editor.commands.byName

      // editor.commands.bindKey("F9", null);

      // ?
      editor.commands.removeCommand(allCommands.removeline)

      // хотел сделать вырезание, но нет
      // allCommands.removeline.bindKey = { win: "Ctrl-X", mac: "Cmd-X" }
      // ?
      // editor.commands.addCommand(allCommands.removeline)

      // удаляет последний символ (добавлена и так)
      // // editor.commands.addCommand(allCommands.cut_or_delete)

      // добавляем горячую клавишу
      allCommands.copylinesdown.bindKey = { win: "Ctrl-D", mac: "Cmd-D" }
      // сама команда уже добавлена и так (почему-то надо добавить для 1-го редактора):
      editor.commands.addCommand(allCommands.copylinesdown)

      i < 2 && editor.textInput.getElement().addEventListener("input", autoPlay)

      // prettier-ignore
      editor.textInput.getElement().addEventListener("keydown", function (/** @type {{ ctrlKey: any; keyCode: number; key: string; preventDefault: () => void; }} */ event) {            

            event.ctrlKey && event.keyCode === 190 && (arr[i + 1] || arr[0]).querySelector("textarea").focus()
            event.ctrlKey && event.key === "ArrowUp" && expand({ currentTarget: document.querySelector(".expand") })
            if (event.key === "F9") {
               // ctrl+s
               console.time("F9")

               event.preventDefault()

               startApp(frameworksList, editorOptions, editors)

               console.timeEnd("F9")
            } else if (event.ctrlKey && event.keyCode === 83) {
               // ctrl + s
               //  console.log(editorOptions);

               event.preventDefault()
               
               const frameworkName = frameworksList[editorOptions.frameworkID]

               const frameworkEnvironment = editorOptions.updateEnv(frameworkName)
               const jsxEnabled = Boolean(editorOptions.frameworkID % 2)

               const extension = typeFromExtention(frameworkName)

               const webCompileFunc = singleFileEnv[extension]
                  ? compileSingleFileComponent.bind(null, extension, frameworkEnvironment, editors)
                  : webCompile.bind(null, jsxEnabled, frameworkEnvironment, void 0, {
                       lessMode: editorOptions.quickCompileMode || false
                    })

               if (editorOptions.controlSave) editorOptions.controlSave(event, webCompileFunc)
               else {
                  webCompileFunc()
               }
            } else if (event.ctrlKey && event.key === "f") {
               // это не работает (!):
               // event.preventDefault()
               // return false
            }
         })

      if (i === 0 && window.outerWidth > 600) {
         editor.setOptions({
            enableBasicAutocompletion: true,
            enableSnippets: true,
            enableLiveAutocompletion: true,
            fontSize
            // placeholder: "Enter your " + modes[i] + " Code",
            // enableEmmet: true,   //                       don't work
         })

         editor.completers = editor.completers.slice()

         const cursorText = editor.container.querySelector("textarea")
         cursorText.addEventListener("keydown", function tabHandler(/** @type {{ key: string; }} */ e) {
            if (e.key === "Tab") {
               if (editor.completer) {
                  editor.completer.keyboardHandler.removeCommand(editor.completer.keyboardHandler.commands.Tab)
                  cursorText.removeEventListener("keydown", tabHandler)
                  console.log("removing tab hot key from autocomplete popup")
               }
            }
         })

         editor.commands.addCommand(
            // [ indent,

            {
               name: "extend",
               exec: function () {
                  let cursor = editor.getCursorPosition()
                  let row = cursor.row

                  // editor.completer && editor.completer.keyboardHandler.removeCommand(editor.completer.keyboardHandler.commands.Tab)

                  if (cursor.column == editor.session.getLine(row).length) {
                     let line = editor.session.getLine(row)

                     let startChar = Math.max(line.lastIndexOf(" ") + 1, 0)
                     let endChar = cursor.column
                     let range = new Range(row, startChar, row, endChar)

                     let textRange = line.slice(startChar, endChar)
                     let code = extend(textRange)
                     // let text = editor.session.getValue();
                     editor.session.replace(range, code)

                     editor.moveCursorTo(
                        row,
                        !(textRange.startsWith(".") || textRange.startsWith("#"))
                           ? startChar + code.length - textRange.length - 3
                           : startChar + code.length - 6
                     )

                     return
                  }
                  editor.indent()
               },
               bindKey: { win: "Tab" }
            } //  expandSnippet ]
         )
      } else {
         //  if (i)

         editor.setOptions({
            enableBasicAutocompletion: true,
            enableSnippets: true,
            enableLiveAutocompletion: true,
            fontSize
            // maxSize: Infinity

            // placeholder: "Enter your " + modes[i] + " Code",
            // enableEmmet: true
         })

         // html (on width < 600)
         if (!i) {
            editor.completers = editor.completers.slice()
            editor.completers.push({
               getCompletions: function htmlCompleter(editor, session, pos, prefix, callback) {
                  callback(
                     null,
                     ["fill"]
                        .concat(cssKeyWords)
                        .map((w) => {
                           // editors[i].session.$mode.$highlightRules.$keywordList.push(w);
                           return {
                              caption: w,
                              value: w,
                              // snippet: '<' + w + '>',
                              meta: "attribute"
                           }
                        })
                        .concat(
                           ["svg", "select", "option"].map((w) => {
                              return {
                                 caption: "<" + w + ">",
                                 value: w,
                                 snippet: "<" + w + ">${1}</" + w + ">",
                                 meta: "tag"
                              }
                           })
                        )
                        .concat(
                           ["input"].map((w) => {
                              return {
                                 caption: "<" + w + ">",
                                 value: w,
                                 snippet: "<" + w + "/>",
                                 meta: "tag"
                              }
                           })
                        )
                  )
               }
            })
         }
         // style
         else if (i === +!!i) {
            editor.commands.on("afterExec", function (e) {
               // when does it occure??
               window["__debug"] && console.log(e.command.name)

               if (e.command.name.toLowerCase() === "return") {
                  const frameworkEnvironment = editorOptions.updateEnv(frameworksList[editorOptions.frameworkID])
                  const jsxEnabled = Boolean(editorOptions.frameworkID % 2)
                  webCompile(jsxEnabled, frameworkEnvironment, void 0, { lessMode: editorOptions.quickCompileMode })
               }
               // if (e.command.name == "insertstring" && /^[\w.]$/.test(e.args)) {
               //     editor.execCommand("startAutocomplete")
               // }
            })

            const colorsCompleter = {
               getCompletions: function cssCompleter(editor, session, pos, prefix, callback) {
                  // console.log(pos);
                  callback(
                     null,
                     cssKeyWords.concat(["div", "input", "select"]).map(function (word) {
                        return {
                           caption: word,
                           value: word,
                           meta: "static"
                        }
                     })
                  )
               }
               // getDocTooltip: function (item) {
               //     if (item.type == "snippet" && !item.docHTML) {
               //         item.docHTML = [
               //             "<b>", lang.escapeHTML(item.caption), "</b>", "<hr></hr>",
               //             lang.escapeHTML(item.snippet)
               //         ].join("");
               //     }
               // }
            }

            editor.completers = editor.completers.slice()
            editor.completers.push(colorsCompleter)
         }
         // javascript:
         else if (i === 2) {
            // AUTO COMPLETION:

            const domCompleter = {
               getCompletions: function jsCompleter(editor, session, pos, prefix, callback) {
                  // prefix !== '.' ? [] :
                  console.log(pos)
                  // editors[2].session.getLine(2).slice(0, 9).match(/([\w\d]+)\.\w+$/m)[1]
                  // get object for autocompletion

                  // let token = editor.session.getTokenAt(pos.row, pos.column)
                  // if (token.type == 'string') {
                  //     console.log('string token');
                  // }

                  callback(null, keyWords)
               },
               getDocTooltip: function (/** @type {{ docHTML: string; caption: string; }} */ item) {
                  // item['type'] === 'snippet'
                  if (!item.docHTML || (item["meta"] === "function" && domFuncs[item.caption] && domFuncs[item.caption].sign)) {
                     let hint = domFuncs[item.caption]
                     if (hint) {
                        let args = Object.keys(hint.sign || {})
                           .map((item) => item + ": " + hint.sign[item].type)
                           .join(", ")
                        // item.docHTML = '<h5>' + (hint.value || item.caption) + '(' + args + ') : ' + hint['return'] + '</h5><hr>'
                        item.docHTML = "<h5>" + (hint.origin || item.caption) + "(" + args + ") : " + hint["return"] + "</h5><hr>"
                        item.docHTML += "<p>" + (hint.desc || hint.value) + "</p>"
                        let argsDesc = ""
                        for (const key in hint.sign) {
                           argsDesc += "<li><b>" + key + ":" + (hint.sign[key].type || "any") + "</b> - " + hint.sign[key].desc
                        }
                        item.docHTML += "<ul>" + argsDesc + "</ul>"
                        // item.docHTML += '<h6>return ' + hint['return'] + '</h6>'
                     }
                     console.log(item)
                  }
               }
            }

            // editor.completers = editor.completers.slice();
            editor.completers.push(domCompleter)

            // REMOVE TAB AUTO COMPLETION IN STRING:

            const cursorText = editor.container.querySelector("textarea")
            cursorText.addEventListener("keydown", function tabHandler(/** @type {{ key: string; }} */ e) {
               if (e.key === "Tab") {
                  if (editor.completer) {
                     editor.completer.keyboardHandler.removeCommand(editor.completer.keyboardHandler.commands.Tab)
                     cursorText.removeEventListener("keydown", tabHandler)
                     console.log("removing tab hot key from autocompletion")

                     // var position = editor.getCursorPosition();
                     // var token = editor.session.getTokenAt(position.row, position.column);
                     // if (token.type === 'string') {
                     //     editor.completer.keyboardHandler.removeCommand(editor.completer.keyboardHandler.commands.Tab);
                     //     cursorText.removeEventListener('keydown', tabHandler)
                     //     console.log('removing tab hot key from autocompletion');
                     // }
                  }
               }
            })

            //AUTO RENAME:

            editor.commands.addCommand({
               name: "rename",
               exec: function () {
                  var position = editor.getCursorPosition()
                  var token = editor.session.getTokenAt(position.row, position.column)
                  if (token.type == "identifier") {
                     let newValue = prompt("", token.value)
                     if (newValue !== token.value) {
                        if (newValue && newValue.match(/^[\w_][\w_\d]*$/m)) {
                           let range = null
                           let options = {
                              // backwards: true,
                              wrap: true,
                              // caseSensitive: true,
                              // range: null,
                              wholeWord: true
                              // regExp: false
                           }
                           let threshold = editor.findAll(token.value)
                           if (threshold) {
                              const pattern = "import \\{[wd_\\. ,]*" + token.value + "[wd_\\. ,]*\\} from ['\"]\\./([\\w\\d_\\.]+)"
                              editor.find(new RegExp(pattern), { regExp: true })
                              const match = editor.getSelectedText().match(pattern)
                              if (match) {
                                 let storeName = match[1]
                                 let module = playgroundObject.fileStorage[storeName]
                                 if (!module) alert("Связанный модуль " + storeName + " не найден")
                                 else if (typeof module === "string") {
                                    let replacePattern = "(^" + token.value + ")|( " + token.value + ")|(" + token.value + " )"
                                    console.log(replacePattern)

                                    playgroundObject.fileStorage[storeName] = module.replace(
                                       new RegExp(replacePattern, "m"),
                                       function (substring, args) {
                                          console.log(arguments)
                                          return substring.replace(token.value, newValue)
                                       }
                                    )
                                 } else {
                                    debugger
                                 }
                              }
                           }
                           while ((range = editor.find(token.value, options)) && threshold--) {
                              console.log("replace...")
                              editor.session.replace(range, newValue)
                           }
                        } else if (newValue !== null) {
                           alert("Введите корректное имя для идентификатора")
                        }
                     }
                  }
               },
               bindKey: { win: "F2" }
               // insted of expand/collapse
            })

            // GO TO DEFINITION:

            editor.container.addEventListener("click", function (/** @type {{ ctrlKey: boolean; }} */ e) {
               var position = editor.getCursorPosition()
               var token = editor.session.getTokenAt(position.row, position.column)
               if (e.ctrlKey && token.type == "identifier") {
                  let code = editor.session.getValue()

                  const pattern = new RegExp("(var|let|const|function|class|import { ?) ?" + token.value)
                  const match = editor.session.getValue().match(pattern)

                  if (match) {
                     let linesCount = code.slice(0, match.index).split("\n").length - 1
                     if (linesCount === position.row) {
                        // нашел себя же (ту же строку)
                        // => ищем дальше (//TODO//)
                     } else {
                        let line = editor.session.getLine(2)
                        if (line.startsWith("import")) {
                           let r = line.match(new RegExp("from ['\"]\\./([\\w\\d_\\.]+)'"))
                           if (r) {
                              let filename = r[1]
                              // find inside filename:
                              let module = playgroundObject.fileStorage[filename]
                              if (!module) {
                                 editor.removeSelectionMarkers(editor.session.$selectionMarkers)
                                 alert("Отсутвует модуль " + filename)
                                 return
                              }
                              let submatch = (typeof module === "string" ? module : module[2]).match(pattern)
                              if (submatch) {
                                 // переключаемся на эту вкладку
                                 // let tabIndex = Object.keys(playgroundObject.fileStorage).indexOf(filename)
                                 const tabs = document.querySelector(".tabs").children
                                 let activeTab = [].slice
                                    .call(tabs)
                                    .filter((f) => f.innerText == filename)
                                    .pop()
                                 //@ts-ignore
                                 activeTab.click()

                                 console.log(submatch)
                                 // переходим к определению
                                 linesCount = (typeof module === "string" ? module : module[2]).slice(0, match.index).split("\n").length - 1
                                 editor.moveCursorTo(linesCount, 8 + submatch[1].length)
                              }
                           }
                        } else {
                           editor.moveCursorTo(linesCount, 0)
                        }
                     }
                  }
                  editor.removeSelectionMarkers(editor.session.$selectionMarkers)
               }
            })
         }
      }

      return editor
   }

   editors.fileStorage = fileStorage

   /// включаем вкладки:

   // prettier-ignore
   if (~Object.keys(playgroundObject.modes[2]).slice(1).map((w) => "/* " + w + " */").indexOf(editors[2].session.getLine(0))) {
      
      const tabs = document.querySelector(".tabs")
      tabs && tabs.classList.add("enabled")
   }

   document.location.hash.startsWith("#debug") && console.log("modules Storage get:")

   if (modulesStorage) {
      playgroundObject.fileStorage = bootFileStorage(modulesStorage, fileStorage, {
         frameworkID: editorOptions.frameworkID,
         editors
      })
   }

   // initResizers()

   return editors
}

/**
 * @description Transfer file system from string database to fileStorage (excludes entryPoint and $global) and tabs create:
 * @param {string} modulesStorage
 * @param {typeof playgroundObject.fileStorage} fileStorage
 * @returns {typeof playgroundObject.fileStorage}
 * @param {{
 *    frameworkID?: number,
 *    editors: AceAjax.Editor[]
 * }} options
 */
function bootFileStorage(modulesStorage, fileStorage, options) {
   const _modules = typeof modulesStorage === "object" ? modulesStorage : JSON.parse(modulesStorage)
   let fileCreateTab = document.querySelector(".tabs .tab:last-child")

   if (fileCreateTab) {
      let entryPoint = null;
      for (const key in _modules) {
         if (Object.hasOwnProperty.call(_modules, key)) {
            fileStorage[key] = _modules[key]

            // skip entry point
            if (!entryPoint && (/app\.(j|t)sx?/.test(key) || key == void 0 + "" || key === "App." + compilerNames[options.frameworkID])) {
               entryPoint = key
               continue
            }

            // setTimeout(() => fileCreate.click({ target: fileCreate, file: key }));
            if (compilerNames[options.frameworkID] && key === globalStore) {
               // debugger
               continue
            }
            fileAttach({ target: fileCreateTab, file: key, editors: options.editors })

            // editors[2].setValue(_modules[key]) // set editor value
            // // clear selection
            // editors[2].session.selection.setRange(new Range(0, 0, 0, 0))
         }
      }

      let activeTab = document.querySelector(".tabs .tab.active")
      activeTab && activeTab.classList.toggle("active")

      document.querySelector(".tabs .tab").classList.add("active")
   }

   return fileStorage
}

/**
 * @param {string[]} frameworksList
 * @param {{compileFunc?: Function;frameworkID: any;controlSave?: (ev: any, compileFunc: Function) => void;storage?: Storage;quickCompileMode: any;modes?: any[];frameworkEnvironment?: string[];updateEnv: any;}} editorOptions
 * @param {(isJsx: boolean, libList: string[], sourceCode?: string, compileOptions?: { lessMode?: boolean; scriptMode?: string; }) => void} [webCompileFunc]
 */
function startApp(frameworksList, editorOptions, webCompileFunc) {
   const editors = playgroundObject.editors

   const frameworkName = frameworksList[editorOptions.frameworkID]
   // binding is drop !!
   const frameworkEnvironment = editorOptions.updateEnv(frameworkName, editors[2].getValue())
   const jsxEnabled = Boolean(editorOptions.frameworkID % 2)

   const extension = typeFromExtention(frameworkName)

   if (singleFileEnv[extension]) {
      // svelte
      compileSingleFileComponent(extension, frameworkEnvironment, editors)
   } else {
      const compileFunc = webCompileFunc || webCompile
      compileFunc(jsxEnabled, frameworkEnvironment, void 0, { lessMode: editorOptions.quickCompileMode || false })
   }
}

/**
 * @param {string} extension
 * @param {string[]} frameworkEnvironment
 * @param {{ getValue: () => string; }[]} editors
 */
export function compileSingleFileComponent(extension, frameworkEnvironment, editors) {
   loadScripts(singleFileEnv[extension].links, () => {
      const entryPoint = "App." + extension

      // const content = (playgroundObject.fileStorage._active == entryPoint) ? editors[2].getValue() : playgroundObject.fileStorage[entryPoint];
      // const sourceData = playgroundObject.fileStorage[entryPoint] || editors.map(ed => ed.getValue()) [
      //    editors[2].getValue(),
      //    editors[0].getValue(),
      //    editors[1].getValue()
      // ];

      if (playgroundObject.fileStorage._active !== entryPoint) {
         var entryFile = playgroundObject.fileStorage[entryPoint]

         if (Array.isArray(entryFile)) {
            var fileContent = singleFileEnv[extension].join(entryFile[2], entryFile[0], entryFile[1])
         } else if (typeof entryFile === "string") {
            var fileContent = entryFile
         } else {
            var activeFile = editors.map((ed) => ed.getValue())
            var fileContent = singleFileEnv[extension].join(activeFile[2], activeFile[0], activeFile[1])
         }
      } //
      else {
         // var activeFile = [editors[2].getValue(), editors[0].getValue(), editors[1].getValue()]
         var activeFile = editors.map((ed) => ed.getValue())
         var fileContent = singleFileEnv[extension].join(activeFile[2], activeFile[0], activeFile[1])
         // var fileContent = singleFileEnv[extension].join(editors[2].getValue(), editors[0].getValue(), editors[1].getValue());
      }

      // const content = singleFileEnv[extension].join(editors[2].getValue(), editors[0].getValue(), editors[1].getValue())
      singleFileEnv[extension].onload(fileContent, (/** @type {string} */ vanileCode) => {
         // этот код требуется переместить внутрь и все отрефакторить

         webCompile(false, frameworkEnvironment, vanileCode, {
            originalCode: activeFile,
            scriptMode: singleFileEnv[extension].mode,
            frameworkName: extension
         })
      })
   })
}
