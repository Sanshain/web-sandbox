// @ts-check

import { babelCompiler, compilers, spreadImports } from "./features/compiler";
import { generateGlobalInintializer, isPaired } from "./utils/page_generator";
import { commonStorage, getLangMode } from './utils/utils';
import sass2less from 'less-plugin-sass2less'


// TODO REMOVE:
import { ChoiceMenu } from "./ui/ChoiceMenu";
import { modes as baseModes, modes } from './features/base';


/**
 * @typedef {{
 *      tag?: BaseTags[number], external?: boolean, attributes?: string
 * }} CodeTarget
 * 
 * @typedef {{
 *  src: string|string[], 
 *  inside?: boolean, 
 *  prehandling?: (arg: string) => string, 
 *  target?: CodeTarget
 * }} Mode
 */



export { compilers, babelCompiler };

/**
 * @type {{editors: any[], iframe: any, curUrl: any, fileStorage: object, modes?: [object?, object?, object?], onfilerename?: Function, onfileRemove?: (name: string) => void}}
 */
export const playgroundObject = {
    editors: [],
    iframe: null,
    curUrl: null,
    fileStorage: { _active: 0 },
    modes: null,
    onfilerename: null,
    onfileRemove: null
}

/**
 * @typedef {BaseTags[number] | 'link'} KeyTags
 * @param {{ [k in KeyTags]?: string; }} content - html object content
 * @param {{ [k in KeyTags]?: string; }} attrs - list of accompanying attributes for each tag in html object content (look up htmlStruct)
 */
function createHtml({ body, style, script, link }, attrs) {
    
    // globalThis.__debug && console.log(arguments);

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
* @typedef {['body', 'style', 'script', 'link'?]} BaseTags
 */

/**
 * 
 * TODO: option {simplestBundler, fileStore}
 * 
 * @param {string} [prevUrl] - предыдущий URL для освобождения
 * @param {Array<string|[string]>} [additionalScripts] - дополнительные скрипты, которые будут добавлены на новую страницу (react, vue, preact...). Если массив - это inline script
 * @param {string} [scriptType] - атрибут тега скрипт, который будет добавлен в к тегу script на созданной странице (type=)
 * @param {{
 *  onload: Function,
 * }} [options] - onload callback (may be add previewClass?: string)
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
    // globalThis.__debug && console.log('appCode');


    const langMode = getLangMode(appCode);
    if (langMode) {

        /**
         * @type {Mode}
         */
        var currentLang = playgroundObject.modes && playgroundObject.modes[2] && playgroundObject.modes[2][langMode];

        /// attach to the root page
        /// if (currentLang.inside === false|undefined)
        if (currentLang && currentLang.src && (currentLang.target === 'self' || !currentLang.inside)) {

            // currentLang.target === 'self'        /// script ожидает загрузки скрипта на основную страницу
            
            // TODO fix type: (todo support src array)
            //@ts-ignore 
            let scriptID = currentLang.src.split('/').pop().split('.').shift();
            let originScript = document.getElementById(scriptID)
            if (!originScript) {

                originScript = document.createElement('script');
                //@ts-ignore
                originScript.src = currentLang.src;
                originScript.id = scriptID;
                originScript.onload = () => {                    
                    // createPage(prevUrl, additionalScripts, scriptType, options);
                    waiting.parentElement.removeChild(waiting);
                    if (options && options.onload) {
                        let frameInfo = createPage(prevUrl, additionalScripts, scriptType);
                        options.onload(...frameInfo);
                    }
                }
                document.head.appendChild(originScript);
                let waiting = document.querySelector('.view').appendChild(document.createElement('div'))
                waiting.innerText = 'Ожидание...'
                // waiting.className = options.previewClass || 'waiting';
                waiting.id = 'view__waiting';
                waiting.style.height = waiting.style.lineHeight = waiting.parentElement.offsetHeight - 15 + 'px';
                
                if (options && options.onload) {
                    return;
                }
            }
        }
    }



    let buildJS = (/** @type {string} */ code) => {        

        // convert to js:   

        code = buildAndTranspile(code, currentLang);

        // 
        let globalReinitializer = generateGlobalInintializer(code);

        code = 'window.addEventListener("' + (scriptType ? 'load' : 'DOMContentLoaded') + '", function(){' + code + '\n\n' + globalReinitializer + '\n});';

        // customLOG
        const terminalJar = document.querySelector('.console .lines');
        
        if (terminalJar) {

            terminalJar.innerHTML = '';

            function loclog(/** @type {string} */ value) {

                window.parent.postMessage(
                    // { value: typeof value === 'object' ? JSON.stringify(value) : value, type: typeof value },
                    { value: String.fromCharCode(8250) + ' ' + value, type: typeof value },
                    '*'
                );
                console.log([].slice.call(arguments).join());
            }

            /**
             * @param {{ data: string; }} event
             */
            function onmessage(event) {
                if (typeof event.data == 'string') {

                    let data = {type: 'string'}
                    try {
                        data.value = globalThis.eval(event.data);
                    }
                    catch (e) {
                        data.value = data.error = '> ' + e.stack.split(':').shift() + ': ' + e.message;
                    }

                    if (typeof data.value === 'object') {
                        if (data.value === null) data.value += '';                        
                        else if (~data.value.toString().indexOf('HTML')) data.value = data.value.toString()
                        else {
                            data.value = JSON.stringify(data.value)
                        }
                    }
                    console.log(data);
                    window.parent.postMessage(data, '*')
                }
            }

            const onmessageFunc = "window.addEventListener('message', " + onmessage.toString() + ");"

            code = '\n' + loclog.toString() + '\n' + onmessageFunc + '\n\n' + code.replace(/console\.(log|warn)/g, 'loclog');
        }        

        return code;
    }


    // при concat все равно скопируется
    // additionalScripts = additionalScripts.slice()
    
    
    const editors = playgroundObject.editors;
    /**     
     * @type {BaseTags}
     */
    const baseTags = ['body', 'style', 'script'];
    
    const attrs = {
        script: scriptType
    }

    // compilerSubModes дополняем:
    if (playgroundObject.modes && playgroundObject.modes.length) playgroundObject.editors.forEach((editor, i) => {

        /**
         * @type ChoiceMenu
         */
        let modeMenu = editor.container.querySelector('choice-menu');
        if (modeMenu) {
            /**
             * @type {Mode}
             */
            let actualMode = playgroundObject.modes[i][modeMenu.selectedElement.innerText]            
            if (actualMode && actualMode.inside === true) {
                
                // additionalScripts = (additionalScripts || []).concat(typeof actualMode.src === 'string' ? [actualMode.src] : actualMode.src);
                [].slice.call(typeof actualMode.src === 'string' ? [actualMode.src] : actualMode.src).forEach(el => additionalScripts.push(el));
                // дополнительные скрипты. В частности less
                window['__debug'] && console.log(additionalScripts);
            }

            if (actualMode && actualMode.target) {

                /**
                 * @type {string}
                 */
                let value = editors[i].getValue()

                if (actualMode.inside === true) resourceInject(value, baseModes[i], actualMode, additionalScripts);
                else if (actualMode.inside) {

                    //// only for unsandboxed version (legacy and TODO drop it later)

                    // here constructs tags that will involve right to iframe:                    
                    let blob = new Blob([value], { type: 'text/' + baseModes[i] });

                    /// possibility change style tag to link tag:
                    if (actualMode.target.tag) baseTags[i] = actualMode.target.tag;

                    let link = URL.createObjectURL(blob);

                    // actualMode.target.attributes = actualMode.target.attributes.replace('{}', link)
                    actualMode.target.attributes = actualMode.target.attributes.replace(/href\="[\:\w\d-\{\}/\.]+"/, 'href="' + link + '"')

                    window['__debug'] && console.log(link);
                    
                    if (actualMode.target.attributes) attrs[baseTags[i]] = actualMode.target.attributes;
                }
                
                // window['__debug'] && console.log(baseModes[i]);
            }
        }
    })

    
    /// TODO? @import 'style.css' to style html tag from link file?
    
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
            const additionalScript = additionalScripts[i];
            if (typeof additionalScript == 'string') optionalScripts += '<script src="' + additionalScript + '"></script>';  // defer?
            else if (additionalScript) {
                
                if (Array.isArray(additionalScript) && additionalScript.length === 1 && typeof additionalScript[0] === 'string') {
                    optionalScripts += '<script>' + additionalScript[0] + '</script>';
                }

            }
        }
    }    
    
    window['__debug'] && console.log('htmlContent', htmlContent);

    let html = createHtml(htmlContent, attrs);

    globalThis.__debug && console.log(optionalScripts);
    html = html.replace('</head>', optionalScripts + '</head>');
    html = html.replace('<head>', '<head><meta charset="UTF-8">');

    let file = new Blob([html], { type: 'text/html' });

    prevUrl && URL.revokeObjectURL(prevUrl);
    let url = URL.createObjectURL(file);

    let view = document.querySelector('.view');
    playgroundObject.iframe && (playgroundObject.iframe.parentElement === view) && view.removeChild(playgroundObject.iframe);
    // view.innerHTML = '';    

    let frame = document.createElement('iframe');
    frame.sandbox.add('allow-scripts')
    frame.sandbox.add('allow-modals')

    // делает контекст небезопасным (!)
    // frame.sandbox.add('allow-same-origin')
    frame.src = url;
    view.appendChild(frame)

    return [frame, url]
}


/**
 * @description generate script, which creates virtual resource[s] with value contents based on `baseMode.target` options, 
 * and append it to additionalScripts instead of `src` inject into frame head
 * @param {string} value
 * @param {"html"|"css"|"javascript"} baseMode
 * @param {Mode} actualMode
 * @param {Array<string | [string]>} additionalScripts
 */
function resourceInject(value, baseMode, actualMode, additionalScripts) {

    // createURL from iframe DOM

    /**
     * @type {string}
     */
    let scriptDetails = (function createInsides() {        

        const baseTag = actualMode.target.tag;
        const content = value;
        const isExternalContent = actualMode.target.external;

        /**
         * @description append to frame DOM link to resource
         * @param {string?} link
         * @returns {HTMLElement} - {HTMLLinkElement|HTMLScriptElement|HTMLStyleElement} - (Omit<BaseTags, 'body'> =-> HTMLElement)
         */
        function createElement(link) {
            
            const attributes = actualMode.target.attributes.replace(/(href|src)\="[\:\w\d-\{\}/\.]+"/, '$1="' + link + '"');

            // set id
            let id = (Math.random() + '').slice(2);         // link.split('/').pop() 

            // forming html
            let elemHTML = ('<___ id="' + id + '"' + attributes + (isPaired(baseTag) ? '><___/>' : ' />')).replace(/\<___/g, '<' + baseTag);

            if (!isExternalContent) {
                elemHTML = elemHTML.replace('><' + baseTag + '/>', '>' + content + '<' + baseTag + '/>')
            }

            document.head.insertAdjacentHTML('beforeend', elemHTML);

            return document.getElementById(id);
        }

        if (isExternalContent == false) var elem = createElement(null);
        else {
            // create resource:
            let blob = new Blob([content], { type: 'text/' + baseMode });
            const link = URL.createObjectURL(blob);
            var elem = createElement(link);
        }

        

        // if pair tag with content or not
        const modeSrc = actualMode.src;
        if (!modeSrc) return;

        // upload next script after resource uploading, which handle the resource
        function uploadScripts() {
            
            if (typeof modeSrc === 'string') {
                let script = document.createElement('script');
                script.src = modeSrc;
                document.head.appendChild(script);
            }
            else {

                console.warn('multiple inside. Not tested yet');

                let uploaders = modeSrc.reduce((acc, src, i) => {

                    acc.push(new Promise(function (resolve) {
                        var script = document.createElement('script');
                        script.src = src;
                        document.head.appendChild(script);
                        script.onload = () => resolve(script);
                    }));

                    return acc;

                }, []);

                /// sequence execution
                uploaders.reduce((cur, next) => cur.then(next));
            }
        }

        if (('onload' in elem) && ((baseTag === 'script' && elem['type'] == 'text/javascript')) || !elem['type']) {

            elem.onload = uploadScripts;
        }
        else {
            // console.warn('unsupported inside');
            setTimeout(uploadScripts);
        }


    }).toString()
        .replace('value', '`' + value + '`')
        .replace('actualMode.target.tag', '"' + actualMode.target.tag + '"')
        .replace('baseMode', '"' + baseMode + '"')
        .replace('actualMode.target.attributes', "'" + actualMode.target.attributes + "'")
        .replace('isPaired', '(' + isPaired.toString() + ')')
        .replace('actualMode.target.external', actualMode.target.external + '')
        .replace('actualMode.src', actualMode.src
            ? typeof actualMode.src === 'string'
                ? ('"' + actualMode.src + '"')
                : '["' + actualMode.src.join('", "') + '"]'
            : null);
    
    scriptDetails = '(' + scriptDetails + ')()'

    // remove from additionalScripts because of its unused then
    if (typeof actualMode.src === 'string') {
        let index = additionalScripts.indexOf(actualMode.src);
        if (~index) {
            additionalScripts.splice(index, 1);
        }
    }
    else if (Array.isArray(actualMode.src)) {
        actualMode.src.forEach(src => {
            let index = additionalScripts.indexOf(src);
            if (~index) {
                additionalScripts.splice(index, 1);
            }
        });
    }

    /// inside [] meens its multiply!
    additionalScripts.unshift([scriptDetails]);

}

/**
 * @param {string} code
 * @_param {{ prehandling: (arg0: string) => string; }} currentLang
 * @param {Mode} currentLang
 */
function buildAndTranspile(code, currentLang) {
    if (window['simplestBundler']) {
        code = window['simplestBundler'].default(code, playgroundObject.fileStorage || window['fileStore']);        
        globalThis.__debug && console.log('build...');
    }
    else {
        console.warn('bundler is absent');
        // alert('Warn/ look logs')
    }

    code = spreadImports(code)

    // ts transpilation:
    if (currentLang && currentLang.prehandling) {
        code = currentLang.prehandling(code);
    }
    return code;
}

/**
 * // obsolete @ param {(url: string) => [HTMLIFrameElement, string]} [createPageFunc]
 * @param {boolean} jsxMode ///! param {number} compilerMode
 * @param {string[]} compilerModes - list of script libs to attach to generated page
 *
 * TODO: options: {storage (localStorage|sessionStorage), fileStore}
 * @param {boolean|undefined} [less] - less compile mode (Not implemented yet. TODO: via postMessage)
 */
export function webCompile(jsxMode, compilerModes, less) {

    globalThis.__debug && console.log('compile');

    // [iframe, curUrl] = createPage(curUrl);
    // globalThis.__debug && console.log(iframe);

    

    let iframe = playgroundObject.iframe,
        editors = playgroundObject.editors;

    const fileStorage = playgroundObject.fileStorage || window['fileStore'];
    //@ts-ignore
    if (Object.keys(fileStorage || {}).length) {
        let activeTab = document.querySelector('.tabs .tab.active');
        //@ts-ignore
        if (activeTab) fileStorage[activeTab.innerText] = editors[2].getValue()
        // else {
        //     fileStorage[undefined + ''] = editors[2].getValue()
        // }
    }

    if (iframe.contentDocument && less) {

        //// !with sandbox never will performed. Legacy content:
        
        /**
         * attantion: because from deleted scripts, working handlers may remain on the page, which will spoil the picture 
         * (it may be safe to change styles only or for frameworks that completely overwrite html). With a full html record , it is quite an option
         */

        iframe.contentDocument.body.innerHTML = editors[0].getValue()
        iframe.contentDocument.head.querySelector('style').innerHTML = editors[1].getValue()

        /////// remove last script:

        let lastScript = [].slice.call(iframe.contentDocument.querySelectorAll('script')).pop();
        lastScript && lastScript.parentElement.removeChild(lastScript);

        //////// 

        // let lastScripts = iframe.contentDocument.querySelectorAll('script');
        // lastScripts && lastScripts.length && Array.prototype.slice.call(lastScripts).forEach((/** @type {{ parentElement: { removeChild: (arg: any) => void; }; }} */ element) =>
        // {
        //     element.parentElement.removeChild(element);
        // });
        
        /////////
        
        // [].slice.call(document.querySelector('iframe').contentDocument.getElementsByTagName('script')).pop()

        let script = iframe.contentDocument.createElement('script');
        
        globalThis.__debug && console.log('less compilation')
        globalThis.__debug && console.log(jsxMode)
        globalThis.__debug && console.log(compilerModes);

        if (jsxMode) {
            
            // add additional scripts:

            // for (let i = 0; i < compilerMode.length; i++) {
            //     const link = compilerMode[i];

            //     let jsxCompiler = iframe.contentDocument.createElement('script');
            //     jsxCompiler.src = link;
            //     iframe.contentDocument.body.appendChild(jsxCompiler);
            // }

            script.type = "text/babel";
        }

        let code = playgroundObject.fileStorage['app.js'] || playgroundObject.fileStorage['app.ts'] || editors[2].getValue();

        const currentLang = playgroundObject.modes && playgroundObject.modes[2] && playgroundObject.modes[2][getLang()];
        code = buildAndTranspile(code, currentLang);

        let globalReinitializer = generateGlobalInintializer(code)

        script.innerHTML = '(function(){' + code + ';\n\n' + globalReinitializer + '\n})()';
        iframe.contentDocument.body.appendChild(script)
        // iframe.contentDocument.head.querySelector('script').innerHTML = editors[2].getValue()
    }
    else {
        // globalThis.__debug && console.log(compilerMode);
        // globalThis.__debug && console.log(Object.values(compilers)[compilerMode]);
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

    console.log('save modules...')

    if (fileStorage && Object.keys(fileStorage).length > 1) {
        
        for (let i = 0; i < Object.keys(fileStorage).length; i++) {
            const fileName = Object.keys(fileStorage)[i];
            if (fileName.startsWith('_')) continue;
            modulesStore[fileName] = fileStorage[fileName];
        }

        // js multitabs:
        (commonStorage || localStorage).setItem('_modules', JSON.stringify(modulesStore));
        globalThis.__debug && console.log('save modules...');
    }

    // document.getElementById('compiler_mode')
}



function getLang() {
    let fs = (playgroundObject.fileStorage || window['fileStore'] || {});
    let appCode = fs['app.js'] || fs['app.ts'] || playgroundObject.fileStorage[undefined + ''];
    const langMode = getLangMode(appCode);
    return langMode;
}


