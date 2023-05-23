//@ts-check

// import babel from 'babel-standalone';
// import jsxTransform from 'babel-plugin-transform-react-jsx';

import { transform as jxTransform } from "buble";
import { decode, encode } from 'sourcemap-codec';
import { extractEmbedMap, mergeFlatMaps } from 'neo-builder/source/utils';



const TS_MAP_Token = '//# sourceMappingURL=data:application/json;base64,';
const tagType = 'text/jsx'

function sxConvert() {

   const script = document.querySelector('script[type="' + tagType + '"]');

   if (!script) return console.warn('Script ' + tagType + ' doesn`t found');
   {
      
      let [originMapping, mapInfo, code] = extractEmbedMap(script.textContent, { decode });

      const builtResult = jxTransform(code.trim(), {})                                    // 1)- input sourcemap has no 1)+ size      

      const [, mergedMap] = mergeFlatMaps('', originMapping, { pluginMapping: decode(builtResult.map.mappings) });

      console.log(mergedMap);

      mapInfo.mappings = encode(mergedMap);
      
      code = builtResult.code + '\n' + TS_MAP_Token + window.btoa(JSON.stringify(mapInfo));

      const exe = document.createElement('script')
      exe.textContent = code;
      exe.id = 'App';
      document.head.appendChild(exe)
      
   }
}

sxConvert()