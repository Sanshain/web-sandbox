//@ts-check

// import { svelteTransform as transform, mergeSvelteMaps as mergeMaps } from "svelte-compiler";
import { svelteTransform, mergeSvelteMaps } from "svelte-compiler";
// export { svelteTransform, mergeSvelteMaps }

export const transform = svelteTransform;
export const mergeMaps = mergeSvelteMaps;

// export { svelteTransform as transform, mergeSvelteMaps as mergeMaps } from "svelte-compiler";
// export { svelteTransform as transform, mergeSvelteMaps as mergeMaps }

/**
 * @type {(rawCode: string, getFile: (arg: string) => string) => {code: string, matches?: any[]}}
 */
// export default svelteTransform;

// export { transform, mergeMaps }