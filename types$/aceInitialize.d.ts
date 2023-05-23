/**
 * setup ace editor: hangs events and configures compilers
 * @typedef {0 | 1 | 2 | 3} FrameworkID - keyof Object.keys(compilers)
 * @typedef {ReturnType<initializeEditor>} EditorsEnv
 *
 *
 * @typedef {{row: number, column: number}} Position
 * @typedef {{start: Position, end: Position}} Range
 * @typedef {{
 *      getLine: (x: number) => string,
 *      setValue: (v: string) => void,
 *      getValue: () => string,
 *      setMode: (s: string) => void,
 *      replace: (range: Range, s: string) => unknown,
 *      insert: (pos: Position, v: string) => void,
 *      getMarkers(front?: true): Record<number, {id: number, range: {start?: Position, end: Position}}>,
 *      removeMarker(id: number),
 *      getMode: () => {
 *          $id: `ace/mode/${string}`
 *      },
 *      $worker: {
 *          emit: (cmd: "addLibrary"|"removeLibrary"|"updateModule", {data: unknown}) => void
 *      }
 *  }} EditorSession
 * AceAjax.Editor |
 * @typedef { {
 *  container: HTMLElement,
 *  find: (s: string|RegExp) => Range,
 *  session: EditorSession,
 *  resize(),
 *  selection: {
 *      setRange: (range: Range, selection?: boolean) => unknown;
 *      getCursor: () => Position
 *  },
 *  clearSelection: () => void,
 *  moveCursorTo(line: number, col: number),
 *  getValue: () => string,
 *  getSession: () => EditorSession
 *  focus(),
 *  gotoLine(line: number),
 *  completers?: {
 *      getCompletions: (editor: any, session: any, pos: any, prefix: any, callback: any) => void;
 *      getDocTooltip: (item: {docHTML: string;caption: string;}) => void;
 *   }[];
 * } } AceEditor - custom AceEditor type (particular) (because of laziness to drag origin types)
 */
/**
 * @param {{require: (arg: string) => {(): any;new (): any;Range: any;};edit: (arg: any) => any;}} ace - ace library instance
 * @param {{
 *      compileFunc: Function;                                                  //// prebinded webCompile
 *      frameworkID: FrameworkID                                                 //// syntax mode (implied corresponding with vanile/preact/vue/react)
 *      controlSave?: (ev: object, compileFunc: Function) => void;              //// callback on ctrlSave
 *      storage?: Storage,                                                      //// (custom?) file storage instead of localStorage
 *      quickCompileMode: boolean,                                              //// ? not implements: quick compile vua messages communitation among DOM and frame
 *      modes?: object[],                                                       //// ? - deprecated field
 *      frameworkEnvironment: string[]                                          //// list of lib links to page downloading
 *      updateEnv: (frameworkName: string, code?: string) => string[]           //// update additionalScripts
 * }} editorOptions - options contained prebinded webCompile (compileFunc) and etc
 * @obsolete {string[]} modes
 * @obsolete {string|number} syntaxMode
 * @param {?[string?, string?, string?, object?]} [values] - initial values for editors
 * @returns {[AceEditor, AceEditor, AceEditor] & {
 *      playgroundObject: typeof playgroundObject,
 *      fileStorage: (typeof playgroundObject)['fileStorage'],
 *      updateEnv: (mode: string) => string[]
 * }}
 */
export default function initializeEditor(ace: {
    require: (arg: string) => {
        (): any;
        new (): any;
        Range: any;
    };
    edit: (arg: any) => any;
}, editorOptions: {
    compileFunc: Function;
    frameworkID: FrameworkID;
    controlSave?: (ev: object, compileFunc: Function) => void;
    storage?: Storage;
    quickCompileMode: boolean;
    modes?: object[];
    frameworkEnvironment: string[];
    updateEnv: (frameworkName: string, code?: string) => string[];
}, values?: [string?, string?, string?, object?] | null): [AceEditor, AceEditor, AceEditor] & {
    playgroundObject: typeof playgroundObject;
    fileStorage: (typeof playgroundObject)['fileStorage'];
    updateEnv: (mode: string) => string[];
};
/**
 * @param {"svelte"|"vue"} extension - string - "svelte"|"vue"
 * @param {string[]} frameworkEnvironment
 * @param {{ getValue: () => string; }[]} editors
 */
export function compileSingleFileComponent(extension: "svelte" | "vue", frameworkEnvironment: string[], editors: {
    getValue: () => string;
}[]): void;
/**
 * - keyof Object.keys(compilers)
 */
export type FrameworkID = 0 | 1 | 2 | 3;
/**
 * setup ace editor: hangs events and configures compilers
 */
export type EditorsEnv = ReturnType<typeof initializeEditor>;
/**
 * setup ace editor: hangs events and configures compilers
 */
export type Position = {
    row: number;
    column: number;
};
/**
 * setup ace editor: hangs events and configures compilers
 */
export type Range = {
    start: Position;
    end: Position;
};
/**
 * AceAjax.Editor |
 */
export type EditorSession = {
    getLine: (x: number) => string;
    setValue: (v: string) => void;
    getValue: () => string;
    setMode: (s: string) => void;
    replace: (range: Range, s: string) => unknown;
    insert: (pos: Position, v: string) => void;
    getMarkers(front?: true): Record<number, {
        id: number;
        range: {
            start?: Position;
            end: Position;
        };
    }>;
    removeMarker(id: number): any;
    getMode: () => {
        $id: `ace/mode/${string}`;
    };
    $worker: {
        emit: (cmd: "addLibrary" | "removeLibrary" | "updateModule", { data: unknown }: {
            data: any;
        }) => void;
    };
};
/**
 * - custom AceEditor type (particular) (because of laziness to drag origin types)
 */
export type AceEditor = {
    container: HTMLElement;
    find: (s: string | RegExp) => Range;
    session: EditorSession;
    resize(): any;
    selection: {
        setRange: (range: Range, selection?: boolean) => unknown;
        getCursor: () => Position;
    };
    clearSelection: () => void;
    moveCursorTo(line: number, col: number): any;
    getValue: () => string;
    getSession: () => EditorSession;
    focus(): any;
    gotoLine(line: number): any;
    completers?: {
        getCompletions: (editor: any, session: any, pos: any, prefix: any, callback: any) => void;
        getDocTooltip: (item: {
            docHTML: string;
            caption: string;
        }) => void;
    }[];
};
import { modes } from "./features/base";
import { playgroundObject } from "./features/compiler";
