//@ts-check

// TODO less size:
import { runSvelteApp } from "svelte-compiler";

// export default runSvelteApp;

const transformedCodeJar = document.querySelector('script[type="text/svelte"]');
if (transformedCodeJar) {
   try {
      // debugger;
      runSvelteApp(transformedCodeJar.textContent || '', { byTag: true, cleanBlock: true, iifed: true });
   } catch (er) {
      console.warn(er);
      window.postMessage(er, "*");
   }
}

window.onmessage = function (ev) {

   console.log(arguments);
   console.log(ev, ev.data);
};
