//@ts-check


import { autocompleteExpand, keyWords, quickCompleter } from "../utils/autocompletion"
import { getExtension, getSelectedModeName, isTSMode } from "../utils/utils"
import { compilerNames, playgroundObject, singleFileTypes } from "./compiler"
import { createEditorFile } from "./fs/editor"
import * as fs from "./fs/store"

/**
 * @param {string} activeTabName
 */
function generateImportSnippets(activeTabName) {

   const extension = getExtension(activeTabName);
   const baseName = activeTabName.slice(0, - extension.length - 1)

   if (~singleFileTypes.indexOf(extension)) {
      let snippet = {
         name: "import " + baseName + " from './" + activeTabName + "'",
         // template: "import ${1:" + baseName + "} from './" + activeTabName + "';"
         template: "import " + baseName + " from './" + activeTabName + "';"
      }
      return snippet
   }   
   let snippets = {
      name: "import { * } from './" + baseName + "'",
      template: "import { ${1} } from './" + baseName + "';"
   }
   return snippets
}

const menuPoints = {
   Удалить: (/** @type {{ target: HTMLDivElement }} */ e) => {
      if (confirm("Вы уверены, что хотите удалить файл `" + e.target.innerText + "`")) {
         let filename = e.target.innerText

         playgroundObject.onfileRemove(filename)
         delete playgroundObject.fileStorage[filename]
         e.target.parentElement.removeChild(e.target)

         let langModes = playgroundObject.modes[2]
         let selMode = getSelectedModeName(2)
         if (langModes[selMode] && langModes[selMode].runtimeService) {
            // langModes[selMode].runtimeService.removeScript(filename)

            langModes[selMode].runtimeService.removeFile(filename)
            playgroundObject.editors[2].getSession().$worker.emit("removeLibrary", { data: { name: filename } })
         }
      }
   }
}


/**
 * 
 * 
 * 
 * attach new file
 * @param {{ file?: string; target: any; editors?: AceAjax.Editor[] }} event
 */
export function fileAttach(event) {
   let fileStore = playgroundObject.fileStorage

   /// Проверяем имя файла на валидность:

   /** @type {import("../aceInitialize").EditorsEnv} */
   const editors = event["editors"] || window["editors"]

   let activeTabName = nameValidate(event.file || prompt("Enter file name:"), event.editors) || ""

   if (!activeTabName) return alert("Invalid file name format")

   /// Проверяем имя файла на exists():

   if (!event.file && ~Object.keys(fileStore).indexOf(activeTabName)) {
      return alert("Файл с таким именем уже существует")
   }

   window['__debug'] && console.log("create new Tab")

   const target = event.target

   //! Настройка переключения между табами:

   const origTab = target.parentElement.querySelector(".tab.active") || target.parentElement.children[0]

   {
      /**
       * Rename existing file
       * @param {MouseEvent} ev
       * @returns
       */
      origTab.ondblclick = function onrename(/** @type {{ target: { innerText: string; }; }} */ ev) {
         if (!playgroundObject.onfilerename) return console.warn("Specify onfilerename callback argument to activate the feature!")

         const prevName = ev.target.innerText;

         if (prevName === playgroundObject.entryPointName) return;
         // if (prevName.match(/app\.\ws/)) return

         const fileInfo = prevName.split(".")
         const ext = fileInfo.pop();
         let filename = prompt("Enter new file name:", fileInfo[0])

         if (filename === fileInfo[0]) return
         if (getExtension(filename) !== ext) {
            if (confirm("Are you sure you want to change the extension for the file?")) {
               fileInfo[1] = getExtension(filename);
               
               ; ({ activeTabName, fileStore } = renameTab({ filename, fileInfo, prevName, ev, activeTabName }))
               
               return;
            }
            else {
               return onrename(ev)
            }
         }
            
         ;({ activeTabName, fileStore } = renameTab({ filename, fileInfo, prevName, ev, activeTabName }))
      }

      /**
       * Toggle among active tabs
       * @param {MouseEvent} ev
       * @returns
       */
      origTab.onclick = origTab.onclick || ((ev) => ({ activeTabName, fileStore } = toggleTab(ev, activeTabName)))
   }

   /// создание нового таба:

   /** @type {HTMLElement & {oncontextmenu: any}} */

   const newTab = createNewTab(origTab, activeTabName)

   if (playgroundObject.onfileRemove) newTab.oncontextmenu = onContextMenu

   if (!event.file) {
      
      /// if new:

      fs.createAndSaveFile(newTab, origTab) // create new

      autocompleteExpand(editors[2], generateImportSnippets(activeTabName)) // editors[2].setValue(fileStore[newTab.innerText]);
   }

   target.parentElement.insertBefore(newTab, target)
   editors[2].focus()

   !event.file && createEditorFile(fileStore, activeTabName)
}

/**
 *
 *
 * @param {{ cloneNode: () => HTMLDivElement; onclick: any; ondblclick: any; }} origTab
 * @param {string} activeTabName
 * @returns {HTMLElement & {oncontextmenu: any}}
 */
function createNewTab(origTab, activeTabName) {
   let newTab = origTab.cloneNode()
   newTab.innerText = activeTabName

   let prevTab = document.querySelector(".tab.active")
   prevTab && prevTab.classList.toggle("active")
   newTab.classList.add("active")

   newTab.style.marginRight = "1.25em"
   newTab.onclick = origTab.onclick
   newTab.ondblclick = origTab.ondblclick
   return newTab
}

function renameTab({ filename, fileInfo, prevName, ev, activeTabName }) {
   let { editors, fileStorage: fileStore } = playgroundObject   

   if (!filename) alert("Имя файла должно содержать буквы (хотя бы одну)")
   else {      
      const fullname = [fileInfo[0], fileInfo[1]].join(".")      
      if (!nameValidate(fullname)) {
         alert('Wrong file format')
         return { activeTabName, fileStore }
      }
      function standardBehavior() {
         ev.target.innerText = fullname
         renameOccurrences(prevName, fullname)
      }

      if (!playgroundObject.onfilerename) standardBehavior()
      else {
         playgroundObject.onfilerename(ev.target.innerText, fullname, standardBehavior)
      }

      activeTabName = fullname

      /**
       *
       * @param {string} prevName
       * @param {string} fullname
       */
      function renameOccurrences(prevName, fullname) {
         fileStore = playgroundObject.fileStorage
         fileStore[fullname] = fileStore[prevName]
         delete fileStore[prevName]

         for (let file in playgroundObject.fileStorage) {
            const fileContent = playgroundObject.fileStorage[file]
            if (typeof fileContent === "string") {
               // debugger
               if (getExtension(fullname).startsWith('ts')) {                  
                  // TODO alse reverse replace: .ts => svelte
                  playgroundObject.fileStorage[file] = fileContent.replace(prevName, fullname.split('.').shift())   
               }
               else {
                  playgroundObject.fileStorage[file] = fileContent.replace(prevName, fullname)                    
               }
            }
         }         
         let pos = editors[2].find(prevName + "'")         
         pos && editors[2].getSession().replace(pos, fullname + "'")
      }
   }
   return { activeTabName, fileStore }
}

/**
 * toggle tabs
 * @param {{ target: HTMLElement; }} ev
 * @param {string} activeTabName
 */
function toggleTab(ev, activeTabName) {
   var fileStore = playgroundObject.fileStorage

   const editors = playgroundObject.editors
   const prevTab = document.querySelector(".tab.active")

   globalThis.__debug && console.log("toggle tab...")


   /// prev tab saving:

   if (prevTab) {
      fileStore = playgroundObject.fileStorage // т.к. при смене языка мы можем переопределить playgroundObject.fileStorage = Object.assign... ? window.fileStore - ?

      const prevTabName = prevTab["innerText"]

      prevTab.classList.toggle("active")

      const r = fs.saveFile(prevTabName, editors) // fileStore[prevTabName] = editors[2].getValue()
      const closedFile = fileStore[prevTabName]
      if (typeof closedFile === "string") {
         const exports = closedFile.match(/export (function|const|let|class) (\w+)/g) || []
         const mainExport = closedFile.match(/export default function (?:\w+)/) || []

         quickCompleter.importsUpdate(exports, mainExport)
      }
   }

   /// fill content from new active Tab:

   ev.target.classList.add("active")

   const scriptCode = fs.readFromFile((activeTabName = ev.target.innerText))

   fileStore._active = activeTabName

   /// now update TSServ:

   let langModes = playgroundObject.modes[2]
   let selMode = getSelectedModeName(2)
   if (langModes[selMode] && langModes[selMode].runtimeService) {
      const content = fileStore[activeTabName] // editors[2].getValue();

      // langModes[selMode].runtimeService.addScript(title, content)
      // langModes[selMode].runtimeService.loadContent(title, content, true)
      langModes[selMode].runtimeService.updateFile(activeTabName, typeof content == "string" ? content : content[2])

      // playgroundObject.editors[2].getSession().$worker.emit("addLibrary", { data: { name: title, content } });
      playgroundObject.editors[2].getSession().$worker.emit("updateModule", { data: { name: activeTabName, content } })
      langModes[selMode].runtimeService.changeSelectFileName(activeTabName)
   }

   /// revive intial editor state:

   editors[2].gotoLine(scriptCode.split("\n").length - 1)
   editors[2].focus()

   return { fileStore, activeTabName }
}

/**
 * @description menu to remove some tab
 * @param {{ target?: { innerText: string | number; parentElement: { removeChild: (arg0: any) => void; }; }; clientX: string; clientY: number; }} e
 */
function onContextMenu(e) {
   /** @type {HTMLDivElement} */
   let contextMenu = document.querySelector(".context_menu")

   if (contextMenu) contextMenu.classList.remove("hidden")
   else {
      contextMenu = document.body.appendChild(document.createElement("div"))
      contextMenu.className = "context_menu"
      contextMenu.tabIndex = 0
      Object.keys(menuPoints).forEach((key) => {
         let point = contextMenu.appendChild(document.createElement("div"))
         point.innerText = key
         point.addEventListener("click", () => {
            contextMenu.classList.toggle("hidden")
            setTimeout(() => {
               menuPoints[key] && menuPoints[key](e)
            })
         })
      })
      contextMenu.onblur = function () {
         contextMenu.classList.add("hidden")
      }
   }

   // console.log(e);

   contextMenu.style.left = e.clientX + "px"
   contextMenu.style.top = e.clientY + 5 + "px"
   contextMenu.focus()

   return false
}

/**
 * Validate file name
 * @param {string} name
 * @param {AceAjax.Editor[]} [editors] 
 * @returns {string | false} - valid file name or false 
 */
function nameValidate(name, editors) {
   //
   if (!name) return false

   const match = name.match(/[\d\w\-]+(?:\.(?<ext>\w+))?/)
   if (!match) return false
   else {
      //
      const ext = match.groups.ext
      const frameworkName = compilerNames[playgroundObject.frameworkID]
      
      if (!ext) {
         if (~singleFileTypes.indexOf(frameworkName)) return name + "." + frameworkName
         else {
            ///

            // const isJsx = playgroundObject.frameworkID % 2;                                                 // TODO further?
            // if (isJsx) { ext += 'x' }
            return name + (isTSMode(editors) ? ".ts" : ".js")
         }
      } //
      else {
         /// vanila extension checking:

         if ((isTSMode(editors) ? /ts(x)?/ : /js/).test(ext)) return name

         /// framework extension checking:

         if (~singleFileTypes.indexOf(frameworkName) && ext === frameworkName) return name;
      }
   }
   
   return false

   // let ext = getExtension(fileStore._active)
   // ext = "." + (ext || (fileStore["app.ts"] || editors[2].session.getLine(0).match(/typescript/) ? "ts" : "js"))

   // let activeTabName = ~filename.indexOf(".") ? filename : filename + ext
}
