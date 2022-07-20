//@ts-check

export const commonStorage = sessionStorage;

/**
 * @param {{ (): number; (): any; }} func
 * @param {number} delay
 */
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



/**
 * @param {string} code
 * @returns {string|null}
 */
export function getLangMode(code)
{
    let langModeMatch = code.match(/\/\* ([\w \n]+) \*\//);

    return langModeMatch
        ? langModeMatch.pop()
        : null;
}


