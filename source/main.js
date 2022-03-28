// @ts-check

import initializeEditor from "./aceInitialize";
import { createPage, webCompile, playgroundObject } from "./pageBuilder";

import { expand } from "./features/expantion";
import { initResizers } from "./features/resizing";
import { babelCompiler, compilers } from "./features/compiler";


// const jsxMode = true;

let mode = Number.parseInt(localStorage.getItem('mode'));
document.querySelector('select').selectedIndex = mode;
console.log(mode);

initResizers()

// @ts-ignore
let compileFunc = mode ? webCompile.bind(null, mode > 1, Object.values(compilers)[mode]) : webCompile;

// let compileFunc = mode ? webCompile.bind(null, mode > 1, mode) : webCompile;
// console.log(mode);
// console.log(Object.values(compilers)[mode]);

// @ts-ignore
let editors = playgroundObject.editors = initializeEditor(ace, compileFunc, ['html', 'css', 'javascript'])

let [iframe, curUrl] = createPage(playgroundObject.curUrl, Object.values(compilers)[mode], mode > 1 ? babelCompiler.mode : undefined)

playgroundObject.iframe = iframe;
playgroundObject.curUrl = curUrl;


document.querySelector('.play').addEventListener('click', compileFunc);
document.querySelector('.expand')['onclick'] = expand;