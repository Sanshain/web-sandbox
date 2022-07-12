/**
 * initialize global funcs in the sandbox
 * 
 * (обработчики событий, назначенных в атрибутах, должны быть глобальными. Назначаем их глобальными здесь)
 * 
 * @param {*} code 
 * @returns 
 */
export function generateGlobalInintializer(code) {
    let globalInit = (code.match(/^function ([\w\d_]+) ?\(/gm) || [])
        .map(it => it.split(' ').pop().slice(0, -1).trim())
        .map(it => 'globalThis.' + it + ' = ' + it).join(';\n');

    return globalInit;
}


export const isPaired = (/** @type {string} */ tag) => !~['link'].indexOf(tag);