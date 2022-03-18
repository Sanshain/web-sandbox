function initializeEditor(ace, modes) {

    const Range = ace.require('ace/range').Range;

    return [].slice.call(document.querySelectorAll('.editor')).map((element, i, arr) =>
    {

        var editor = ace.edit(element.id);
        editor.setTheme("ace/theme/monokai");
        editor.session.setMode("ace/mode/" + modes[i]);        

        editor.setOptions(
        {
            enableBasicAutocompletion: true,
            enableSnippets: true,
            enableLiveAutocompletion: true,
            // enableEmmet: true              
        });

        editor.textInput.getElement().addEventListener('keydown', function (event)
        {            
            (event.ctrlKey && event.keyCode === 190) && (arr[i + 1] || arr[0]).querySelector('textarea').focus();
        })

        if (i === 0) editor.commands.addCommand(
        {
            name: "extend",
            exec: function () 
            {  
                let cursor = editor.getCursorPosition();
                let row = cursor.row;
                if (cursor.column == editor.session.getLine(row).length) {

                    let line = editor.session.getLine(row);

                    let startChar = Math.max(line.lastIndexOf(' ') + 1, 0);
                    let endChar = cursor.column;
                    let range = new Range(row, startChar, row, endChar);

                    let textRange = line.slice(startChar, endChar);
                    let code = extend(textRange)
                    // let text = editor.session.getValue();
                    editor.session.replace(range, code)

                    editor.moveCursorTo(row, !(textRange.startsWith('.') || textRange.startsWith('#'))
                        ? startChar + code.length - textRange.length - 3
                        : startChar + code.length - 6
                    )

                    return;
                }
                editor.indent();
            },
            bindKey: { win: 'Tab' }
        })
        
        return editor;

    });

}
