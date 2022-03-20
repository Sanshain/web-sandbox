import initializeEditor from "./aceInitialize";
import { globPlayInit } from "./utils/utils";


document.querySelector('.play').addEventListener('click', webplay);

export function webplay(event) {

    // [iframe, curUrl] = createPage(curUrl);
    // console.log(iframe);

    iframe.contentDocument.body.innerHTML = editors[0].getValue()
    iframe.contentDocument.head.querySelector('style').innerHTML = editors[1].getValue()

    let lastScript = iframe.contentDocument.querySelector('script')
    lastScript && lastScript.parentElement.removeChild(lastScript);

    // let script = iframe.contentDocument.body.appendChild(iframe.contentDocument.createElement('script'));
    
    let script = iframe.contentDocument.createElement('script');
    let code = editors[2].getValue();

    let globalReinitializer = globPlayInit(code)
        
    script.innerHTML = '(function(){' + code + ';\n\n' + globalReinitializer + '\n})()'
    iframe.contentDocument.body.appendChild(script)

    // iframe.contentDocument.head.querySelector('script').innerHTML = editors[2].getValue()


    localStorage.setItem('html', editors[0].getValue());
    localStorage.setItem('css', editors[1].getValue());
    localStorage.setItem('javascript', editors[2].getValue());
}



let editors = initializeEditor(ace, ['html', 'css', 'javascript'])



function createHtml({ body, style, script }) {

    console.log(arguments);

    const htmlStruct = {
        html: {
            head: {
                style,
                script
            },
            body
        }
    }

    function nodeCreate(nodeStruct) {

        let html = '';
        for (const key in nodeStruct) {

            let content = typeof nodeStruct[key] === typeof nodeStruct
                ? nodeCreate(nodeStruct[key])
                : nodeStruct[key];

            html += '<' + key + '>' + content + '</' + key + '>';

        }
        return html;
    }

    return nodeCreate(htmlStruct);

}

function createPage(prevUrl) {

    let wrapFunc = code => {
        // 
        let globalReinitializer = globPlayInit(code)

        return 'window.onload = function(){' + code + '\n\n' + globalReinitializer + '\n}';
    }

    let html = createHtml(['body', 'style', 'script'].reduce((acc, el, i, arr) => ((acc[el] = i < 2 ? editors[i].getValue() : wrapFunc(editors[i].getValue())), acc), {}));

    let file = new Blob([html], { type: 'text/html' });

    prevUrl && URL.revokeObjectURL(prevUrl);
    let url = URL.createObjectURL(file);

    let view = document.querySelector('.view');
    // view.innerHTML = '';

    let frame = document.createElement('iframe');
    frame.src = url;
    view.appendChild(frame)

    return [frame, url]
}

let [iframe, curUrl] = createPage()