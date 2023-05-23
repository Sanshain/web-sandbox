/**
 * @param {AceEditor} editor : ace editor instanse
 * @param {{
 *    hint?: {
 *       desc: string,
 *       origin?: string,
 *       sign: {
 *          [x: string]: {type: string, description: string}}
 *       };
 *       name: string;
 *       template?: string;
 *       meta?: 'function'|'property';
 * }} keyWordInfo
 */
export function autocompleteExpand(editor: AceEditor, keyWordInfo: {
    hint?: {
        desc: string;
        origin?: string;
        sign: {
            [x: string]: {
                type: string;
                description: string;
            };
        };
    };
    name: string;
    template?: string;
    meta?: 'function' | 'property';
}): void;
export namespace domFuncs {
    const style: any;
    const color: any;
    namespace render {
        export const desc: string;
        export namespace sign {
            namespace component {
                const desc_1: string;
                export { desc_1 as desc };
                export const type: string;
            }
            namespace parent {
                const desc_2: string;
                export { desc_2 as desc };
                const type_1: string;
                export { type_1 as type };
            }
        }
        const _return: string;
        export { _return as return };
    }
    namespace useRef {
        const desc_3: string;
        export { desc_3 as desc };
        export namespace sign_1 {
            namespace initialValue {
                const desc_4: string;
                export { desc_4 as desc };
            }
        }
        export { sign_1 as sign };
        const _return_1: string;
        export { _return_1 as return };
    }
    namespace useState {
        const desc_5: string;
        export { desc_5 as desc };
        export namespace sign_2 {
            namespace initialState {
                const type_2: string;
                export { type_2 as type };
                const desc_6: string;
                export { desc_6 as desc };
            }
        }
        export { sign_2 as sign };
        const _return_2: string;
        export { _return_2 as return };
    }
    namespace useEffect {
        const desc_7: string;
        export { desc_7 as desc };
        export namespace sign_3 {
            namespace effect {
                const type_3: string;
                export { type_3 as type };
                const desc_8: string;
                export { desc_8 as desc };
            }
            namespace inputs {
                const type_4: string;
                export { type_4 as type };
                const desc_9: string;
                export { desc_9 as desc };
            }
        }
        export { sign_3 as sign };
    }
    const indexOf: string;
    const slice: string;
    namespace qf {
        const desc_10: string;
        export { desc_10 as desc };
        export const value: string;
    }
    namespace qm {
        const desc_11: string;
        export { desc_11 as desc };
        const value_1: string;
        export { value_1 as value };
    }
    namespace fore {
        const desc_12: string;
        export { desc_12 as desc };
        const origin_1: string;
        export { origin_1 as origin };
        const value_2: string;
        export { value_2 as value };
        export namespace sign_4 {
            namespace callback {
                const type_5: string;
                export { type_5 as type };
                const desc_13: string;
                export { desc_13 as desc };
            }
            namespace context {
                const type_6: string;
                export { type_6 as type };
                const desc_14: string;
                export { desc_14 as desc };
            }
        }
        export { sign_4 as sign };
    }
    namespace log {
        const desc_15: string;
        export { desc_15 as desc };
        const value_3: string;
        export { value_3 as value };
        export namespace sign_5 {
            namespace message {
                const type_7: string;
                export { type_7 as type };
            }
        }
        export { sign_5 as sign };
    }
    const target: any;
    const classList: any;
    const offsetHeight: any;
    const offsetWidth: any;
    const getComputedStyle: string;
    const innerHTML: any;
    const innerText: any;
    const appendChild: string;
    const insertBefore: string;
    const createElement: string;
    const preventDefault: string;
    const key: string;
    const closest: string;
    namespace getElementById {
        const desc_16: string;
        export { desc_16 as desc };
        const _return_3: string;
        export { _return_3 as return };
    }
    const querySelectorAll: string;
    namespace querySelector {
        const desc_17: string;
        export { desc_17 as desc };
        export namespace sign_6 {
            namespace selector {
                const type_8: string;
                export { type_8 as type };
                const desc_18: string;
                export { desc_18 as desc };
            }
        }
        export { sign_6 as sign };
        const _return_4: string;
        export { _return_4 as return };
    }
    namespace addEventListener {
        const desc_19: string;
        export { desc_19 as desc };
        export namespace sign_7 {
            export namespace selector_1 {
                const type_9: string;
                export { type_9 as type };
                const desc_20: string;
                export { desc_20 as desc };
            }
            export { selector_1 as selector };
        }
        export { sign_7 as sign };
    }
    const onload: string;
    const onclick: string;
    const oninput: string;
    const onkeydown: string;
    const onchange: string;
    const onmousedown: string;
    const onmousemove: string;
    const onmouseover: string;
    const onmouseout: string;
}
export let keyWords: {
    caption: string;
    value: string;
    snippet: any;
    type: string;
    meta: string;
}[];
export namespace quickCompleter {
    /**
     * @description autocomplete update:
     * @$_param {`export ${string}`[]} exports
     * @param {string[]} exports
     * @param {string[]} [defaultExport]
     */
    function importsUpdate(exports: string[], defaultExport?: string[]): void;
    /**
     * @description autocomplete update:
     * @$_param {`export ${string}`[]} exports
     * @param {string[]} exports
     * @param {string[]} [defaultExport]
     */
    function importsUpdate(exports: string[], defaultExport?: string[]): void;
}
