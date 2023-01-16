var pageBuilder=function(e){"use strict";const t={set:document.location.origin+(~document.location.host.indexOf("3000")?"/build/_preact.js":"/static/js/compiler_libs/_preact.js")},o={link:"https://unpkg.com/@babel/standalone/babel.min.js",mode:' type="text/babel" '},l={vanile:void 0,preact:[o.link].concat(Object.values(t)),vue:Object.values({vue:"https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.14/vue.min.js"}),react:[o.link].concat(Object.values({react:"https://unpkg.com/react@17/umd/react.production.min.js",reactDOM:"https://unpkg.com/react-dom@17/umd/react-dom.production.min.js"}))};function n(e){return(e.match(/function ([\w\d_]+)\s?\(/gm)||[]).map((e=>e.split(" ")[1].replace("(","").trim())).map((e=>"globalThis."+e+" = "+e)).join(";\n")}const i=sessionStorage;const a=(e,...t)=>e.reduce(((e,o,l)=>e+t[l-1]+o));HTMLElement,document.body.insertAdjacentHTML("afterbegin",a`
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
                        padding-left: 0;
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
                        background: url(/static/images/check_mark.svg) no-repeat;
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
        `);const r=["html","css","javascript"],c={editors:[],iframe:null,curUrl:null,fileStorage:{_active:0},modes:null,onfilerename:null,onfileRemove:null};function s(e,t,o,l){if((c.fileStorage||window.fileStore)&&c.editors){const e=c.fileStorage||window.fileStore;document.querySelector(".tabs .tab.active"),e&&(e[e.innerText]=c.editors[2].getValue())}let i=c.fileStorage||window.fileStore||{},a=i["app.js"]||i["app.ts"]||c.fileStorage[void 0];const d=function(e){let t=e.match(/\/\* ([\w \n]+) \*\//);return t?t.pop():null}(a);if(d){var u=c.modes&&c.modes[2]&&c.modes[2][d];if(u&&u.src&&"self"===u.target){let n=u.src.split("/").pop().split(".").shift(),i=document.getElementById(n);if(!i){i=document.createElement("script"),i.src=u.src,i.id=n,i.onload=()=>{if(a.parentElement.removeChild(a),l&&l.onload){let n=s(e,t,o);l.onload(...n)}},document.head.appendChild(i);let a=document.querySelector(".view").appendChild(document.createElement("div"));if(a.innerText="Ожидание...",a.id="view__waiting",l&&l.onload)return}}}const m=c.editors,g=["body","style","script"],p={script:o};c.modes&&c.modes.length&&c.editors.forEach(((e,o)=>{let l=e.container.querySelector("choice-menu");if(l){let e=c.modes[o][l.selectedElement.innerText];if(e&&([].slice.call("string"==typeof e.src?[e.src]:e.src).forEach((e=>t.push(e))),window.__debug&&console.log(t)),e&&e.target){if(e.target.tag&&(g[o]=e.target.tag),e.target.inside){let t=new Blob([m[o].getValue()],{type:"text/"+r[o]}),l=URL.createObjectURL(t);e.target.attributes=e.target.attributes.replace(/href\="[\:\w\d-\{\}/\.]+"/,'href="'+l+'"'),window.__debug&&console.log(l)}e.target.attributes&&(p[g[o]]=e.target.attributes)}}}));let f=g.reduce(((e,t,l,i)=>(e[t]=l<2?~["link"].indexOf(t)?null:m[l].getValue():(e=>{window.simplestBundler?(e=window.simplestBundler.default(e,c.fileStorage||window.fileStore),globalThis.__debug&&console.log("build...")):console.warn("bundler is absent"),u&&u.compileFunc&&(e=u.compileFunc(e));let t=n(e);e='window.addEventListener("'+(o?"load":"DOMContentLoaded")+'", function(){'+e+"\n\n"+t+"\n});";const l=document.querySelector(".console .lines");if(l){function i(e){window.parent.document.querySelector(".console .lines").appendChild(document.createElement("div")).innerText="object"==typeof e?JSON.stringify(e):e,globalThis.__debug&&console.log([].slice.call(arguments).join())}l.innerHTML="",e=i.toString()+"\n\n"+e.replace(/globalThis.__debug && console.log/g,"customLOG")}return e})(a||m[l].getValue()),e)),{}),b="";if(t&&t.length)for(let e=0;e<t.length;e++)b+='<script src="'+t[e]+'"><\/script>';window.__debug&&console.log("htmlContent",f);let h=function({body:e,style:t,script:o,link:l},n){return function e(t){let o="";for(const l in t){let i=n[l]||"",a=typeof t[l]==typeof t?e(t[l]):t[l]||"";o+=null!==a?"<"+l+i+">"+a+"</"+l+">":"<"+l+i+"/>"}return o}({html:{head:{style:t,script:o,link:l},body:e}})}(f,p);globalThis.__debug&&console.log(b),h=h.replace("</head>",b+"</head>"),h=h.replace("<head>",'<head><meta charset="UTF-8">');let y=new Blob([h],{type:"text/html"});e&&URL.revokeObjectURL(e);let v=URL.createObjectURL(y),w=document.querySelector(".view");c.iframe&&c.iframe.parentElement===w&&w.removeChild(c.iframe);let _=document.createElement("iframe");return _.src=v,w.appendChild(_),[_,v]}return e.babelCompiler=o,e.compilers=l,e.createPage=s,e.playgroundObject=c,e.webCompile=function(e,t){globalThis.__debug&&console.log("compile");let l=c.iframe,n=c.editors;const a=c.fileStorage||window.fileStore;if(Object.keys(a||{}).length){let e=document.querySelector(".tabs .tab.active");e&&(a[e.innerText]=n[2].getValue())}l.contentDocument;{let[l,n]=s(c.curUrl,t,e?o.mode:void 0);c.iframe=l,c.curUrl=n}let r=Number.parseInt((i||localStorage).getItem("mode")||"0");(i||localStorage).setItem(r+"__html",n[0].getValue()),(i||localStorage).setItem(r+"__css",n[1].getValue()),(i||localStorage).setItem(r+"__javascript",n[2].getValue());let d={};if(console.log("save modules..."),a&&Object.keys(a).length>1){for(let e=0;e<Object.keys(a).length;e++){const t=Object.keys(a)[e];t.startsWith("_")||(d[t]=a[t])}(i||localStorage).setItem("_modules",JSON.stringify(d)),globalThis.__debug&&console.log("save modules...")}},Object.defineProperty(e,"__esModule",{value:!0}),e}({});
//# sourceMappingURL=page_compiler.js.map
