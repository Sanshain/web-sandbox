//@ts-check

import { runSvelteApp } from "svelte-compiler/build/svelte_compiler.es";

// export default runSvelteApp;

const transformedCodeJar = document.querySelector('script[type="text/svelte"]');
if (transformedCodeJar) {
   try {
      runSvelteApp(transformedCodeJar.textContent, { byTag: true, cleanBlock: true });
   } catch (er) {
      console.warn(er);
      window.postMessage(er, "*");
   }
}

window.onmessage = function (ev) {

   console.log(arguments);
   console.log(ev, ev.data);
};
