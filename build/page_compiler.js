var pageBuilder = (function (exports) {
    'use strict';

    const reactCompiler = {
        react: 'https://unpkg.com/react@17/umd/react.production.min.js',
        reactDOM: 'https://unpkg.com/react-dom@17/umd/react-dom.production.min.js',
    };

    const vueCompiler = {
        // vue: "https://unpkg.com/vue@2.5.17/dist/vue.js"
        vue: 'https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.14/vue.min.js'
    };

    const preactCompiler = {
        // set: './build/_preact.js',
        // set: '~/build/_preact.js',

        // preact: 'https://cdnjs.cloudflare.com/ajax/libs/preact/11.0.0-experimental.1/preact.umd.min.js',     // preact
        // hooks: 'https://cdnjs.cloudflare.com/ajax/libs/preact/11.0.0-experimental.1/hooks.umd.min.js',      // hooks
        // compat: 'https://cdnjs.cloudflare.com/ajax/libs/preact/11.0.0-experimental.1/compat.umd.min.js'     // react

        // set: 'http://127.0.0.1:3000/build/_preact.js',

        set: document.location.origin + (~document.location.host.indexOf('3000') ? '/build/_preact.js' : '/static/js/compiler_libs/_preact.js'),
    };


    const babelCompiler = {
        link: 'https://unpkg.com/@babel/standalone/babel.min.js',
        mode: ' type="text/babel" '
    };


    // export const reactCompilers = [babelCompiler.link, reactCompiler.react, reactCompiler.reactDOM];

    // export const reactCompilers = [
    //     preactCompiler.set,
    //     babelCompiler.link,
    // ];

    // export const reactCompilers = [
    //     vueCompiler.vue
    // ];


    const compilers = {
        vanile: undefined,
        preact: [babelCompiler.link].concat(Object.values(preactCompiler)),
        vue: Object.values(vueCompiler),
        react: [babelCompiler.link].concat(Object.values(reactCompiler)),    
    };

    /**
     * initialize global funcs in the sandbox
     * 
     * (обработчики событий, назначенных в атрибутах, должны быть глобальными. Назначаем их глобальными здесь)
     * 
     * @param {*} code 
     * @returns 
     */
    function generateGlobalInintializer(code) {
        let globalInit = (code.match(/^function ([\w\d_]+) ?\(/gm) || [])
            .map(it => it.split(' ').pop().slice(0, -1).trim())
            .map(it => 'globalThis.' + it + ' = ' + it).join(';\n');

        return globalInit;
    }

    // @ts-check


    const playgroundObject = {
        editors: [],
        iframe: null,
        curUrl: null
    };


    /**
     * @param {{ [x: string]: string; }} [attrs]
     */
    function createHtml({ body, style, script }, attrs) {

        // console.log(arguments);

        const htmlStruct = {
            html: {
                head: {
                    style,
                    script
                },
                body
            }
        };

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
     * 
     * TODO: option {simplestBundler, fileStore}
     * 
     * @param {string} [prevUrl]
     * @returns {[HTMLElement, string]}
     * @param {string | any[]} [additionalScripts]
     * @param {string} [scriptType]
     * @param {object} [options]
     */
    function createPage(prevUrl, additionalScripts, scriptType, options) {

        let wrapFunc = (/** @type {string} */ code) => {        

            if (window['simplestBundler']) {
                code = window['simplestBundler'].default(code, window['fileStore']);
                console.log('build...');
            }
            else {
                console.warn('bundler is absent');
                alert('Warn/ look logs');
            }

            // 
            let globalReinitializer = generateGlobalInintializer(code);

            return 'window.onload = function(){' + code + '\n\n' + globalReinitializer + '\n}';
        };

        let editors = playgroundObject.editors;
        let htmlContent = ['body', 'style', 'script'].reduce((acc, el, i, arr) => ((acc[el] = i < 2 ? editors[i].getValue() : wrapFunc(editors[i].getValue())), acc), {});

        let optionalScripts = '';
        if (additionalScripts && additionalScripts.length) {
            for (let i = 0; i < additionalScripts.length; i++) {
                // htmlContent['body'] += '<script src="' + additionalScripts[i] + '"></script>';
                optionalScripts += '<script src="' + additionalScripts[i] + '"></script>';
            }
        }
        // console.log(htmlContent);    

        const attrs = {
            script: scriptType
        };

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
        view.appendChild(frame);

        return [frame, url]
    }


    /**
     * // @param {(url: string) => [HTMLIFrameElement, string]} [createPageFunc]
     * @param {boolean} jsxMode
     * ///! param {number} compilerMode
     * @param {string[]} compilerMode
     * 
     * TODO: options: {storage (localStorage|sessionStorage), fileStore}
     */
    function webCompile(jsxMode, compilerMode) {
        
        console.log('compile');

        // [iframe, curUrl] = createPage(curUrl);
        // console.log(iframe);

        let iframe = playgroundObject.iframe;
        let editors = playgroundObject.editors;

        if (iframe.contentDocument && !jsxMode) {

            iframe.contentDocument.body.innerHTML = editors[0].getValue();
            iframe.contentDocument.head.querySelector('style').innerHTML = editors[1].getValue();

            let lastScript = [].slice.call(iframe.contentDocument.querySelectorAll('script')).pop();
            lastScript && lastScript.parentElement.removeChild(lastScript);

            // let lastScripts = iframe.contentDocument.querySelectorAll('script');
            // lastScripts && lastScripts.length && Array.prototype.slice.call(lastScripts).forEach((/** @type {{ parentElement: { removeChild: (arg: any) => void; }; }} */ element) =>
            // {
            //     element.parentElement.removeChild(element);
            // });
            
            let script = iframe.contentDocument.createElement('script');
            
            console.log(jsxMode);
            console.log(compilerMode);

            if (jsxMode) {
                
                // for (let i = 0; i < compilerMode.length; i++) {
                //     const link = compilerMode[i];

                //     let jsxCompiler = iframe.contentDocument.createElement('script');
                //     jsxCompiler.src = link;
                //     iframe.contentDocument.body.appendChild(jsxCompiler);
                // }

                script.type = "text/babel";
            }

            let code = editors[2].getValue();

            let globalReinitializer = generateGlobalInintializer(code);

            script.innerHTML = '(function(){' + code + ';\n\n' + globalReinitializer + '\n})()';
            iframe.contentDocument.body.appendChild(script);

            // iframe.contentDocument.head.querySelector('script').innerHTML = editors[2].getValue()
        }
        else {
            // console.log(compilerMode);
            // console.log(Object.values(compilers)[compilerMode]);
            // let [iframe, curUrl] = createPage(playgroundObject.curUrl, Object.values(compilers)[compilerMode], jsxMode ? babelCompiler.mode : undefined);
            let [iframe, curUrl] = createPage(playgroundObject.curUrl, compilerMode, jsxMode ? babelCompiler.mode : undefined);
            playgroundObject.iframe = iframe;
            playgroundObject.curUrl = curUrl;
        }

        let compiler = Number.parseInt(localStorage.getItem('mode') || '0');

        localStorage.setItem(compiler + '__html', editors[0].getValue());
        localStorage.setItem(compiler + '__css', editors[1].getValue());
        localStorage.setItem(compiler + '__javascript', editors[2].getValue());
        
        const fileStorage = window['fileStore'];
        let modulesStore = {};

        //@ts-ignore
        fileStorage[document.querySelector('.tabs .tab.active').innerText] = editors[2].getValue();

        if (fileStorage && Object.keys(fileStorage).length > 1) {
            
            for (let i = 0; i < Object.keys(fileStorage).length; i++) {
                const fileName = Object.keys(fileStorage)[i];
                if (fileName.startsWith('_')) continue;
                modulesStore[fileName] = fileStorage[fileName];
            }

            localStorage.setItem('_modules', JSON.stringify(modulesStore));
            console.log('save modules...');
        }

        // document.getElementById('compiler_mode')
    }

    exports.babelCompiler = babelCompiler;
    exports.compilers = compilers;
    exports.createPage = createPage;
    exports.playgroundObject = playgroundObject;
    exports.webCompile = webCompile;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

})({});
//# sourceMappingURL=page_compiler.js.map
