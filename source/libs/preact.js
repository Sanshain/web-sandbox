//@ts-check

import { render, h, Component } from 'preact';
import { useState, useEffect, useRef } from 'preact/hooks';

// import { useReducer, useContext, useMemo } from "preact/hooks";

/** @jsx h */

// const App = () => {
//     const [input, setInput] = useState('');

//     return (
//         <div>
//             <p>Do you agree to the statement: "Preact is awesome"?</p>
//             <input value={input} onInput={e => setInput(e.target.value)} />
//         </div>
//     )
// }

// render(<App />, document.body);

// alert(9)

let _preact = {
    useState, useEffect, useRef, Component, render, 
    React: {
        createElement: h
    }
};


Object.assign(globalThis, _preact);

globalThis['__debug'] && console.log(globalThis);

// TODO properly object to spread it (TODO check that works)

export let __preact = _preact;