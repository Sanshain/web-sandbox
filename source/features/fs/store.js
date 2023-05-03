//@ts-check

import { getExtension } from "../../utils/utils";
import { playgroundObject } from "../compiler";





/**
 * @param {{ innerText: string; }} newTab
 * @param {{ innerText: string; }} origTab
 */
export function createAndSaveFile(newTab, origTab) {

    const editors = playgroundObject.editors;
    const fileStore = playgroundObject.fileStorage;

    const newFileName = newTab.innerText;
    const prevFileName = origTab.innerText;
    if (~['vue', 'svelte'].indexOf(getExtension(newFileName))) {
        if (!~['vue', 'svelte'].indexOf(getExtension(prevFileName))) {
            /// for standart extensions (.js, .ts, .jsx) - using as global style                
            // fileStore['$global'] = {
            //     html: editors[0].getValue(),
            //     css: editors[1].getValue(),
            // }
            fileStore['$global'] = editors.slice(0, -1).map(editor => editor.getValue());
            fileStore[prevFileName] = editors[2].getValue();
        }
        else {
            fileStore[prevFileName] = editors.map(editor => editor.getValue());
        }
    }
    else {
        fileStore[prevFileName] = editors[2].getValue();

    }
    fileStore[newFileName] = '';
}