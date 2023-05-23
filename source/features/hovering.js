//@ts-check

/**
 * #param {AceAjax.Editor} editor
 * @param {import("../main").AceEditor} editor
 * @param {{ hoverSelector: string; text: string, className?: string; }} options
 */
export function hoveringInit(editor, options) {   

   editor.container.addEventListener("mouseover", onhover);

   return () => editor.container.removeEventListener('mouseover', onhover);


   /**
    * @param {MouseEvent & { target: HTMLElement; }} event
    */
   function onhover(event) {

      /** @type {HTMLElement} */ 
      const target = event.target

      if (target.classList.contains(options.hoverSelector)) {

         /** @type {{ pageX: number; pageY: number }} */
         const startPoint = editor.renderer.textToScreenCoordinates(0, 0);

         /** @type {{ column: number; row: number }} */ //@ts-expect-error {floating} (types/ace need to be updated)
         let cur = editor.renderer.pixelToScreenCoordinates(event.clientX, event.clientY);

         // const positionIndex = editor.session.doc.positionToIndex(cur);

         /** @type {HTMLElement} */
         const hintElem = editor.container.querySelector('.hint') || editor.container.appendChild(document.createElement("div"));
         
         hintElem.className = 'hint' + ' ' + (options.className || '');
         hintElem.innerHTML = options.text;
         hintElem.style.left = target.getBoundingClientRect().left - 8 + 'px';
         hintElem.style.top = target.getBoundingClientRect().top - startPoint.pageY + 20 + "px";

         target.addEventListener('mouseout', () => {

            // hintElem.style.display = 'none';
            editor.container.removeChild(hintElem);

         }, { once: true });
      }
   }
}