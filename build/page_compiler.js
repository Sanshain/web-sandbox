var pageBuilder=function(e){"use strict";const t={set:document.location.origin+(~document.location.host.indexOf("3000")?"/build/_preact.js":"/static/js/compiler_libs/_preact.js")},o={link:"https://unpkg.com/@babel/standalone/babel.min.js",mode:' type="text/babel" '},l={vanile:[],preact:[o.link].concat(Object.values(t)),vue:Object.values({vue:"https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.14/vue.min.js"}),react:[o.link].concat(Object.values({react:"https://unpkg.com/react@17/umd/react.production.min.js",reactDOM:"https://unpkg.com/react-dom@17/umd/react-dom.production.min.js"}))};function n(e){return(e.match(/function ([\w\d_]+)\s?\(/gm)||[]).map((e=>e.split(" ")[1].replace("(","").trim())).map((e=>"globalThis."+e+" = "+e)).join(";\n")}const i=sessionStorage;function a(e){let t=e.match(/\/\* ([\w \n]+) \*\//);return t?t.pop():null}const s=(e,...t)=>e.reduce(((e,o,l)=>e+t[l-1]+o));HTMLElement,document.body.insertAdjacentHTML("afterbegin",s`
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
        `);const r=["html","css","javascript"],c={editors:[],iframe:null,curUrl:null,fileStorage:{_active:0},modes:null,onfilerename:null,onfileRemove:null};function d(e,t,o,l){if((c.fileStorage||window.fileStore)&&c.editors){const e=c.fileStorage||window.fileStore;document.querySelector(".tabs .tab.active"),e&&(e[e.innerText]=c.editors[2].getValue())}let i=c.fileStorage||window.fileStore||{},s=i["app.js"]||i["app.ts"]||c.fileStorage[void 0];const m=a(s);if(m){var g=c.modes&&c.modes[2]&&c.modes[2][m];if(g&&g.src&&"self"===g.target){let n=g.src.split("/").pop().split(".").shift(),i=document.getElementById(n);if(!i){i=document.createElement("script"),i.src=g.src,i.id=n,i.onload=()=>{if(a.parentElement.removeChild(a),l&&l.onload){let n=d(e,t,o);l.onload(...n)}},document.head.appendChild(i);let a=document.querySelector(".view").appendChild(document.createElement("div"));if(a.innerText="Ожидание...",a.id="view__waiting",l&&l.onload)return}}}const p=c.editors,f=["body","style","script"],b={script:o};c.modes&&c.modes.length&&c.editors.forEach(((e,o)=>{let l=e.container.querySelector("choice-menu");if(l){let e=c.modes[o][l.selectedElement.innerText];if(e&&([].slice.call("string"==typeof e.src?[e.src]:e.src).forEach((e=>t.push(e))),window.__debug&&console.log(t)),e&&e.target){if(e.target.tag&&(f[o]=e.target.tag),e.target.inside){let t=new Blob([p[o].getValue()],{type:"text/"+r[o]}),l=URL.createObjectURL(t);e.target.attributes=e.target.attributes.replace(/href\="[\:\w\d-\{\}/\.]+"/,'href="'+l+'"'),window.__debug&&console.log(l)}e.target.attributes&&(b[f[o]]=e.target.attributes)}}}));let h=f.reduce(((e,t,l,i)=>(e[t]=l<2?~["link"].indexOf(t)?null:p[l].getValue():(e=>{let t=n(e=u(e,g));e='window.addEventListener("'+(o?"load":"DOMContentLoaded")+'", function(){'+e+"\n\n"+t+"\n});";const l=document.querySelector(".console .lines");if(l){function loclog(e){window.parent.postMessage({value:String.fromCharCode(8250)+" "+e,type:typeof e},"*"),console.log([].slice.call(arguments).join())}function onmessage(e){if("string"==typeof e.data){let t={type:"string"};try{t.value=globalThis.eval(e.data)}catch(e){t.value=t.error="> "+e.stack.split(":").shift()+": "+e.message}let o="";"object"==typeof t.value&&(o=~t.value.toString().indexOf("HTML")?t.value.toString():JSON.stringify(t.value),console.log(o)),console.log(t),window.parent.postMessage(t,"*")}}l.innerHTML="";const i="window.addEventListener('message', "+onmessage.toString()+");";e="\n"+loclog.toString()+"\n"+i+"\n\n"+e.replace(/console\.(log|warn)/g,"loclog")}return e})(s||p[l].getValue()),e)),{}),y="";if(t&&t.length)for(let e=0;e<t.length;e++)y+='<script src="'+t[e]+'"><\/script>';window.__debug&&console.log("htmlContent",h);let v=function({body:e,style:t,script:o,link:l},n){return function e(t){let o="";for(const l in t){let i=n[l]||"",a=typeof t[l]==typeof t?e(t[l]):t[l]||"";o+=null!==a?"<"+l+i+">"+a+"</"+l+">":"<"+l+i+"/>"}return o}({html:{head:{style:t,script:o,link:l},body:e}})}(h,b);globalThis.__debug&&console.log(y),v=v.replace("</head>",y+"</head>"),v=v.replace("<head>",'<head><meta charset="UTF-8">');let w=new Blob([v],{type:"text/html"});e&&URL.revokeObjectURL(e);let S=URL.createObjectURL(w),_=document.querySelector(".view");c.iframe&&c.iframe.parentElement===_&&_.removeChild(c.iframe);let j=document.createElement("iframe");return j.sandbox.add("allow-scripts"),j.sandbox.add("allow-modals"),j.src=S,_.appendChild(j),[j,S]}function u(e,t){return window.simplestBundler?(e=window.simplestBundler.default(e,c.fileStorage||window.fileStore),globalThis.__debug&&console.log("build...")):console.warn("bundler is absent"),t&&t.compileFunc&&(e=t.compileFunc(e)),e}return e.babelCompiler=o,e.compilers=l,e.createPage=d,e.playgroundObject=c,e.webCompile=function(e,t,l){globalThis.__debug&&console.log("compile");let s=c.iframe,r=c.editors;const m=c.fileStorage||window.fileStore;if(Object.keys(m||{}).length){let e=document.querySelector(".tabs .tab.active");e&&(m[e.innerText]=r[2].getValue())}if(s.contentDocument&&l){s.contentDocument.body.innerHTML=r[0].getValue(),s.contentDocument.head.querySelector("style").innerHTML=r[1].getValue();let o=[].slice.call(s.contentDocument.querySelectorAll("script")).pop();o&&o.parentElement.removeChild(o);let l=s.contentDocument.createElement("script");globalThis.__debug&&console.log("less compilation"),globalThis.__debug&&console.log(e),globalThis.__debug&&console.log(t),e&&(l.type="text/babel");let i=c.fileStorage["app.js"]||c.fileStorage["app.ts"]||r[2].getValue();i=u(i,c.modes&&c.modes[2]&&c.modes[2][function(){let e=c.fileStorage||window.fileStore||{},t=e["app.js"]||e["app.ts"]||c.fileStorage[void 0];return a(t)}()]);let d=n(i);l.innerHTML="(function(){"+i+";\n\n"+d+"\n})()",s.contentDocument.body.appendChild(l)}else{let[l,n]=d(c.curUrl,t,e?o.mode:void 0);c.iframe=l,c.curUrl=n}let g=Number.parseInt((i||localStorage).getItem("mode")||"0");(i||localStorage).setItem(g+"__html",r[0].getValue()),(i||localStorage).setItem(g+"__css",r[1].getValue()),(i||localStorage).setItem(g+"__javascript",r[2].getValue());let p={};if(console.log("save modules..."),m&&Object.keys(m).length>1){for(let e=0;e<Object.keys(m).length;e++){const t=Object.keys(m)[e];t.startsWith("_")||(p[t]=m[t])}(i||localStorage).setItem("_modules",JSON.stringify(p)),globalThis.__debug&&console.log("save modules...")}},Object.defineProperty(e,"__esModule",{value:!0}),e}({});
//# sourceMappingURL=page_compiler.js.map
