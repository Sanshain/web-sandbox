//@ts-check

// @ts-ignore
window.evalCode = function evalCode(event) {
    if (event.key == 'Enter') {
        let iframe = document.querySelector('iframe');

        iframe.contentWindow.postMessage(event.target.value, '*')

        // let error = ''
        // try {            
        //     var result = iframe.contentWindow.eval(event.target.value);
        // }
        // catch (e) {
        //     result = error = '> ' + e.stack.split(':').shift() + ': ' + e.message;
        // }

        const lines = document.querySelector('.console .lines');
        let line = lines.appendChild(document.createElement('div'));
        //@ts-ignore
        line.style = 'border-bottom: none;padding-bottom: 0;'

        let snipElem = line.appendChild(document.createElement('div'));
        snipElem.textContent = '> ' + event.target.value;
        snipElem.className = 'input';
        snipElem.style.marginBottom = '0'

        // let resultElem = line.appendChild(document.createElement('div'));
        // resultElem.textContent = typeof result === 'object'
        //     ? (~result.toString().indexOf('HTML')
        //         ? result
        //         : JSON.stringify(result))
        //     : result;
        // if (error) {
        //     resultElem.style.color = 'red';
        //     // resultElem.style.fontFamily = "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif";
        //     resultElem.style.fontFamily = "monospace";
        // }

        shellStore = JSON.parse(sessionStorage.getItem('shellStore') || '[]')
        shellStore.push(event.target.value)        
        if (shellStore.length > shellStoreLength) {
            shellStore.shift()
        }
        currentShellStoreIndex = shellStore.length - 1;
        sessionStorage.setItem('shellStore', JSON.stringify(shellStore));


        event.target.value = ''

        // lines.scrollTo(0, lines.scrollHeight);

        event.target.focus()
    }
    else if (currentShellStoreIndex !== undefined && ~['ArrowUp', 'ArrowDown'].indexOf(event.key)) {
        if (shellStore.length) {
            console.log(currentShellStoreIndex);            
            
            event.target.value = shellStore[currentShellStoreIndex] || '';

            if (event.key.slice(-2) == 'Up') {
                currentShellStoreIndex = Math.max(currentShellStoreIndex - 1, 0)
            }
            else if (event.key.slice(-4) == 'Down') {
                currentShellStoreIndex = Math.min(currentShellStoreIndex + 1, shellStore.length - 1)
            }
            
            setTimeout(() => {
                event.target.selectionStart = event.target.selectionEnd = event.target.value.length
            })
            
            

        }
    }
}

let shellStore = []
const shellStoreLength = 10;
let currentShellStoreIndex = undefined;
