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