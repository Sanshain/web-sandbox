/**
 *
 * @typedef {{
 *  [k: string]: {
 *      extension?: `.${string}`,
 *      src?: string | string[],
 *      inside?: boolean,
 *      prehandling?: (code: string) => string,
 *      mode?: string,
 *      tabs?: boolean,
 *      runtimeService?: {
 *           loadPackages(libFiles?: string[]): LanguageServiceHost,                                                         // to load Vue etc
 *           loadContent(filename: string, content: string, keepExistContent: true): void,                                   // load entry point content on tab creation
 *           changeSelectFileName(filename: string): void;                                                                   // change select file on tab switching
 *           getFileContent(name: string): string,
 *           getSelectFileName(): string,
 *           removeFile: (fileName: string) => void;                                                                         // remove file from host on remove tab
 *           getLoadedFilenames: () => string[];
 *           hasFile: (fileName: any) => boolean;
 *           updateFile: (fileName: string, content: string) => void;                                                        // update file content for type checking on tab switching (when works - its autoupdates)
 *           setCompilationSettings: (settings: CompilerOptions) => void;
 *           getCompilationSettings: () => CompilerOptions;
 *           _$editFile: (fileName: string, minChar: number, limChar: number, newText: string) => void;
 *      },
 *      onModeChange?: (arg: {enable: boolean, disable?: boolean, editor: AceEditor, editors?: ReturnType<initializeEditor>}) => void,
 *      target?:{
 *          external?: boolean,
 *          tag?: 'link'|'script'|'style'|'body',
 *          attributes?: string
 *      }
 *  }
 * }} LangMode
 *
 * @typedef { 0 | 1 | 2 | 3 } SyntaxMode - keyof (Object.keys(compilers) | ['vanile', 'preact', 'vue', 'react'])
 * @typedef {import("./aceInitialize").AceEditor} AceEditor
 *
 * @param {[string, string, string, Storage|object?]} values
 * @param {{
 *      onControlSave?: Function,                                                           // on ctrl+save callback
 *      tabAttachSelector?: string,                                                         // selector for tab attach (tabs must be decorated in DOM outside the package)
 *      modes?: [LangMode?, LangMode?, LangMode?],                                          // list of modes sets
 *      onModeChange?: (a: {editor: AceEditor, mode: string, prevMode?: string}) => void,   // on chenge mode (for example less => scss)
 *      onfilerename?: Function,                                                            // on file reneme event
 *      onfileRemove?: (s: string) => void,                                                 // on file remove event
 *      additionalFiles?: Storage|object,                                                   // ? implemented?
 *      quickCompileMode?: boolean,                                                         // ? not implemented - the quick mode compilation via onmessages iver sandbox communication
 *      syntaxMode?: SyntaxMode,                                                            // index of initial selected  framawork
 *      frameworkJug?: string,                                                              // html selector for input element w actual framework
 *      clarifyframework?: (code: string, fwmode: number | SyntaxMode) => SyntaxMode        // ? identifier rfamework on depend of source code
 * }?} options
 * @returns {ReturnType<initializeEditor>} {unknown[]}
 */
export function initialize(values: [string, string, string, Storage | (object | null)], options: {
    onControlSave?: Function;
    tabAttachSelector?: string;
    modes?: [LangMode?, LangMode?, LangMode?];
    onModeChange?: (a: {
        editor: AceEditor;
        mode: string;
        prevMode?: string;
    }) => void;
    onfilerename?: Function;
    onfileRemove?: (s: string) => void;
    additionalFiles?: Storage | object;
    quickCompileMode?: boolean;
    syntaxMode?: SyntaxMode;
    frameworkJug?: string;
    clarifyframework?: (code: string, fwmode: number | SyntaxMode) => SyntaxMode;
}): ReturnType<typeof initializeEditor>;
//@ts-expect-error
export type LangMode = LangMode;
/**
 * - keyof (Object.keys(compilers) | ['vanile', 'preact', 'vue', 'react'])
 */
export type SyntaxMode = 0 | 1 | 2 | 3;
export type AceEditor = import("./aceInitialize").AceEditor;
export type LanguageServiceHost = import("typescript").LanguageServiceHost;
export type CompilerOptions = import("typescript").CompilerOptions;
export type ChoiceDetails = import("./ui/ChoiceMenu").ChoiceDetails;
import { modes } from "./features/base.js";
import initializeEditor from "./aceInitialize";
