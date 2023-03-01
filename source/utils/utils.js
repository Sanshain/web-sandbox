//@ts-check

import { playgroundObject } from "../pageBuilder";

export const commonStorage = sessionStorage;

/**
 * @param {{ (): unknown }} func
 * @param {number} delay
 */
export function debounce(func, delay) {
    
    let inAwaiting = false;

    return function ()
    {
        if (inAwaiting === false) {

            let result = func();

            inAwaiting = true;
            setTimeout(() => inAwaiting = false, delay);

            return result;
        }
    };
}



/**
 * extracts lang mode from code text
 * 
 * @param {string} code
 * @returns {string|null}
 */
export function getLangMode(code)
{
    let langModeMatch = code.match(/\/\* ([\w \n]+) \*\//);

    return langModeMatch
        ? langModeMatch.pop()
        : null;
}


/**
 * @param {string} prevName
 * @param {string} fullname
 * @param {{ find: (arg0: string) => any; getSession: () => string; }} editor
 */
function renameOccurrences(prevName, fullname, editor) {
    let fileStore = playgroundObject.fileStorage
    fileStore[fullname] = fileStore[prevName];
    delete fileStore[prevName];

    for (let file in playgroundObject.fileStorage) {
        if (typeof playgroundObject.fileStorage[file] === 'string') {
            playgroundObject.fileStorage[file] = playgroundObject.fileStorage[file].replace(prevName, fullname);
        }
    }

    let pos = editor.find(prevName + "'")
    pos && editor.getSession().replace(pos, fullname + "'")
}


/**
 * Extract mode name from playgroundObject.editors[i]
 * @param {number} i 
 * @example {'css'|'less'|'scss'|'javascript'|'typescript'|'html'}
 * @return {string}
 */
export function getSelectedModeName(i) {
    let mode = playgroundObject.editors[i].session.getMode().$id;
    return mode.split('/').pop()
}