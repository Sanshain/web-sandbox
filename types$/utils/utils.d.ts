/**
 * @param {{ (): unknown }} func
 * @param {number} delay
 */
export function debounce(func: {
    (): unknown;
}, delay: number): () => unknown;
/**
 * extracts lang mode from code text
 *
 * @param {string} code
 * @returns {string|null}
 */
export function getLangMode(code: string): string | null;
/**
 * Extract Ace mode name from playgroundObject.editors[i]
 * @param {number} i
 * @example {'css'|'less'|'scss'|'javascript'|'typescript'|'html'}
 * @return {string}
 */
export function getSelectedModeName(i: number): string;
/**
 * Get file name extension
 * @param {string} name - origin filename
 * @returns {string} - filename extension
 */
export function getExtension(name: string): string;
/**
 * @description Detect single file framework or false (null)
 * @returns {string|null}
 */
export function isSingleFC(): string | null;
/**
 * @description Detect framework name
 * @returns {string}
 */
export function getFrameworkName(): string;
/**
 * @returns {boolean}
 * @param {AceAjax.Editor[]} [editors]
 */
export function isTSMode(editors?: AceAjax.Editor[]): boolean;
/**
 * @param {string} frameworkName - framework name or file name with appropriate extension
 */
export function typeFromExtention(frameworkName: string): string;
/**
 * @param {string} link
 * @param {{ onload?: (this: GlobalEventHandlers, ev: Event) => any; async?: boolean; }} options
 */
export function uploadScript(link: string, options: {
    onload?: (this: GlobalEventHandlers, ev: Event) => any;
    async?: boolean;
}): void;
/**
 * upload scripts
 * @param {string[]} links
 * @param {(this: GlobalEventHandlers, ev: Event) => any} onloaded
 */
export function loadScripts(links: string[], onloaded: (this: GlobalEventHandlers, ev: Event) => any): void;
export const commonStorage: Storage;
