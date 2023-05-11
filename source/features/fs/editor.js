//@ts-check

import { getSelectedModeName, getExtension, isSingleFC, getFrameworkName } from "../../utils/utils"
import { playgroundObject, singleFileTypes } from "../compiler"


   export const cssKeyWords = ["red", "green", "blue", "gray", "lightgray", "lightblue", "orange", "white", "black", "none"]
   // cssKeyWords = cssKeyWords.concat(['div', 'input', 'select'])

/**
 * @param {{ [k: string]: string | [string, string, string]; } | { _active: string | number; }} fileStore
 * @param {string} activeTabName - new tab name
 */
export function createEditorFile(fileStore, activeTabName) {
   let editors = playgroundObject.editors
      
   if (~singleFileTypes.indexOf(getFrameworkName())) {
      //
      editors.forEach((editor) => editor.session.setValue(""))

      /// TODO get snippet from default snippets (at least for vue: export default { data () { return { // ... \n } } })
   } //
   else {
      editors[2].session.setValue("")

      /**
       * @type {{insertSnippet: (editor: import("../../..").AceEditor, snippet: string) => void}}
       */
      const snippetManager = ace.require("ace/snippets").snippetManager

      snippetManager.insertSnippet(editors[2], "export function ${1:funcName} (${2:args}){\n\t${3}\n}")
   }

   fileStore._active = activeTabName

   /// Add the file to ts lang server:

   const langModes = playgroundObject.modes[2]
   const selectedModeName = getSelectedModeName(2)

   if (langModes[selectedModeName] && langModes[selectedModeName].runtimeService) {
      const content = editors[2].getValue()

      // langModes[selMode].runtimeService.addScript(title, content)
      langModes[selectedModeName].runtimeService.loadContent(activeTabName, content, true)
      playgroundObject.editors[2].getSession().$worker.emit("addLibrary", { data: { name: activeTabName, content } })
   }
}
