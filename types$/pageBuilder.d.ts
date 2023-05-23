/**
 * @typedef {['body', 'style', 'script', 'link'?]} BaseTags
 */
/**
 *
 * TODO: option {simplestBundler, fileStore}
 *
 * @param {string} [prevUrl] - предыдущий URL для освобождения
 * @param {Array<string|[string]>} [additionalScripts] - дополнительные скрипты, которые будут добавлены на новую страницу (react, vue, preact...). Если массив - это inline script
 * @param {string} [scriptType] - атрибут тега скрипт, который будет добавлен в к тегу script на созданной странице (type=)
 * @param {{
 *  frameworkName?: string,
 *  onload?: Function,
 *  appCode?: string
 * }} [options] - onload callback (may be add previewClass?: string)
 * @returns {[HTMLIFrameElement, string]}
 */
export function createPage(prevUrl?: string, additionalScripts?: Array<string | [string]>, scriptType?: string, options?: {
    frameworkName?: string;
    onload?: Function;
    appCode?: string;
}): [HTMLIFrameElement, string];
/**
 * @description Create page and save virtual files to a appropriate storage
 *
 * // obsolete @ param {(url: string) => [HTMLIFrameElement, string]} [createPageFunc]
 * TODO: move to end or as option:
 * @param {boolean} isJsx ///! param {number} compilerMode -
 * @param {string[]} libList - list of script libs to attach to generated page
 * @param {string} [sourceCode=undefined] - optional argument (for SFC after preprocessing) - intended to next compilation
 *
 * TODO: options: {storage (localStorage|sessionStorage), fileStore}
 * @param {{
 *    lessMode?: boolean,                                         // flag to frame content update without new iframe recreation through content update (not implemented yet)
 *    scriptMode?: string,                                        // script tag type
 *    originalCode?: string[],                                    // origin code [of SFC] (if the sourceСode differs from the original) - intended to store inside FileStorage
 *    frameworkName?: string                                      // framework name,
 *    maps?: Record<string, import("svelte-compiler").SourceMap>
 * }} [compileOptions=undefined] -
 * (less compile mode does not implemented yet. TODO: via postMessage)
 */
export function webCompile(isJsx: boolean, libList: string[], sourceCode?: string, compileOptions?: {
    lessMode?: boolean;
    scriptMode?: string;
    originalCode?: string[];
    frameworkName?: string;
    maps?: Record<string, import("svelte-compiler").SourceMap>;
}): void;
export type KeyTags = ["body", "style", "script", "link"?][number] | 'link';
export type BaseTags = ['body', 'style', 'script', 'link'?];
export type CodeTarget = {
    tag?: ["body", "style", "script", "link"?][number];
    external?: boolean;
    attributes?: string;
};
export type LangMode = import("./main").LangMode;
export type Mode = import("..").LangMode[string];
import { compilersSet } from "./features/compiler";
import { babelCompiler } from "./features/compiler";
export { compilersSet as compilers, babelCompiler };



// neo builder: