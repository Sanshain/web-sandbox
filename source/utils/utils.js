//@ts-check

import { playgroundObject, compilerNames, singleFileTypes } from "../features/compiler"

export const commonStorage = sessionStorage

/**
 * @param {{ (): unknown }} func
 * @param {number} delay
 */
export function debounce(func, delay) {
   let inAwaiting = false

   return function () {
      if (inAwaiting === false) {
         let result = func()

         inAwaiting = true
         setTimeout(() => (inAwaiting = false), delay)

         return result
      }
   }
}

/**
 * extracts lang mode from code text
 *
 * @param {string} code
 * @returns {string|null}
 */
export function getLangMode(code) {
   let langModeMatch = (typeof code === "string" ? code : code[2]).match(/\/\* ([\w \n]+) \*\//)

   return langModeMatch ? (langModeMatch.pop() || null) : null
}

/**
 * @param {string} prevName
 * @param {string} fullname
 * @param {{ find: (arg0: string) => any; getSession: () => string; }} editor
 */
function renameOccurrences(prevName, fullname, editor) {
   let fileStore = playgroundObject.fileStorage
   fileStore[fullname] = fileStore[prevName]
   delete fileStore[prevName]

   for (let file in playgroundObject.fileStorage) {
      const fileStorage = playgroundObject.fileStorage[file]
      if (typeof fileStorage === "string") {
         debugger
         playgroundObject.fileStorage[file] = fileStorage.replace(prevName, fullname)
      }
   }

   let pos = editor.find(prevName + "'")
   pos && editor.getSession().replace(pos, fullname + "'")
}

/**
 * Extract Ace mode name from playgroundObject.editors[i]
 * @param {number} i
 * @example {'css'|'less'|'scss'|'javascript'|'typescript'|'html'}
 * @return {string}
 */
export function getSelectedModeName(i) {
   // let mode = (typeof i === 'number' ? playgroundObject.editors[i] : i).session.getMode().$id;
   let mode = playgroundObject.editors[i].session.getMode().$id
   return mode.split("/").pop() || ''
}

/**
 * Get file name extension
 * @param {string} name - origin filename
 * @returns {string} - filename extension
 */
export function getExtension(name) {
   return name ? (name.split(".").pop() || '') : ""
}

/**
 * @description Detect single file framework or false (null)
 * @returns {string|null}
 */
export function isSingleFC() {
   const frameworkName = compilerNames[playgroundObject.frameworkID]
   return ~singleFileTypes.indexOf(frameworkName) ? frameworkName : null
}

/**
 * @description Detect framework name
 * @returns {string}
 */
export function getFrameworkName() {
   const frameworkName = compilerNames[playgroundObject.frameworkID]
   return frameworkName;
}

/**
 * @returns {boolean}
 * @param {AceAjax.Editor[]} [editors]
 */
export function isTSMode(editors) {
   //

   /// Option ONE:

   
   // TODO provide for the case when entrypoint is not focused:
   if (editors) return !!(editors || playgroundObject.editors)[2].session.getLine(0).match(/typescript/)
   else {
      const file = playgroundObject.fileStorage[playgroundObject.entryPointName]
      const content = typeof file === 'string' ? file : file[2];
      return content.startsWith('/* typescript */')
   }

   /// Option TWO:

   const langSelect = (editors || playgroundObject.editors)[2].container.querySelector("choice-menu")
   //@ts-expect-error
   return langSelect["selectedItem"] === "typescript"

   /// Option THREE:

   const fileStorage = playgroundObject.fileStorage
   const frameworkName = compilerNames[playgroundObject.frameworkID]

   if (~singleFileTypes.indexOf(frameworkName)) {
      var entryPointCode = playgroundObject.fileStorage["App." + frameworkName][2]
   } else {
      //@ts-expect-error {string}
      var entryPointCode = Object.values(fileStorage)[1]
   }

   return !!entryPointCode.match(/typescript/)
}

/**
 * @param {string} frameworkName - framework name or file name with appropriate extension
 */
export function typeFromExtention(frameworkName) {
   return frameworkName.toLowerCase() || getExtension(playgroundObject.fileStorage._active)
}

/**
 * @param {string} link
 * @param {{ onload?: (this: GlobalEventHandlers, ev: Event) => any; async?: boolean; }} options
 */
export function uploadScript(link, options) {
   let script = document.createElement("script")
   if (options.onload) {
      script.onload = options.onload
   }
   script.async = !options.async
   script.src = link
   document.head.appendChild(script)
}

/**
 * upload scripts
 * @param {string[]} links
 * @param {(this: GlobalEventHandlers, ev: Event) => any} onloaded
 */
export function loadScripts(links, onloaded) {
   links.forEach((link, i) => {
      uploadScript(link, {
         async: false,
         onload: links.length - 1 === i ? onloaded : void 0
      })
   })
}
