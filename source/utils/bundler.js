import { build } from 'tcp-bundler';

/**
 * билдит модули (пока тож не используется нигде, вроде)
 * @param {string} content : ;
 * @param {object} store 
 * @return {string}
 */
export default function plainBuild(content, store) {

    let exportedFiles = [];

    // console.log(build);

    
    let bb = build;
    globalThis.__debug && console.log(bb);


    let result = build(content, '.', {
        getContent: function (fileName) {

            // fileName = path.normalize(this.dirPath + '/' + fileName)

            //! один файл можно импотрировать только один раз !//

            if (~exportedFiles.indexOf(fileName)) { console.warn(`attempting to re-import '${fileName}' into 'base.ts' has been rejected`); return ''; }
            else {
                exportedFiles.push(fileName)
            }

            // var content = fs.readFileSync(fileName).toString()    // store['app.js'] || 
            let content = store[fileName] || store[fileName + '.js'] || store[fileName + '.ts'] || store[fileName + '.jsx'] || store[fileName + '.tsx'];

            return content;
        }
    });

    //@ts-ignore
    // try {
    //     editors[2].completers.push(exportCompleter);
    // }
    // catch (exc) {
    //     console.warn('empty editors...');
    // }

    return result;
}


// simplest dyncmic custom autocomplete

const exportTable = [
    {
        caption: 'someFunc',
        value: 'someFunc',
        meta: 'local'
    }
]

var exportCompleter = {
    getCompletions: function (editor, session, pos, prefix, callback) {
        callback(null, exportTable);
    }
};



const splitAt = (x, index) => [x.slice(0, index), x.slice(index)]

/**
 * Функция для нативного импорта
 * 
 * (не используется?)
 * @param {string} content : ;
 * @param {*} store 
 */
export function thisBuild(content, store){

    function createModule(match, classNames, fileName, offset, source) {

        console.log(source);
        let [expr, file] = splitAt(splitAt, offset);
        
        let blob = new Blob([store[fileName]], { type: 'text/html' });
        let url = URL.createObjectURL(blob);

        return expr + file.replace(fileName, '/' + url.split('/').pop());
    }

    let regex;

    regex = /^import {([\w, ]+)} from ['"](\.\/[\w\.]+)['"];?/gm
    content = content.replace(regex, createModule); //*/

    regex = /^import ([\w, ]+) from ['"](.\/[\w\.\/]+)['"];?/gm;
    content = content.replace(regex, createModule); //*/
}

