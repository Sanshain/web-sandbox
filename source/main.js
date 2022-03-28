// @ts-check

import initializeEditor from "./aceInitialize";
import { createPage, webCompile, playgroundObject, babelCompiler, reactCompilers } from "./pageBuilder";

import { expand } from "./features/expantion";
import { initResizers } from "./features/resizing";


// const jsxMode = true;

let jsxMode = Number.parseInt(localStorage.getItem('jsxmode'));
document.querySelector('select').selectedIndex = jsxMode;

initResizers()

// @ts-ignore
const inReactMode = document.getElementById('compiler_mode').selectedIndex;
let compileFunc = inReactMode ? webCompile.bind(null, true) : webCompile;

// @ts-ignore
let editors = playgroundObject.editors = initializeEditor(ace, compileFunc, ['html', 'css', 'javascript'])

let [iframe, curUrl] = createPage(playgroundObject.curUrl, reactCompilers, jsxMode ? babelCompiler.mode : undefined)

playgroundObject.iframe = iframe;
playgroundObject.curUrl = curUrl;


document.querySelector('.play').addEventListener('click', compileFunc);
document.querySelector('.expand')['onclick'] = expand;