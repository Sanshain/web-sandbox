/**
 * creates and save file
 * @param {{ innerText: string; }} newTab - contains filename to clean it
 * @param {{ innerText: string; }} origTab - contains fileName, which one will saved via this func
 */
export function createAndSaveFile(newTab: {
    innerText: string;
}, origTab: {
    innerText: string;
}): void;
/**
 * save file to fileStorage from editors
 * @param {string} fileName
 * @param {import("../../aceInitialize").EditorsEnv | []} [editors]
 */
export function saveFile(fileName: string, editors?: import("../../aceInitialize").EditorsEnv | []): string | string[];
/**
 * @param {string} fileName
 * @param {string | string[]} value
 * @param {number} [i]
 */
export function saveScript(fileName: string, value: string | string[], i?: number): void;
/**
 * @param {string} activeTabName
 */
export function readFromFile(activeTabName: string): string;
/**
 * @description fs virtual name for the global markup and style (used just for SFC)
 */
export const globalStore: "$global";
