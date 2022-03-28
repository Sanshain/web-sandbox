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

let _preact = { useState, useEffect, Component, render, h };

Object.assign(globalThis, _preact);

console.log(globalThis);

export let __preact = _preact;