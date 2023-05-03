//@ts-check

import { runSvelteApp } from "svelte-compiler/build/svelte_compiler.es";

// export default runSvelteApp;

console.warn("888");
const transformedCodeJar = document.querySelector('script[type="text/svelte"]');
if (transformedCodeJar) {
  try {
    console.log("777777777777777777-8");
    runSvelteApp(transformedCodeJar.textContent, {byTag: true, cleanBlock: true});
    console.log("777777777777777777+8");
  } catch (er) {
    console.warn(er);
    window.postMessage(er, "*");
  }
}

window.addEventListener("onload", function (params) {
  alert(99);
  window.onmessage = function (ev) {
    console.log(arguments);
    console.log(ev, ev.data);
  };
});
