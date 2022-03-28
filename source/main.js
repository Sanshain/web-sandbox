// @ts-check

import initializeEditor from "./aceInitialize";
import { createPage, webCompile, playgroundObject } from "./pageBuilder";

import { expand } from "./features/expantion";
import { initResizers } from "./features/resizing";
import { babelCompiler, compilers } from "./features/compiler";


// const jsxMode = true;

let syntaxMode = Number.parseInt(localStorage.getItem('mode') || '0');
document.querySelector('select').selectedIndex = syntaxMode;


initResizers()

// @ts-ignore
let compileFunc = syntaxMode ? webCompile.bind(null, syntaxMode > 1, Object.values(compilers)[syntaxMode]) : webCompile;
const modes = ['html', 'css', 'javascript']

// let compileFunc = mode ? webCompile.bind(null, mode > 1, mode) : webCompile;
// console.log(mode);
// console.log(Object.values(compilers)[mode]);

// @ts-ignore
let editors = playgroundObject.editors = initializeEditor(ace, compileFunc, modes, syntaxMode)

let [iframe, curUrl] = createPage(playgroundObject.curUrl, Object.values(compilers)[syntaxMode], syntaxMode > 1 ? babelCompiler.mode : undefined)

playgroundObject.iframe = iframe;
playgroundObject.curUrl = curUrl;


document.querySelector('.play').addEventListener('click', compileFunc);
document.querySelector('.expand')['onclick'] = expand;
document.getElementById('compiler_mode').addEventListener('change', function (event) {
    
    // @ts-ignore
    localStorage.setItem('mode', event.target.selectedIndex)

    // @ts-ignore
    if (event.target.selectedIndex || true) location.reload()
    else {
        for (let i = 0; i < editors.length; i++) {        
            //@ts-ignore
            let value = localStorage.getItem(event.target.selectedIndex + '__' + modes[i]) || '';
            editors[i].session.setValue(value)
        }
        // document.querySelector('.play').click();
    }    

    // localStorage.setItem('mode', event.target.selectedOptions[event.target.selectedIndex].value)
    // console.log(event.target.selectedIndex);
})
