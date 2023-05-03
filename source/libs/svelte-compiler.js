//@ts-check

import { svelteTransform } from "svelte-compiler/build/svelte_compiler.es";

/**
 * @type {(rawCode: string, getFile: (arg: string) => string) => {code: string, matches?: any[]}}
 */
export default svelteTransform;

