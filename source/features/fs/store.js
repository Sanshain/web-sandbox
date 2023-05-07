//@ts-check

import { getExtension } from "../../utils/utils"
import { playgroundObject, singleFileEnv, singleFileTypes } from "../compiler"


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


   if (~singleFileTypes.indexOf(getExtension(newFileName))) saveFile(prevFileName)
   else {
      
      fileStore[prevFileName] = editors[2].getValue()
   }
   fileStore[newFileName] = ""
}


/**
 * save file
 * @param {string} prevFileName
 * @param {import("../../aceInitialize").EditorsEnv | []} [editors]
 */
export function saveFile(prevFileName, editors) {

   const frameworkName = getExtension(prevFileName)
   const fileStore = playgroundObject.fileStorage;
   editors = editors || playgroundObject.editors;

   if (!~singleFileTypes.indexOf(frameworkName)) {
      /// for standart extensions (.js, .ts, .jsx) - using as global style
      //% fileStore['$global'] = { html: editors[0].getValue(), css: editors[1].getValue(), }
      fileStore[globalStore] = editors.slice(0, -1).map((editor) => editor.getValue())
      fileStore[prevFileName] = editors[2].getValue()      
   } //
   else {
      fileStore[prevFileName] = editors.map((/** @type {{ getValue: () => string; }} */ editor) => editor.getValue())
      //% singleFileEnv[frameworkName].join(editors[2].getValue(), editors[0].getValue(), editors[1].getValue()) ||      
   }

   return fileStore[prevFileName]
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
      return content;
   }
}
 