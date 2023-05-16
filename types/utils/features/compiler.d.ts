/**
 * Replace imprt to spread.
 * @param {string} code
 * @returns {string}
 */
export function spreadImports(code: string): string;
/**
 * @typedef {import("../main").LangMode} LangMode
 * @type {{
 *      editors: import("../aceInitialize").EditorsEnv | [],                                             // any[],
 *      iframe?: HTMLIFrameElement,
 *      curUrl?: string,
 *      fileStorage: {[k: string]: string | string[]} & { _active: string, },                            // _entryPoint?: string = ? || { _active: number|string, },
 *      modes?: [import("../main").LangMode?, LangMode?, LangMode?],                                     // [object?, object?, object?]
 *      onfilerename?: Function,
 *      onfileRemove?: (name: string) => void
 *      frameworkID: number                                                                              // 0 | 1 | 2 | 3
 *      entryPointName: string
 * }}
 *      activeModes?: [number?, number?, number?],                                                       // UNUSED - use getSelectedModeName now
 */
export const playgroundObject: {
    editors: import("../aceInitialize").EditorsEnv | [];
    iframe?: HTMLIFrameElement;
    curUrl?: string;
    fileStorage: {
        [k: string]: string | string[];
    } & {
        _active: string;
    };
    modes?: [import("../main").LangMode?, LangMode?, LangMode?];
    onfilerename?: Function;
    onfileRemove?: (name: string) => void;
    frameworkID: number;
    entryPointName: string;
};
/**
 * @type {{
 *  [K in "svelte"|"vue"] : {
 *      links?: string[],
 *      mode?: string,
 *      join?: (code: string, html: string, style: string) => string,
 *      split?: (code: string) => [string, string, string],
 *      onload?: (source: string, callback: Function) => unknown
 *  } | undefined
 * }}
 */
export const singleFileEnv: {
    vue: {
        links?: string[];
        mode?: string;
        join?: (code: string, html: string, style: string) => string;
        split?: (code: string) => [string, string, string];
        onload?: (source: string, callback: Function) => unknown;
    };
    svelte: {
        links?: string[];
        mode?: string;
        join?: (code: string, html: string, style: string) => string;
        split?: (code: string) => [string, string, string];
        onload?: (source: string, callback: Function) => unknown;
    };
};
export const singleFileTypes: string[];
export namespace babelCompiler {
    const link: string;
    const mode: string;
}
export namespace versionController {
    const vue: {
        createApp: string[];
        "new Vue": string[];
    };
    const react: {
        createRoot: string[];
        "ReactDOM.render": string[];
    };
}
export namespace compilersSet {
    export const vanile: any[];
    export const preact: string[];
    const vue_1: string[];
    export { vue_1 as vue };
    const react_1: string[];
    export { react_1 as react };
    export const svelte: string[];
}
export const compilerNames: string[];
export const defaultValues: {
    html: string;
    css: string;
    javascript: string;
}[];
export const averageCompilerOptions: {};
export type LangMode = import("../main").LangMode;
