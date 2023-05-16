//@ts-check


import * as tsc from "typescript";
// import tsEditor from "ts-a-editor";
// export { default as tsEditor } from "ts-a-editor";
import type { default as TSEditor } from "ts-a-editor";



// import { Options, PlaygroundEditors } from "./index";
// import { LangMode, AceEditor, SyntaxMode, initialize } from './types/main';



type SyntaxMode = import("./source/main").SyntaxMode
type LangMode = import("./source/main").LangMode;
type AceEditor = import("./source/aceInitialize").AceEditor;
type LanguageServiceHost = import("typescript").LanguageServiceHost;
type ChoiceDetails = import("./source/ui/ChoiceMenu").ChoiceDetails;
type TypescriptEditor = typeof TSEditor


type Options = {

    onControlSave?: Function,                                                                // on ctrl+save callback
    tabAttachSelector?: string,                                                              // selector for tab attach (tabs must be decorated in DOM outside the package)
    modes?: [LangMode?, LangMode?, LangMode?],                                            // list of modes sets
    onModeChange?: (a: { editor: AceEditor, mode: string, prevMode?: string }) => void,      // on chenge mode (for example less => scss)
    onfilerename?: Function,                                                                 // on file reneme event
    onfileRemove?: (s: string) => void,                                                      // on file remove event
    additionalFiles?: Storage | object,                                                      // ? implemented?
    quickCompileMode?: boolean,                                                              // ? not implemented - the quick mode compilation via onmessages iver sandbox communication
    syntaxMode?: SyntaxMode,                                                                 // index of initial selected  framawork 
    clarifyframework?: (code: string, fwmode: number | SyntaxMode) => SyntaxMode             // ? identifier rfamework on depend of source code
};

type PlaygroundEditors = [AceEditor, AceEditor, AceEditor] & { playgroundObject: object, updateEnv: (mode: string) => string[] }


// GLOBAL INTERFACES:

declare global{
    interface Window {
        ts: typeof tsc
    }

    // DECLARATIONS:

    const ts: typeof tsc;

    const tsEditor: typeof TSEditor;

    const less: {
        render(code: string, options: Record<string, unknown>, clb: (er: unknown, result: { css: string }) => void)
        // render(code: string, options: Record<string, unknown>, clb: Function<unknown, {css: string}>)
    }

    const sassToCss: (code: string) => string

    const procCompiler: {
        compileToSass: (s: string) => string,
        compileToLess: (s: string) => string
    }

    const IDE: {
        initialize: (arg: [string, string, string, (Storage | object)?], options: Options) => PlaygroundEditors
    }
}



// DECLARATIONS:

// set `disableSourceOfProjectReferenceRedirect: true`


declare const ts: typeof tsc;

declare const procCompiler: {
    compileToSass: (s: string) => string,
    compileToLess: (s: string) => string
}

declare var IDE: {
    initialize: (arg: [string, string, string, (Storage | object)?], options: Options) => PlaygroundEditors
}

declare const less: {
    render(code: string, options: Record<string, unknown>, clb: (er: unknown, result: { css: string }) => void)
}

declare const sassToCss: (code: string) => string

