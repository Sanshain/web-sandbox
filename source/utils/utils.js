export function debounce(func, delay) {

    let inAwaiting = false;

    return function ()
    {
        if (!inAwaiting) {

            let result = func();

            inAwaiting = true;
            setTimeout(() => inAwaiting = false, delay);

            return result;
        }
    };
}


export function globPlayInit(code)
{
    let globalInit = code.match(/^function ([\w\d_]+) ?\(/gm)
        .map(it => it.split(' ').pop().slice(0, -1).trim())
        .map(it => 'globalThis.' + it + ' = ' + it).join(';\n');

    return globalInit;
}