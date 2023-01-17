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

        event.target.value = ''

        lines.scrollTo(0, lines.scrollHeight);

        event.target.focus()
    }
}