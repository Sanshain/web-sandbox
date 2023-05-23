//@ts-check

import { build } from 'neo-builder';
import { encode } from 'sourcemap-codec';
import { deepMergeMap } from 'neo-builder/source/utils';


export const SOURCE_MAP_base64 = '\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,'


/**
 * @typedef {import("svelte-compiler").SourceMap} SourceMap
 * @typedef {import('sourcemap-codec').SourceMapMappings} SourceMapMappings
 */

/**
 * билдит модули (пока тож не используется нигде, вроде)
 * @param {string} content : ;
 * @param {object} store
 * @param {import("neo-builder/types/builder.es").BuildOptions & { 
 *    targetFname?: string | undefined; 
 *    maps: (Record<string, SourceMap> & {Root: SourceMap & {mappingsSchema?: SourceMapMappings}}) | null,
 *    shiftMaps?: number
 * }} options
 * //return {{builtCode: string, sourcemaps?: string}}
 * @returns {string}
 */
export default function buildScript(content, store, options) {

   // let exportedFiles = [];   

   // globalThis.__debug && console.log(build);
   let sourceMap = null;   
   
   let builtCode = build(content, '.', {
      ...options,      
      getContent: (/** @type {string} */ fileName) => {
         // let content = store[key] || store[key.replace(/^\.\//m, '')] || ''
         let content = store[fileName] || store[fileName + '.js'] || store[fileName + '.ts'] || store[fileName + '.jsx'] || store[fileName + '.tsx'];

         return content || '';
      },
      sourceMaps: !options.maps ? {
         encode,
         verbose: true,
         shift: options.shiftMaps + 1 + 1 
      } : void 0,
      getSourceMap: options.maps ? ({ mapping, sourcesContent, files }) => {
         
         const maps = options.maps
         if (!maps) return;

         const outsideMapSchema = maps['Root']['mappingsSchema'];
         
         // /** @type {Omit<typeof maps.Root, 'mappingsSchema'>} */
         // const outsideMap = maps.Root;
         
         ///# algorithm:
                  
         let { mergedMap, outsideMapInfo: outsideMap }  = deepMergeMap({ sourcesContent, files, mapping }, {
            outsideMapInfo: maps.Root,
            outsideMapping: outsideMapSchema
         })

         if (options.shiftMaps) {
            // loclog etc
            
            mergedMap = Array(options.shiftMaps - 1 - 1).fill([]).concat(mergedMap);            
         }
         console.log(mergedMap);
         
         //_ts-expect-error
         outsideMap.mappings = encode(mergedMap);
         sourceMap = outsideMap;

         return void 0;

      } : undefined
   });      

   // debugger
   
   // const sourcemaps = `\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,` + window.btoa(JSON.stringify(sourceMap));
   if (sourceMap) {
      const sourcemaps = SOURCE_MAP_base64 + window.btoa(JSON.stringify(sourceMap));
      builtCode = `var App = (function() { ${builtCode.replace('require("svelte/internal")', 'svelteRuntime')} })()` + (sourcemaps || '');
      // return { builtCode, sourcemaps }
   }
   
   // return { builtCode, sourcemaps: void 0 }

   //@ts-ignore
   // try {
   //     editors[2].completers.push(exportCompleter);
   // }
   // catch (exc) {
   //     console.warn('empty editors...');
   // }

   return builtCode;
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
export function thisBuild(content, store) {

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














// /// update file links inside:

// mapping = mapping.map(line => {

//    if (line && line.length) {
//       line.forEach((ch, i) => {
//          if (line[i][1] < files.length - 1) line[i][1] += outsideMap.sources.length;
//       });
//       return line;
//    }

//    return [];
// });

// /// merge itself SourceMapMappings (reduce whatever lines to root lines):

// let mergedMap = mapping.map((line, i) => {

//    if (!line || !line.length) return [];

//    let _line = (line || []).map((ch, j, arr) => {

//       const origCharMap = outsideMapSchema[line[j][2]];

//       if (origCharMap && origCharMap.length) return origCharMap[0];
//       else {
//          if (ch[1] > outsideMap.sources.length - 1) return ch;
//          else {
//             return false;
//          }
//       }
//    });

//    return _line.filter(l => l);
// });

// outsideMap.sources = outsideMap.sources.concat(files.slice(0, -1));
// outsideMap.sourcesContent = outsideMap.sourcesContent.concat((sourcesContent || []).slice(0, -1));