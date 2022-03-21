// @ts-check

import { generateGlobalInintializer } from "./utils/page_generator";


export const playgroundObject = {
    editors: [],
    iframe: null,
    curUrl: null
}


function createHtml({ body, style, script }) {

    console.log(arguments);

    const htmlStruct = {
        html: {
            head: {
                style,
                script
            },
            body
        }
    }

    /**
     * @param {{ [x: string]: any; html?: { head: { style: any; script: any; }; body: any; }; }} nodeStruct
     */
    function nodeCreate(nodeStruct) {

        let html = '';
        for (const key in nodeStruct) {

            let content = typeof nodeStruct[key] === typeof nodeStruct
                ? nodeCreate(nodeStruct[key])
                : nodeStruct[key];

            html += '<' + key + '>' + content + '</' + key + '>';

        }
        return html;
    }

    return nodeCreate(htmlStruct);

}


/**
 * @param { string } [prevUrl]
 * @returns {[ HTMLElement, string ]}
 */
export function createPage(prevUrl) {

    let wrapFunc = (/** @type {string} */ code) => {
        // 
        let globalReinitializer = generateGlobalInintializer(code)

        return 'window.onload = function(){' + code + '\n\n' + globalReinitializer + '\n}';
    }

    let editors = playgroundObject.editors;
    let htmlContent = ['body', 'style', 'script'].reduce((acc, el, i, arr) => ((acc[el] = i < 2 ? editors[i].getValue() : wrapFunc(editors[i].getValue())), acc), {});
    // @ts-ignore
    let html = createHtml(htmlContent);

    let file = new Blob([html], { type: 'text/html' });

    prevUrl && URL.revokeObjectURL(prevUrl);
    let url = URL.createObjectURL(file);

    let view = document.querySelector('.view');
    playgroundObject.iframe && (playgroundObject.iframe.parentElement === view) && view.removeChild(playgroundObject.iframe);
    // view.innerHTML = '';    

    let frame = document.createElement('iframe');
    frame.src = url;
    view.appendChild(frame)

    return [frame, url]
}


/**
 * // @param {(url: string) => [HTMLIFrameElement, string]} [createPageFunc]
 */
export function webCompile() {

    // [iframe, curUrl] = createPage(curUrl);
    // console.log(iframe);

    let iframe = playgroundObject.iframe;
    let editors = playgroundObject.editors;

    if (iframe.contentDocument) {

        iframe.contentDocument.body.innerHTML = editors[0].getValue()
        iframe.contentDocument.head.querySelector('style').innerHTML = editors[1].getValue()

        let lastScript = iframe.contentDocument.querySelector('script')
        lastScript && lastScript.parentElement.removeChild(lastScript);

        // let script = iframe.contentDocument.body.appendChild(iframe.contentDocument.createElement('script'));

        let script = iframe.contentDocument.createElement('script');
        let code = editors[2].getValue();

        let globalReinitializer = generateGlobalInintializer(code)

        script.innerHTML = '(function(){' + code + ';\n\n' + globalReinitializer + '\n})()'
        iframe.contentDocument.body.appendChild(script)

        // iframe.contentDocument.head.querySelector('script').innerHTML = editors[2].getValue()
    }
    else {
        let [iframe, curUrl] = createPage(playgroundObject.curUrl);
        playgroundObject.iframe = iframe;
        playgroundObject.curUrl = curUrl;
    }


    localStorage.setItem('html', editors[0].getValue());
    localStorage.setItem('css', editors[1].getValue());
    localStorage.setItem('javascript', editors[2].getValue());
}



