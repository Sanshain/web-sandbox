// @ts-check

import { generateGlobalInintializer } from "./utils/page_generator";

export const reactCompiler = {
    react: 'https://unpkg.com/react@17/umd/react.production.min.js',
    reactDOM: 'https://unpkg.com/react-dom@17/umd/react-dom.production.min.js',
}

export const preactCompiler = {
    set: './build/_preact.js',

    // preact: 'https://cdnjs.cloudflare.com/ajax/libs/preact/11.0.0-experimental.1/preact.umd.min.js',     // preact
    // hooks: 'https://cdnjs.cloudflare.com/ajax/libs/preact/11.0.0-experimental.1/hooks.umd.min.js',      // hooks
    // compat: 'https://cdnjs.cloudflare.com/ajax/libs/preact/11.0.0-experimental.1/compat.umd.min.js'     // react
}



export const babelCompiler = {
    link: 'https://unpkg.com/@babel/standalone/babel.min.js',
    mode: ' type="text/babel" '
}

// export const reactCompilers = [babelCompiler.link, reactCompiler.react, reactCompiler.reactDOM];
export const reactCompilers = [
    preactCompiler.set,
    babelCompiler.link,
    // reactCompiler.react, reactCompiler.hooks, reactCompiler.compat
];


export const playgroundObject = {
    editors: [],
    iframe: null,
    curUrl: null
}


/**
 * @param {{ [x: string]: string; }} [attrs]
 */
function createHtml({ body, style, script }, attrs) {

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

            let _attrs = attrs[key] || '';
            let content = typeof nodeStruct[key] === typeof nodeStruct
                ? nodeCreate(nodeStruct[key])
                : nodeStruct[key];

            html += '<' + key + _attrs + '>' + content + '</' + key + '>';

        }
        return html;
    }

    return nodeCreate(htmlStruct);

}


/**
 * @param {string} [prevUrl]
 * @returns {[HTMLElement, string]}
 * @param {string | any[]} [additionalScripts]
 * @param {string} [scriptType]
 */
export function createPage(prevUrl, additionalScripts, scriptType) {

    let wrapFunc = (/** @type {string} */ code) => {
        // 
        let globalReinitializer = generateGlobalInintializer(code)

        return 'window.onload = function(){' + code + '\n\n' + globalReinitializer + '\n}';
    }

    let editors = playgroundObject.editors;
    let htmlContent = ['body', 'style', 'script'].reduce((acc, el, i, arr) => ((acc[el] = i < 2 ? editors[i].getValue() : wrapFunc(editors[i].getValue())), acc), {});

    let optionalScripts = ''
    if (additionalScripts && additionalScripts.length) {
        for (let i = 0; i < additionalScripts.length; i++) {
            // htmlContent['body'] += '<script src="' + additionalScripts[i] + '"></script>';
            optionalScripts += '<script src="' + additionalScripts[i] + '"></script>';
        }
    }
    console.log(htmlContent);

    const attrs = {
        script: scriptType
    }

    // @ts-ignore
    let html = createHtml(htmlContent, attrs);

    console.log(optionalScripts);
    html = html.replace('<head>', '<head>' + optionalScripts);
    html = html.replace('<head>', '<head><meta charset="UTF-8">');

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
 * @param {boolean} jsxMode
 */
export function webCompile(jsxMode) {

    // [iframe, curUrl] = createPage(curUrl);
    // console.log(iframe);

    let iframe = playgroundObject.iframe;
    let editors = playgroundObject.editors;

    if (iframe.contentDocument) {

        iframe.contentDocument.body.innerHTML = editors[0].getValue()
        iframe.contentDocument.head.querySelector('style').innerHTML = editors[1].getValue()

        let lastScripts = iframe.contentDocument.querySelectorAll('script');
        lastScripts && lastScripts.length && Array.prototype.slice.call(lastScripts).forEach((/** @type {{ parentElement: { removeChild: (arg: any) => void; }; }} */ element) =>
        {
            element.parentElement.removeChild(element);
        });

        // let script = iframe.contentDocument.body.appendChild(iframe.contentDocument.createElement('script'));

        let script = iframe.contentDocument.createElement('script');

        if (jsxMode) {
            
            let jsxCompiler = iframe.contentDocument.createElement('script');
            jsxCompiler.src = babelCompiler.link;
            iframe.contentDocument.body.appendChild(script);

            script.type = "text/babel";
        }
        let code = editors[2].getValue();

        let globalReinitializer = generateGlobalInintializer(code)

        script.innerHTML = '(function(){' + code + ';\n\n' + globalReinitializer + '\n})()'
        iframe.contentDocument.body.appendChild(script)

        // iframe.contentDocument.head.querySelector('script').innerHTML = editors[2].getValue()
    }
    else {        
        let [iframe, curUrl] = jsxMode ? createPage(playgroundObject.curUrl, reactCompilers, babelCompiler.mode) : createPage(playgroundObject.curUrl);
        playgroundObject.iframe = iframe;
        playgroundObject.curUrl = curUrl;
    }


    localStorage.setItem('html', editors[0].getValue());
    localStorage.setItem('css', editors[1].getValue());
    localStorage.setItem('javascript', editors[2].getValue());
}



