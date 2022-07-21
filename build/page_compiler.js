var pageBuilder = (function (exports) {
    'use strict';

    //@ts-check




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

        let globalInit = (code.match(/function ([\w\d_]+)\s?\(/gm) || [])
            .map(it => it.split(' ')[1].replace('(', '').trim())
            .map(it => 'globalThis.' + it + ' = ' + it).join(';\n');

        return globalInit;
    }


    const isPaired = (/** @type {string} */ tag) => !~['link'].indexOf(tag);

    //@ts-check

    const commonStorage = sessionStorage;



    /**
     * @param {string} code
     * @returns {string|null}
     */
    function getLangMode(code)
    {
        let langModeMatch = code.match(/\/\* ([\w \n]+) \*\//);

        return langModeMatch
            ? langModeMatch.pop()
            : null;
    }

    const html = (/** @type {ReadonlyArray<string>} */ text, /** @type {any[]} */ ...args) => text.reduce((p, n, i) => p + args[i - 1] + n);

    //@ts-check


    // HTMLElement
    class ChoiceMenu extends HTMLElement {

        itemStyle = ' \
        color: white; \
        background-color: #666; \
        padding: 0.1em 1em 0.1em 2em; \
        margin-top: 1px; \
        text-align: right; \
        position: relative; '


        /** selected element
         * @type {HTMLElement}
         */
        selectedElement = null;

        /** checked mark // only for external slot //
         * @type {HTMLElement}
         */
        checkedElement = null;

        /** ul
         * @type {HTMLUListElement}
         */
        rootElement = null;

        /** selected info
         * @type {{id: string, metaId: string, value: string}}
         */
        checkInfo = null;

        /// 
        //@ts-ignore
        itemInitialize = (/** @type {HTMLLIElement} */ el) => ((el.onclick = (/** @type {Event} */ e) => this.selectedChanged(e)), el.style = this.itemStyle)

        // get rootElement() { return this._rootElement; };
        // set rootElement(v) {
        //     console.log(v);
        //     this._rootElement = v;
        // }

        
        /** 
         * @deprecated
         * @type number
         */
        // @ts-ignore    
        get selectedIndex() {
            let index = [].slice.call(this.rootElement.querySelectorAll('li')).indexOf(this.rootElement.querySelector('.selected'));
            return index;
        };
        

        /**
         * @type string
         */
        // @ts-ignore
        get selectedItem() {
            //@ts-ignore
            // return (this.rootElement.querySelector('.selected') || {}).innerText
            return this.selectedElement.innerText;
        };


        constructor() {
            super();

            /// base vars

            //@ts-ignore
            const rootElement = document.getElementById('choice-menu').content.cloneNode(true);
            this.attachShadow({ mode: 'open' }).appendChild(rootElement);


            // tactic vars

            //
            this.rootElement = this.shadowRoot.querySelector('ul');


            // initialization event
            const self = this; this.shadowRoot.addEventListener("slotchange", function (event) {
                //@ts-ignore
                [self.rootElement] = event.target.assignedElements();
                self.checkedElement = self.shadowRoot.querySelector('.checked');
                [].slice.call(self.rootElement.querySelectorAll('li')).forEach(self.itemInitialize);
            });


            // other events:                    
            this.addEventListener('opened', () => this.pickItem(this.selectedElement));
            this.addEventListener('click', this.visibleChanged);


            /// only default slot:
            this.rootElement.addEventListener('click', this.selectedChanged);
        }


        ///
        visibleChanged() {

            const self = this;
            const opened = this.rootElement.classList.contains('active');

            setTimeout(
                () => {
                    self.rootElement.classList.toggle('active');
                    setTimeout(() => self.checkedElement && self.checkedElement.classList.toggle('active'), +!opened * 200);
                },
                +opened * 150
            );

            this.dispatchEvent(new CustomEvent(opened ? 'closed' : 'opened', { detail: null }));
        }


        /**
         * 
         * @param {HTMLElement} element 
         */
        pickItem(element) {
            setTimeout(() => {
                // console.log(this.checkedElement);

                this.checkedElement.style.top = element.offsetTop + this.offsetHeight + 2 + 'px';
                this.checkedElement.style.right = this.rootElement.offsetWidth - (16 * 4) + 5 + 'px';  // ? 
            });
        }



        /**
         * @param {Event} event
         */
        selectedChanged(event) {
            //@ts-expect-error
            if (event.target.tagName === 'li'.toUpperCase()) {
                
                (this.selectedElement || (this.selectedElement = this.rootElement.querySelector('.selected'))) && this.selectedElement.classList.remove('selected');
                //@ts-expect-error
                (this.selectedElement = event.target).classList.add('selected');

                //@ts-expect-error
                this.checkedElement && this.pickItem(event.target);

                this.dispatchEvent(new CustomEvent("selected_changed", {
                    detail: this.checkInfo = {
                        //@ts-expect-error
                        id: event.target.id,
                        //@ts-expect-error
                        metaId: event.target.dataset.id,
                        //@ts-expect-error
                        value: event.target.innerText,
                    }
                }));
            }
        }

        /**
         * static constructor
         */
        static __contructor = (function () {
            
            document.body.insertAdjacentHTML('afterbegin', html`
            <template id="choice-menu">
                <style>
                    /* slotted need be styled inline */
                    ::slotted(li),
                    li {                
                        color: white;
                        background-color: #666;
                        padding: 0.1em 1em 0.1em 2em;
                        margin-top: 1px;
                        position: relative;
                    }

                    ::slotted(ul), ul{
                        margin: 0;
                        position: absolute;
                        top: 100%;
                        right: .1em;
                        width: max-content;
                        list-style-type: none;
                        transition: .3s;
                        /* display: none; */
                        
                        overflow: hidden;
                        height: 0;
                    }

                    /* стили применяемые к самому  my-paragraph*/
                    :host {
                        margin: 0em;
                        /* margin-right: 2em; */
                        position: relative;
                    }

                    ::slotted(.active), .active{
                        /*display: block !important;*/

                        height: 6em;                        
                        display: block !important;
                    }

                    .selected::after, .checked{
                        content: '';
                        background: url(static/images/check_mark.svg) no-repeat;
                        background-size: contain;
                        width: 1em;
                        height: 2em;
                        position: absolute;
                        left: .5em;
                        top: 0.15em;
                    }

                    .checked{
                        left: auto;
                        /* opacity: 0; */
                        /* transition: opacity .3s ease .3s; */
                        display: none; 
                        z-index: 5;
                    }

                </style>

                <!-- <slot name="text">My default text</slot> -->
                <div class="checked"></div>
                <slot>
                    <ul>
                        <li class="selected">item 1</li>
                        <li>item 2</li>
                    </ul>
                </slot>

            </template>
        `);

        })()

    }

    const modes = [
        'html',
        'css',
        'javascript',
        // 'typescript',
    ];

    // @ts-check

    /**
     * @type {{editors: any[], iframe: any, curUrl: any, fileStorage: object, modes?: [object?, object?, object?]}}
     */
    const playgroundObject = {
        editors: [],
        iframe: null,
        curUrl: null,
        fileStorage: { _active: 0 },
        modes: null
    };


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
        };

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
    function createPage(prevUrl, additionalScripts, scriptType, options) {    
        
        // alert(99)
        if ((playgroundObject.fileStorage || window['fileStore']) && playgroundObject.editors) {
            const fileStorage = playgroundObject.fileStorage || window['fileStore'];
            document.querySelector('.tabs .tab.active');
            // update current tab content:

            if (fileStorage) {
                fileStorage[fileStorage.innerText] = playgroundObject.editors[2].getValue();
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
                let originScript = document.getElementById(scriptID);
                if (!originScript) {
                    originScript = document.createElement('script');
                    //@ts-ignore
                    originScript.src = currentLang.src;
                    originScript.onload = () => {

                        // createPage(prevUrl, additionalScripts, scriptType, options);
                        waiting.parentElement.removeChild(waiting);
                    };
                    document.head.appendChild(originScript);
                    let waiting = document.querySelector('.view').appendChild(document.createElement('div'));
                    waiting.innerText = 'Ожидание...';
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
            let globalReinitializer = generateGlobalInintializer(code);

            return 'window.addEventListener("' + (scriptType ? 'load' : 'DOMContentLoaded') + '", function(){' + code + '\n\n' + globalReinitializer + '\n});';
        };


        // при concat все равно скопируется
        // additionalScripts = additionalScripts.slice()
        
        
        const editors = playgroundObject.editors;
        const baseTags = ['body', 'style', 'script'];
        const attrs = {
            script: scriptType
        };


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
                let actualMode = playgroundObject.modes[i][modeMenu.selectedElement.innerText];
                if (actualMode) {                
                    additionalScripts = (additionalScripts || []).concat(typeof actualMode.src === 'string' ? [actualMode.src] : actualMode.src);
                }
                
                if (actualMode && actualMode.target) {
                    if (actualMode.target.tag) baseTags[i] = actualMode.target.tag;
                    if (actualMode.target.outline) {
                        // create link
                        let blob = new Blob([editors[i].getValue()], { type: 'text/' + modes[i] });
                        let link = URL.createObjectURL(blob);
                        actualMode.target.attributes = actualMode.target.attributes.replace('{}', link);
                    }
                    if (actualMode.target.attributes) attrs[baseTags[i]] = actualMode.target.attributes;
                }
            }
        });

        
        
        let htmlContent = baseTags.reduce((acc, el, i, arr) => (
            (
                acc[el] = i < 2
                    ? isPaired(el) ? editors[i].getValue() : null
                    : buildJS(appCode || editors[i].getValue())
            ), acc),
            {}
        );

        let optionalScripts = '';
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
        view.appendChild(frame);

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
    function webCompile(jsxMode, compilerModes) {

        console.log('compile');

        // [iframe, curUrl] = createPage(curUrl);
        // console.log(iframe);



        let iframe = playgroundObject.iframe,
            editors = playgroundObject.editors;

        const fileStorage = playgroundObject.fileStorage || window['fileStore'];
        //@ts-ignore
        if (Object.keys(fileStorage || {}).length) fileStorage[document.querySelector('.tabs .tab.active').innerText] = editors[2].getValue();




        if (iframe.contentDocument && !jsxMode && false) {
            
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

            let globalReinitializer = generateGlobalInintializer(code);

            script.innerHTML = '(function(){' + code + ';\n\n' + globalReinitializer + '\n})()';
            iframe.contentDocument.body.appendChild(script);

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

    exports.babelCompiler = babelCompiler;
    exports.compilers = compilers;
    exports.createPage = createPage;
    exports.playgroundObject = playgroundObject;
    exports.webCompile = webCompile;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

})({});
//# sourceMappingURL=page_compiler.js.map
