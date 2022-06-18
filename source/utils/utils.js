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






