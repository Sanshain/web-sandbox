//@ts-check

import { getExtension } from "../../utils/utils"
import { playgroundObject, singleFileEnv, singleFileTypes, compilerNames } from '../compiler';


/**
 * @description fs virtual name for the global markup and style (used just for SFC)
 */
export const globalStore = "$global";

/**
 * creates and save file
 * @param {{ innerText: string; }} newTab - contains filename to clean it
 * @param {{ innerText: string; }} origTab - contains fileName, which one will saved via this func
 */
export function createAndSaveFile(newTab, origTab) {
   const editors = playgroundObject.editors
   const fileStore = playgroundObject.fileStorage

   const newFileName = newTab.innerText
   const prevFileName = origTab.innerText


   if (~singleFileTypes.indexOf(getExtension(prevFileName))) saveFile(prevFileName)
   else {
      fileStore[prevFileName] = editors[2].getValue()
   }
   fileStore[newFileName] = ""
}


/**
 * save file to fileStorage from editors
 * @param {string} fileName
 * @param {import("../../aceInitialize").EditorsEnv | []} [editors]
 */
export function saveFile(fileName, editors) {

   const frameworkName = getExtension(fileName)
   const fileStore = playgroundObject.fileStorage;
   editors = editors || playgroundObject.editors;

   if (!~singleFileTypes.indexOf(frameworkName)) {
      /// for standart extensions (.js, .ts, .jsx) - using as global style
      //% fileStore['$global'] = { html: editors[0].getValue(), css: editors[1].getValue(), }
      
      fileStore[globalStore] = editors.slice(0, -1).map((editor) => editor.getValue())
      fileStore[fileName] = editors[2].getValue()      
   } //
   else {
      fileStore[fileName] = editors.map((/** @type {{ getValue: () => string; }} */ editor) => editor.getValue())
      //% singleFileEnv[frameworkName].join(editors[2].getValue(), editors[0].getValue(), editors[1].getValue()) ||      
   }

   return fileStore[fileName]
}

/**
 * @param {string} fileName
 * @param {string | string[]} value
 * @param {number} [i]
 */
export function saveScript(fileName, value, i) {
   let _markLineJug = playgroundObject.fileStorage[fileName]
   if (typeof _markLineJug == 'string') {
      playgroundObject.fileStorage[fileName] = value;
   }
   else {
      //@ts-expect-error <string|string[]>
      playgroundObject.fileStorage[fileName][i || 2] = value;
   }
}


/**
 * @param {string} activeTabName
 */
export function readFromFile(activeTabName) {   

   const fileStore = playgroundObject.fileStorage;
   const editors = playgroundObject.editors;

   const activeFile = fileStore[activeTabName];

   if (Array.isArray(activeFile)) {

      activeFile.forEach((code, i) => { editors[i].session.setValue(activeFile[i]) })
      return activeFile[2];
   }
   else {
      const content = activeFile
      editors[2].session.setValue(content)

      const isSFC = ~compilerNames.indexOf(getExtension(playgroundObject.fileStorage._active))
      if (isSFC) {
         editors.slice(0, -1).map((editor, i) => editor.session.setValue((fileStore[globalStore] || [])[i] || ''))
      }

      return content;
   }
}
 