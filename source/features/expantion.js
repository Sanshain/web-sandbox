// @ts-check

import { createPage, playgroundObject } from "../pageBuilder";


/**
 * @param {{currentTarget: any;}} event
 * @param {string[]} [additionalScripts]
 * @param {string} [scriptType]
 */
export function expand(event, additionalScripts, scriptType) {

    let [iframe, curUrl] = createPage(playgroundObject.curUrl, additionalScripts, scriptType);

    playgroundObject.iframe = iframe;
    playgroundObject.curUrl = curUrl;

    const view = document.querySelector('.view');
    // const view = event.currentTarget.parentElement;
    // let iframe = view.querySelector('iframe');
    let wrapper = document.querySelector('.expanded')

    // @ts-ignore
    if (wrapper && wrapper.style.display == 'none') {
        // @ts-ignore
        wrapper.style.display = 'block';
        wrapper.innerHTML = '';
    }
    else if(!wrapper) {
        wrapper = document.body.appendChild(document.createElement('div'));
        wrapper.className = 'expanded';
        // wrapper.tabIndex = '0';
        // wrapper.onkeydown = function escape(event) { }        
    }
    // else if (wrapper) wrapper.innerHTML = '';
    // wrapper.appendChild(iframe.cloneNode(true));
    
    wrapper.appendChild(iframe);    

    let collapseButton = wrapper.appendChild(event.currentTarget);
    collapseButton.classList.add('down');
    collapseButton.dataset.title = 'Collapse'

    collapseButton.onclick = function (event) {

        view.appendChild(iframe);
        view.appendChild(collapseButton);

        collapseButton.classList.remove('down');
        collapseButton.dataset.title = 'Expand'
        collapseButton.onclick = expand;
        // @ts-ignore
        wrapper.style.display = 'none';
    }
}
