// @ts-check

import initializeEditor from "./aceInitialize";
import { createPage, webCompile, playgroundObject } from "./pageBuilder";

import { expand } from "./features/expantion";


// @ts-ignore
let editors = playgroundObject.editors = initializeEditor(ace, webCompile, ['html', 'css', 'javascript'])

let [iframe, curUrl] = createPage();

playgroundObject.iframe = iframe;
playgroundObject.curUrl = curUrl;


document.querySelector('.play').addEventListener('click', webCompile);
document.querySelector('.expand')['onclick'] = expand;