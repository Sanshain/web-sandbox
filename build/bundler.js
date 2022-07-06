var simplestBundler = (function (exports, require$$0) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var require$$0__default = /*#__PURE__*/_interopDefaultLegacy(require$$0);

    var pack = {};

    //@ts-check
    // import "fs";

    const extensions = ['.ts','.js'];
    var exportedFiles = [];

    // integrate("base.ts", 'result.js')

    pack.combine = combine;
    // exports.integrate = integrate;

    function combine(content, dirpath, options){
        
        exportedFiles = [];

        content = removeLazy(content);

        content = importInsert(content, dirpath, options);

        return content;
    }

    // function integrate(from, to, options){    

    //     let content = fs.readFileSync(from).toString();        
    //     let filename = path.resolve(from);
        
    //     content = combine(content, path.dirname(filename), options)

    //     to = to || path.parse(filename).dir + path.sep + path.parse(filename).name + '.js';

    //     fs.writeFileSync(to, content)    
    // }

    class pathMan {
        constructor(dirname, _getContent) {
            this.dirPath = dirname;
            this.getContent = _getContent;
        }
    }

    function importInsert(content, dirpath, options) {
        
        console.log('importInsert...');

        let pathman = new pathMan(dirpath, options.getContent || getContent);
        
        let regex = /^import \* as (?<module>\w+) from \"\.\/(?<filename>\w+)\";?/gm;            
        content = content.replace(regex, unitsPack.bind(pathman));

        ///* not recommended, but easy for realization:
        // regex = /^import \"\.\/(?<filename>\w+)\"/gm;
        // content = content.replace(regex, allocPack.bind(pathman)); //*/    

        regex = /^import {([\w, ]+)} from ['"]\.\/([\w\.]+)['"];?/gm;
        content = content.replace(regex, wrapsPack.bind(pathman)); //*/

        regex = /^import ([\w, ]+) from ['"].\/([\w\.\/]+)['"];?/gm;
        content = content.replace(regex, defaultPack.bind(pathman)); //*/
        
        if (options && options.release)
        {
            // remove comments:
            content = content.replace(/\/\*[\s\S]*?\*\//g, '');
            content = content.replace(/\/\/[\s\S]*?\n/g, '\n'); //*/
        }

        return content
    }


    function defaultPack(match, classNames, fileName, offset, source) {

        var content = this.getContent(fileName);
        if (content == '' || !content) return ''

        classNames = classNames.split(',').map(s => s.trim());
        const matches = Array.from(content.matchAll(/^export default (function|class) (\w+)[ ]*\([\w, ]*\)[\s]*{[\w\W]*?\n}/gm));        

        console.log(match);
        match = '';
        for (let unit of matches) {
            if (classNames.includes(unit[2])) {

                match += unit[0].substr(7).replace('default ', '') + '\n\n';
            }
        }

        content = `\n/*start of ${fileName}*/\n${match.trim()}\n/*end*/\n\n`;

        return content;
    }


    function wrapsPack(match, classNames, fileName, offset, source){

        console.log('wrapsPack...');

        var content = this.getContent(fileName);
        if (content == '' || !content) return ''

        classNames = classNames.split(',').map(s => s.trim());
        let matches1 = Array.from(content.matchAll(/^export (let|var) (\w+) = [^\n]+/gm));    
        let matches2 = Array.from(content.matchAll(/^export (function) (\w+)[ ]*\([\w, ]*\)[\s]*{[\w\W]*?\n}/gm));
        let matches3 = Array.from(content.matchAll(/^export (class) (\w+)([\s]*{[\w\W]*?\n})/gm));
        var matches = matches1.concat(matches2, matches3);

        match = '';
        for (let unit of matches)
        {
            if (classNames.includes(unit[2])){
                
                match += unit[0].substr(7) + '\n\n';
            }        
        }
        
        content = `\n/*start of ${fileName}*/\n${match.trim()}\n/*end*/\n\n`; 

        return content;
    }

    function unitsPack(match, modulName, fileName, offset, source){

        var content = this.getContent(fileName);
        if (content == '' || !content) return ''

        let exportList = [];

        content = content.replace(/^(let|var) /gm, 'let ');
        content = content.replace(/^export (let|var|function|class) (\w+)/gm, 
        function(match, declType, varName, offset, source)
        {
            exportList.push('\t\t' + varName + ":" + varName);
            return declType + ' ' + varName;
        });

        var unitObj = exportList.join(',\n');
        content += `\n\nvar ${modulName} = {\n ${unitObj} \n}`;

        content = '{\n' + content.replace(/^([\S \t])/gm, '    $1') + '\n}';    

        content = `\n/*start of ${fileName}*/\n${content}\n/*end*/\n\n`;    

        return content;
    }



    function getContent(fileName){    

        const fs = require$$0__default["default"];

        fileName = this.dirPath + '/' + fileName;

        for(let ext of extensions){
            if (fs.existsSync(fileName + ext)) 
            {   
                fileName = fileName + ext;
                break;            
            }
        }

        if (exportedFiles.includes(fileName)) 
        {
            
            // let lineNumber = source.substr(0, offset).split('\n').length
            console.warn(`attempting to re-import '${fileName}' into 'base.ts' has been rejected`);
            return ''
        }
        else exportedFiles.push(fileName);
        

        var content = fs.readFileSync(fileName).toString();    

        // content = Convert(content)

        return content;
    }

    /**
     * Remove lazy-marked chunk of code:
     * 
     * @param {string} content : content;
     * @returns {string}
     */
    function removeLazy(content){    

        return content.replace(/\/\*-lazy\*\/[\s\S]*?\/\*lazy-\*\//, '');    
    }

    // const fs = require("fs");
    // const sock = require('net');
    // const path = require('path')

    // // const cmd = require("child_process");
    // var tss = require('typescript-simple');
    // var obfuscator = require("uglify-js");

    const build = pack.combine;

    // function startListen(host, port, options){
    // 	host = host || 'localhost'
    // 	port = port || 9098
    // 	options = options || {}

    // 	console.log(`bundler start listen on ${host}:${port}`)    	

    // 	sock.createServer(function (socket) {

    // 		console.log('connection estableshed')    
    	
    // 		socket.on('data', async function(data) {
    			 			
    // 			console.time('Time');		
    	
    // 			let filename = data.toString();
    // 			console.log(`received task for '${filename}'`)
    				
    // 			if (fs.existsSync(filename)){
    	
    // 				var content = fs.readFileSync(filename, "utf8");
    // 				var result = bundler.combine(content, path.dirname(filename), options)
    				
    // 				if (options.tsc)  result = tss(result);		
    // 				if (options.minify)	result = obfuscator.minify(result).code.valueOf();				
    // 				let pathinfo = path.parse(filename);

    // 				fs.writeFileSync(pathinfo.dir + path.sep + pathinfo.name + '.js', result)
    // 			}
    // 			else throw new Error(`file ${filename} does not exists`)
    					
    // 			console.timeEnd('Time');
    // 			socket.write('success');

    // 		});
    		 
    // 	}).listen(port, host);

    // }

    var tcpBundler = { build };

    /**
     * билдит модули (пока тож не используется нигде, вроде)
     * @param {string} content : ;
     * @param {object} store 
     * @return {string}
     */
    function plainBuild(content, store) {

        let exportedFiles = [];

        // console.log(build);

        
        let bb = tcpBundler.build;
        globalThis.__debug && console.log(bb);


        let result = tcpBundler.build(content, '.', {
            getContent: function (fileName) {

                // fileName = path.normalize(this.dirPath + '/' + fileName)

                //! один файл можно импотрировать только один раз !//

                if (~exportedFiles.indexOf(fileName)) { console.warn(`attempting to re-import '${fileName}' into 'base.ts' has been rejected`); return ''; }
                else {
                    exportedFiles.push(fileName);
                }

                let content = store['app.js'] || store[fileName];          // var content = fs.readFileSync(fileName).toString()

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



    const splitAt = (x, index) => [x.slice(0, index), x.slice(index)];

    /**
     * Функция для нативного импорта
     * 
     * (не используется?)
     * @param {string} content : ;
     * @param {*} store 
     */
    function thisBuild(content, store){

        function createModule(match, classNames, fileName, offset, source) {

            console.log(source);
            let [expr, file] = splitAt(splitAt, offset);
            
            let blob = new Blob([store[fileName]], { type: 'text/html' });
            let url = URL.createObjectURL(blob);

            return expr + file.replace(fileName, '/' + url.split('/').pop());
        }

        let regex;

        regex = /^import {([\w, ]+)} from ['"](\.\/[\w\.]+)['"];?/gm;
        content = content.replace(regex, createModule); //*/

        regex = /^import ([\w, ]+) from ['"](.\/[\w\.\/]+)['"];?/gm;
        content = content.replace(regex, createModule); //*/
    }

    exports["default"] = plainBuild;
    exports.thisBuild = thisBuild;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

})({}, undefined);
//# sourceMappingURL=bundler.js.map
