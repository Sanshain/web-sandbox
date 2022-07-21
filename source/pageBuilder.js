// @ts-check

import { babelCompiler, compilers } from "./features/compiler";
import { generateGlobalInintializer, isPaired } from "./utils/page_generator";
import { commonStorage, getLangMode } from './utils/utils';

// TODO REMOVE:
import { ChoiceMenu } from "./ui/ChoiceMenu";
import { modes as baseModes } from "./features/base";


export { compilers, babelCompiler };

/**
 * @type {{editors: any[], iframe: any, curUrl: any, fileStorage: object, modes?: [object?, object?, object?], onfilerename?: Function}}
 */
export const playgroundObject = {
    editors: [],
    iframe: null,
    curUrl: null,
    fileStorage: { _active: 0 },
    modes: null,
    onfilerename: null
}


/**
 * @param {{ [x: string]: string; }} [attrs]
 */
function createHtml({ body, style, script, link }, attrs) {

    // console.log(arguments);

    const htmlStruct = {
        html: {
            head: {
                style,
                script,
                link
            },
            body
        }
    }

    /**
     * @param {{ [x: string]: any; html?: { head: { [x: string]: string; script: string; }; body: any; }; }} nodeStruct
     */
    function nodeCreate(nodeStruct) {

        let html = '';
        for (const key in nodeStruct) {

            let _attrs = attrs[key] || '';
            let content = typeof nodeStruct[key] === typeof nodeStruct
                ? nodeCreate(nodeStruct[key])
                : (nodeStruct[key] || '');

            html += content !== null
                ? ('<' + key + _attrs + '>' + content + '</' + key + '>')
                : ('<' + key + _attrs + '/>');

        }
        return html;
    }

    return nodeCreate(htmlStruct);
}


/**
 * 
 * TODO: option {simplestBundler, fileStore}
 * 
 * @param {string} [prevUrl]
 * @param {string[]} [additionalScripts]
 * @param {string} [scriptType]
 * @param {object} [options]
 * @returns {[HTMLElement, string]}
 */
export function createPage(prevUrl, additionalScripts, scriptType, options) {    
    
    // alert(99)
    if ((playgroundObject.fileStorage || window['fileStore']) && playgroundObject.editors) {
        const fileStorage = playgroundObject.fileStorage || window['fileStore'];
        let activeTab = document.querySelector('.tabs .tab.active');
        // update current tab content:

        if (fileStorage) {
            fileStorage[fileStorage.innerText] = playgroundObject.editors[2].getValue()
        }        
    }
    
    let _fs = (playgroundObject.fileStorage || window['fileStore'] || {});
    let appCode = _fs['app.js'] || _fs['app.ts'] || playgroundObject.fileStorage[undefined + ''];
    // console.log('appCode');


    const langMode = getLangMode(appCode);
    if (langMode) {

        var currentLang = playgroundObject.modes && playgroundObject.modes[2] && playgroundObject.modes[2][langMode];

        if (currentLang && currentLang.src && currentLang.target === 'self') {
            
            let scriptID = currentLang.src.split('/').pop().split('.').shift();
            let originScript = document.getElementById(scriptID)
            if (!originScript) {
                originScript = document.createElement('script');
                //@ts-ignore
                originScript.src = currentLang.src;
                originScript.onload = () => {

                    // createPage(prevUrl, additionalScripts, scriptType, options);
                    waiting.parentElement.removeChild(waiting);
                }
                document.head.appendChild(originScript);
                let waiting = document.querySelector('.view').appendChild(document.createElement('div'))
                waiting.innerText = 'Ожидание...'
                waiting.id = 'view__waiting';                
                // return;
            }
        }
    }



    let buildJS = (/** @type {string} */ code) => {        

        // convert to js:   


        if (window['simplestBundler']) {
            code = window['simplestBundler'].default(code, playgroundObject.fileStorage || window['fileStore']);
            console.log('build...');
        }
        else {
            console.warn('bundler is absent');
            // alert('Warn/ look logs')
        }        

        // ts transpilation:
        if (currentLang && currentLang.compileFunc) {
            code = currentLang.compileFunc(code);
        }

        // 
        let globalReinitializer = generateGlobalInintializer(code)

        return 'window.addEventListener("' + (scriptType ? 'load' : 'DOMContentLoaded') + '", function(){' + code + '\n\n' + globalReinitializer + '\n});';
    }


    // при concat все равно скопируется
    // additionalScripts = additionalScripts.slice()
    
    
    const editors = playgroundObject.editors;
    const baseTags = ['body', 'style', 'script'];
    const attrs = {
        script: scriptType
    }


    console.log(777777777777777789);

    // compilerSubModes дополняем:
    if (playgroundObject.modes && playgroundObject.modes.length) playgroundObject.editors.forEach((editor, i) => {

        /**
         * @type ChoiceMenu
         */
        let modeMenu = editor.container.querySelector('choice-menu');
        if (modeMenu) {
            /**
             * @type {{src: string|string[], target?: {tag: string, attributes: string, outline?: true}}}
             */
            let actualMode = playgroundObject.modes[i][modeMenu.selectedElement.innerText]
            if (actualMode) {                
                additionalScripts = (additionalScripts || []).concat(typeof actualMode.src === 'string' ? [actualMode.src] : actualMode.src)
            }
            
            if (actualMode && actualMode.target) {
                if (actualMode.target.tag) baseTags[i] = actualMode.target.tag;
                if (actualMode.target.outline) {
                    // create link
                    let blob = new Blob([editors[i].getValue()], { type: 'text/' + baseModes[i] });
                    let link = URL.createObjectURL(blob);
                    actualMode.target.attributes = actualMode.target.attributes.replace('{}', link)
                }
                if (actualMode.target.attributes) attrs[baseTags[i]] = actualMode.target.attributes;
            }
        }
    })

    
    
    let htmlContent = baseTags.reduce((acc, el, i, arr) => (
        (
            acc[el] = i < 2
                ? isPaired(el) ? editors[i].getValue() : null
                : buildJS(appCode || editors[i].getValue())
        ), acc),
        {}
    );

    let optionalScripts = ''
    if (additionalScripts && additionalScripts.length) {
        for (let i = 0; i < additionalScripts.length; i++) {
            // htmlContent['body'] += '<script src="' + additionalScripts[i] + '"></script>';
            optionalScripts += '<script src="' + additionalScripts[i] + '"></script>';
        }
    }
    // console.log(htmlContent);    


    // @ts-ignore
    console.log('html');
    let html = createHtml(htmlContent, attrs);

    console.log(optionalScripts);
    html = html.replace('</head>', optionalScripts + '</head>');
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
 * ///! param {number} compilerMode
 * @param {string[]} compilerModes - 
 * 
 * TODO: options: {storage (localStorage|sessionStorage), fileStore}
 */
export function webCompile(jsxMode, compilerModes) {

    console.log('compile');

    // [iframe, curUrl] = createPage(curUrl);
    // console.log(iframe);



    let iframe = playgroundObject.iframe,
        editors = playgroundObject.editors;

    const fileStorage = playgroundObject.fileStorage || window['fileStore'];
    //@ts-ignore
    if (Object.keys(fileStorage || {}).length) fileStorage[document.querySelector('.tabs .tab.active').innerText] = editors[2].getValue()




    if (iframe.contentDocument && !jsxMode && false) {
        
        iframe.contentDocument.body.innerHTML = editors[0].getValue()
        iframe.contentDocument.head.querySelector('style').innerHTML = editors[1].getValue()

        let lastScript = [].slice.call(iframe.contentDocument.querySelectorAll('script')).pop();
        lastScript && lastScript.parentElement.removeChild(lastScript);

        // let lastScripts = iframe.contentDocument.querySelectorAll('script');
        // lastScripts && lastScripts.length && Array.prototype.slice.call(lastScripts).forEach((/** @type {{ parentElement: { removeChild: (arg: any) => void; }; }} */ element) =>
        // {
        //     element.parentElement.removeChild(element);
        // });
        
        let script = iframe.contentDocument.createElement('script');
        
        console.log(jsxMode)
        console.log(compilerModes);

        if (jsxMode) {
            
            // for (let i = 0; i < compilerMode.length; i++) {
            //     const link = compilerMode[i];

            //     let jsxCompiler = iframe.contentDocument.createElement('script');
            //     jsxCompiler.src = link;
            //     iframe.contentDocument.body.appendChild(jsxCompiler);
            // }

            script.type = "text/babel";
        }

        let code = playgroundObject.fileStorage['app.js'] || playgroundObject.fileStorage['app.ts'] || editors[2].getValue();

        let globalReinitializer = generateGlobalInintializer(code)

        script.innerHTML = '(function(){' + code + ';\n\n' + globalReinitializer + '\n})()'
        iframe.contentDocument.body.appendChild(script)

        // iframe.contentDocument.head.querySelector('script').innerHTML = editors[2].getValue()
    }
    else {
        // console.log(compilerMode);
        // console.log(Object.values(compilers)[compilerMode]);
        // let [iframe, curUrl] = createPage(playgroundObject.curUrl, Object.values(compilers)[compilerMode], jsxMode ? babelCompiler.mode : undefined);
        let [iframe, curUrl] = createPage(playgroundObject.curUrl, compilerModes, jsxMode ? babelCompiler.mode : undefined);
        playgroundObject.iframe = iframe;
        playgroundObject.curUrl = curUrl;
    }




    let compiler = Number.parseInt((commonStorage || localStorage).getItem('mode') || '0');

    // just sandbox feature:
    (commonStorage || localStorage).setItem(compiler + '__html', editors[0].getValue());
    (commonStorage || localStorage).setItem(compiler + '__css', editors[1].getValue());
    (commonStorage || localStorage).setItem(compiler + '__javascript', editors[2].getValue());
    


    let modulesStore = {};


    if (fileStorage && Object.keys(fileStorage).length > 1) {
        
        for (let i = 0; i < Object.keys(fileStorage).length; i++) {
            const fileName = Object.keys(fileStorage)[i];
            if (fileName.startsWith('_')) continue;
            modulesStore[fileName] = fileStorage[fileName];
        }

        // js multitabs:
        (commonStorage || localStorage).setItem('_modules', JSON.stringify(modulesStore));
        console.log('save modules...');
    }

    // document.getElementById('compiler_mode')
}



