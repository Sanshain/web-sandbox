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
            debugger
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
    // let mode = (typeof i === 'number' ? playgroundObject.editors[i] : i).session.getMode().$id;
    let mode = playgroundObject.editors[i].session.getMode().$id;
    return mode.split('/').pop()
}

/**
 * Get file name extension
 * @param {string} name - origin filename
 * @returns {string} - filename extension
 */
export function getExtension(name) {
    return name.split('.').pop()
}


/**
 * @param {string} link
 * @param {{ onload?: (this: GlobalEventHandlers, ev: Event) => any; async?: boolean; }} options
 */
export function uploadScript(link, options) {
        
    let script = document.createElement('script');
    if (options.onload) {
        script.onload = options.onload;
    }
    script.async = !options.async
    script.src = link;
    document.head.appendChild(script);
}


/**
 * upload scripts
 * @param {string[]} links
 * @param {(this: GlobalEventHandlers, ev: Event) => any} onloaded
 */
export function loadScripts(links, onloaded){
    links.forEach((link, i) => {
        uploadScript(link, {
            async: false,
            onload: (links.length - 1 === i) ? onloaded : void 0
        })
    });
}

