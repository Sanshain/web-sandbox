/**
 * @param {{ [k: string]: string | [string, string, string]; } | { _active: string | number; }} fileStore
 * @param {string} activeTabName - new tab name
 */
export function createEditorFile(fileStore: {
    [k: string]: string | [string, string, string];
} | {
    _active: string | number;
}, activeTabName: string): void;
export const cssKeyWords: string[];
