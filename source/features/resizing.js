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
const headerHeight = header.offsetHeight;

/**
 * Initialize resize lines
 */
export function initResizers() {        

    container.addEventListener('mousedown', function (event) {
        if (event.target === hrSplitter) {

            hoSeized = true;
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
            el.style = null;
        })
    })
    container.addEventListener('mouseup', function (event) { hoSeized = vertSeized = allSeized = false; })
    container.addEventListener('mousemove', function (event) {

        if (hoSeized) hTune(event)
        else if (vertSeized) vTune(event)
        else if (allSeized) {
            hTune(event) || vTune(event)
        }
    })
}



function hTune(event) {
    let marginTop = headerHeight;
    let prefLine = 10;

    hrSplitter.style.top = event.clientY - prefLine + 'px';
    vertSplitter.style.height = event.clientY - prefLine + 'px';
    centerSplitter.style.top = event.clientY - prefLine + 'px';

    htmlEditor.style.height = event.clientY - marginTop + 'px';
    styleEditor.style.height = event.clientY - marginTop + 'px';
    jsEditor.style.height = container.offsetHeight - event.clientY - prefLine + marginTop + 'px'
    editionView.style.height = container.offsetHeight - event.clientY - prefLine + marginTop + 'px'
}

function vTune(event) {
    let pref = 14;
    let prefLine = 10;
    // let prefLine = 20;
    // let pref = 32;
    let post = 0;

    vertSplitter.style.left = event.clientX - prefLine + 'px';
    hrSplitter.style.width = event.clientX - prefLine + 'px';
    centerSplitter.style.left = event.clientX - prefLine + 'px';

    htmlEditor.style.width = event.clientX - pref + 'px';
    jsEditor.style.width = event.clientX - pref + 'px'
    styleEditor.style.width = container.offsetWidth - event.clientX + post + 'px'
    editionView.style.width = container.offsetWidth - event.clientX + post + 'px'
}