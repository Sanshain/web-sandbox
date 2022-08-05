//@ts-check

import { playgroundObject } from "../pageBuilder";


let hrSplitter = document.querySelector('.h_line');
let vertSplitter = document.querySelector('.v_line');
let centerSplitter = document.querySelector('.center_line');

const htmlEditor = document.getElementById('htmleditor')
const styleEditor = document.getElementById('csseditor')
const jsEditor = document.getElementById('jseditor')
const editionView = document.querySelector('.view')

let hoSeized = false;
let vertSeized = false;
let allSeized = false;

const container = document.querySelector('.md_container');
const header = document.querySelector('.header');

// const headerHeight = header.offsetHeight;
// const headerHeight = container.offsetTop;
const headerHeight = container.getBoundingClientRect().top;
const paddingTop = parseFloat(getComputedStyle(container).padding) * 2 || 0;
//@ts-ignore
window.__debug && console.log(paddingTop);


let tabs = null;

/**
 * Initialize resize lines
 */
export function initResizers() {    

    container.addEventListener('mousedown', function (event) {
        if (event.target === hrSplitter) {

            hoSeized = true;
            tabs = document.querySelector('.tabs');
            // let iframe = editionView.querySelector('iframe');
            // iframe.contentDocument.onmouseup = function (event) { seized = false; };
        }
        else if (event.target === vertSplitter) vertSeized = true
        else {
            allSeized = event.target === centerSplitter;
        }
    })

    window.addEventListener('resize', function resetSize(event) {
        [hrSplitter, vertSplitter, centerSplitter, htmlEditor, styleEditor, jsEditor, editionView].forEach(el => {
            //@ts-ignore
            el.style = null;
        })
    })
    container.addEventListener('mouseup', function (event) {
        if (hoSeized || allSeized) {
            
            playgroundObject.editors.forEach(function(/** @type {{ resize: () => void; }} */ elem) {
                elem.resize();
                console.log('resize...');
            })
        }
        hoSeized = vertSeized = allSeized = false;
        console.log('ok');
    })
    
    container.addEventListener('mousemove', function(event) {

        //@ts-ignore
        if (hoSeized) hTune(event)
        //@ts-ignore
        else if (vertSeized) vTune(event)
        else if (allSeized) {
            //@ts-ignore
            hTune(event) || vTune(event)
        }
    })
}



/**
 * @param {MouseEvent} event
 */
function hTune(event) {
    
    let marginTop = headerHeight;    

    //@ts-ignore
    hrSplitter.style.top = event.clientY - paddingTop + 'px';
    //@ts-ignore
    vertSplitter.style.height = event.clientY - paddingTop + 'px';
    //@ts-ignore
    centerSplitter.style.top = event.clientY - paddingTop + 'px';


    htmlEditor.style.height = event.clientY - marginTop + 'px';
    styleEditor.style.height = event.clientY - marginTop + 'px';

    // let lowerHeight = container.offsetHeight - event.clientY - paddingTop - 10 + marginTop + 'px';
    //@ts-ignore
    let lowerHeight = container.offsetHeight - event.clientY - (paddingTop || 10) + marginTop + 'px';        

    //@ts-ignore
    jsEditor.style.height = editionView.style.height = lowerHeight;
    
    // выравниваем вкладки: 
    if (tabs) {
        // console.log(tabs.offsetHeight);
        // console.log(headerHeight);
        
        //@ts-ignore
        tabs.style.top = event.clientY - tabs.offsetHeight + 5 - container.offsetTop + 'px';        
    }

    return true;
}

/**
 * @param {MouseEvent} event
 */
function vTune(event) {
    let pref = 14;
    let prefLine = 10;
    // let prefLine = 20;
    // let pref = 32;
    let post = 0;

    //@ts-ignore
    vertSplitter.style.left = event.clientX - prefLine + 'px';
    //@ts-ignore
    hrSplitter.style.width = event.clientX - prefLine + 'px';
    //@ts-ignore
    centerSplitter.style.left = event.clientX - prefLine + 'px';

    htmlEditor.style.width = event.clientX - pref + 'px';
    jsEditor.style.width = event.clientX - pref + 'px'
    //@ts-ignore
    styleEditor.style.width = container.offsetWidth - event.clientX + post + 'px'
    //@ts-ignore
    editionView.style.width = container.offsetWidth - event.clientX + post + 'px'
}