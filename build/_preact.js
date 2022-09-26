var _preact=function(_){"use strict";var e,n,t,o,r,l,u={},i=[],c=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;function f(_,e){for(var n in e)_[n]=e[n];return _}function s(_){var e=_.parentNode;e&&e.removeChild(_)}function a(_,n,t){var o,r,l,u={};for(l in n)"key"==l?o=n[l]:"ref"==l?r=n[l]:u[l]=n[l];if(arguments.length>2&&(u.children=arguments.length>3?e.call(arguments,2):t),"function"==typeof _&&null!=_.defaultProps)for(l in _.defaultProps)void 0===u[l]&&(u[l]=_.defaultProps[l]);return p(_,u,o,r,null)}function p(_,e,o,r,l){var u={type:_,props:e,key:o,ref:r,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,__h:null,constructor:void 0,__v:null==l?++t:l};return null==l&&null!=n.vnode&&n.vnode(u),u}function h(_){return _.children}function d(_,e){this.props=_,this.context=e}function v(_,e){if(null==e)return _.__?v(_.__,_.__.__k.indexOf(_)+1):null;for(var n;e<_.__k.length;e++)if(null!=(n=_.__k[e])&&null!=n.__e)return n.__e;return"function"==typeof _.type?v(_):null}function y(_){var e,n;if(null!=(_=_.__)&&null!=_.__c){for(_.__e=_.__c.base=null,e=0;e<_.__k.length;e++)if(null!=(n=_.__k[e])&&null!=n.__e){_.__e=_.__c.base=n.__e;break}return y(_)}}function m(_){(!_.__d&&(_.__d=!0)&&o.push(_)&&!g.__r++||l!==n.debounceRendering)&&((l=n.debounceRendering)||r)(g)}function g(){for(var _;g.__r=o.length;)_=o.sort((function(_,e){return _.__v.__b-e.__v.__b})),o=[],_.some((function(_){var e,n,t,o,r,l;_.__d&&(r=(o=(e=_).__v).__e,(l=e.__P)&&(n=[],(t=f({},o)).__v=o.__v+1,T(l,o,t,e.__n,void 0!==l.ownerSVGElement,null!=o.__h?[r]:null,n,null==r?v(o):r,o.__h),C(n,o),o.__e!=r&&y(o)))}))}function k(_,e,n,t,o,r,l,c,f,s){var a,d,y,m,g,k,E,S=t&&t.__k||i,x=S.length;for(n.__k=[],a=0;a<e.length;a++)if(null!=(m=n.__k[a]=null==(m=e[a])||"boolean"==typeof m?null:"string"==typeof m||"number"==typeof m||"bigint"==typeof m?p(null,m,null,null,m):Array.isArray(m)?p(h,{children:m},null,null,null):m.__b>0?p(m.type,m.props,m.key,null,m.__v):m)){if(m.__=n,m.__b=n.__b+1,null===(y=S[a])||y&&m.key==y.key&&m.type===y.type)S[a]=void 0;else for(d=0;d<x;d++){if((y=S[d])&&m.key==y.key&&m.type===y.type){S[d]=void 0;break}y=null}T(_,m,y=y||u,o,r,l,c,f,s),g=m.__e,(d=m.ref)&&y.ref!=d&&(E||(E=[]),y.ref&&E.push(y.ref,null,m),E.push(d,m.__c||g,m)),null!=g?(null==k&&(k=g),"function"==typeof m.type&&m.__k===y.__k?m.__d=f=b(m,f,_):f=H(_,m,y,S,g,f),"function"==typeof n.type&&(n.__d=f)):f&&y.__e==f&&f.parentNode!=_&&(f=v(y))}for(n.__e=k,a=x;a--;)null!=S[a]&&("function"==typeof n.type&&null!=S[a].__e&&S[a].__e==n.__d&&(n.__d=v(t,a+1)),D(S[a],S[a]));if(E)for(a=0;a<E.length;a++)A(E[a],E[++a],E[++a])}function b(_,e,n){for(var t,o=_.__k,r=0;o&&r<o.length;r++)(t=o[r])&&(t.__=_,e="function"==typeof t.type?b(t,e,n):H(n,t,t,o,t.__e,e));return e}function H(_,e,n,t,o,r){var l,u,i;if(void 0!==e.__d)l=e.__d,e.__d=void 0;else if(null==n||o!=r||null==o.parentNode)_:if(null==r||r.parentNode!==_)_.appendChild(o),l=null;else{for(u=r,i=0;(u=u.nextSibling)&&i<t.length;i+=2)if(u==o)break _;_.insertBefore(o,r),l=r}return void 0!==l?l:o.nextSibling}function E(_,e,n){"-"===e[0]?_.setProperty(e,n):_[e]=null==n?"":"number"!=typeof n||c.test(e)?n:n+"px"}function S(_,e,n,t,o){var r;_:if("style"===e)if("string"==typeof n)_.style.cssText=n;else{if("string"==typeof t&&(_.style.cssText=t=""),t)for(e in t)n&&e in n||E(_.style,e,"");if(n)for(e in n)t&&n[e]===t[e]||E(_.style,e,n[e])}else if("o"===e[0]&&"n"===e[1])r=e!==(e=e.replace(/Capture$/,"")),e=e.toLowerCase()in _?e.toLowerCase().slice(2):e.slice(2),_.l||(_.l={}),_.l[e+r]=n,n?t||_.addEventListener(e,r?P:x,r):_.removeEventListener(e,r?P:x,r);else if("dangerouslySetInnerHTML"!==e){if(o)e=e.replace(/xlink(H|:h)/,"h").replace(/sName$/,"s");else if("href"!==e&&"list"!==e&&"form"!==e&&"tabIndex"!==e&&"download"!==e&&e in _)try{_[e]=null==n?"":n;break _}catch(_){}"function"==typeof n||(null!=n&&(!1!==n||"a"===e[0]&&"r"===e[1])?_.setAttribute(e,n):_.removeAttribute(e))}}function x(_){this.l[_.type+!1](n.event?n.event(_):_)}function P(_){this.l[_.type+!0](n.event?n.event(_):_)}function T(_,e,t,o,r,l,u,i,c){var s,a,p,v,y,m,g,b,H,E,S,x=e.type;if(void 0!==e.constructor)return null;null!=t.__h&&(c=t.__h,i=e.__e=t.__e,e.__h=null,l=[i]),(s=n.__b)&&s(e);try{_:if("function"==typeof x){if(b=e.props,H=(s=x.contextType)&&o[s.__c],E=s?H?H.props.value:s.__:o,t.__c?g=(a=e.__c=t.__c).__=a.__E:("prototype"in x&&x.prototype.render?e.__c=a=new x(b,E):(e.__c=a=new d(b,E),a.constructor=x,a.render=F),H&&H.sub(a),a.props=b,a.state||(a.state={}),a.context=E,a.__n=o,p=a.__d=!0,a.__h=[]),null==a.__s&&(a.__s=a.state),null!=x.getDerivedStateFromProps&&(a.__s==a.state&&(a.__s=f({},a.__s)),f(a.__s,x.getDerivedStateFromProps(b,a.__s))),v=a.props,y=a.state,p)null==x.getDerivedStateFromProps&&null!=a.componentWillMount&&a.componentWillMount(),null!=a.componentDidMount&&a.__h.push(a.componentDidMount);else{if(null==x.getDerivedStateFromProps&&b!==v&&null!=a.componentWillReceiveProps&&a.componentWillReceiveProps(b,E),!a.__e&&null!=a.shouldComponentUpdate&&!1===a.shouldComponentUpdate(b,a.__s,E)||e.__v===t.__v){a.props=b,a.state=a.__s,e.__v!==t.__v&&(a.__d=!1),a.__v=e,e.__e=t.__e,e.__k=t.__k,e.__k.forEach((function(_){_&&(_.__=e)})),a.__h.length&&u.push(a);break _}null!=a.componentWillUpdate&&a.componentWillUpdate(b,a.__s,E),null!=a.componentDidUpdate&&a.__h.push((function(){a.componentDidUpdate(v,y,m)}))}a.context=E,a.props=b,a.state=a.__s,(s=n.__r)&&s(e),a.__d=!1,a.__v=e,a.__P=_,s=a.render(a.props,a.state,a.context),a.state=a.__s,null!=a.getChildContext&&(o=f(f({},o),a.getChildContext())),p||null==a.getSnapshotBeforeUpdate||(m=a.getSnapshotBeforeUpdate(v,y)),S=null!=s&&s.type===h&&null==s.key?s.props.children:s,k(_,Array.isArray(S)?S:[S],e,t,o,r,l,u,i,c),a.base=e.__e,e.__h=null,a.__h.length&&u.push(a),g&&(a.__E=a.__=null),a.__e=!1}else null==l&&e.__v===t.__v?(e.__k=t.__k,e.__e=t.__e):e.__e=w(t.__e,e,t,o,r,l,u,c);(s=n.diffed)&&s(e)}catch(_){e.__v=null,(c||null!=l)&&(e.__e=i,e.__h=!!c,l[l.indexOf(i)]=null),n.__e(_,e,t)}}function C(_,e){n.__c&&n.__c(e,_),_.some((function(e){try{_=e.__h,e.__h=[],_.some((function(_){_.call(e)}))}catch(_){n.__e(_,e.__v)}}))}function w(_,n,t,o,r,l,i,c){var f,a,p,h=t.props,d=n.props,y=n.type,m=0;if("svg"===y&&(r=!0),null!=l)for(;m<l.length;m++)if((f=l[m])&&"setAttribute"in f==!!y&&(y?f.localName===y:3===f.nodeType)){_=f,l[m]=null;break}if(null==_){if(null===y)return document.createTextNode(d);_=r?document.createElementNS("http://www.w3.org/2000/svg",y):document.createElement(y,d.is&&d),l=null,c=!1}if(null===y)h===d||c&&_.data===d||(_.data=d);else{if(l=l&&e.call(_.childNodes),a=(h=t.props||u).dangerouslySetInnerHTML,p=d.dangerouslySetInnerHTML,!c){if(null!=l)for(h={},m=0;m<_.attributes.length;m++)h[_.attributes[m].name]=_.attributes[m].value;(p||a)&&(p&&(a&&p.__html==a.__html||p.__html===_.innerHTML)||(_.innerHTML=p&&p.__html||""))}if(function(_,e,n,t,o){var r;for(r in n)"children"===r||"key"===r||r in e||S(_,r,null,n[r],t);for(r in e)o&&"function"!=typeof e[r]||"children"===r||"key"===r||"value"===r||"checked"===r||n[r]===e[r]||S(_,r,e[r],n[r],t)}(_,d,h,r,c),p)n.__k=[];else if(m=n.props.children,k(_,Array.isArray(m)?m:[m],n,t,o,r&&"foreignObject"!==y,l,i,l?l[0]:t.__k&&v(t,0),c),null!=l)for(m=l.length;m--;)null!=l[m]&&s(l[m]);c||("value"in d&&void 0!==(m=d.value)&&(m!==_.value||"progress"===y&&!m||"option"===y&&m!==h.value)&&S(_,"value",m,h.value,!1),"checked"in d&&void 0!==(m=d.checked)&&m!==_.checked&&S(_,"checked",m,h.checked,!1))}return _}function A(_,e,t){try{"function"==typeof _?_(e):_.current=e}catch(_){n.__e(_,t)}}function D(_,e,t){var o,r;if(n.unmount&&n.unmount(_),(o=_.ref)&&(o.current&&o.current!==_.__e||A(o,null,e)),null!=(o=_.__c)){if(o.componentWillUnmount)try{o.componentWillUnmount()}catch(_){n.__e(_,e)}o.base=o.__P=null}if(o=_.__k)for(r=0;r<o.length;r++)o[r]&&D(o[r],e,"function"!=typeof _.type);t||null==_.__e||s(_.__e),_.__e=_.__d=void 0}function F(_,e,n){return this.constructor(_,n)}e=i.slice,n={__e:function(_,e,n,t){for(var o,r,l;e=e.__;)if((o=e.__c)&&!o.__)try{if((r=o.constructor)&&null!=r.getDerivedStateFromError&&(o.setState(r.getDerivedStateFromError(_)),l=o.__d),null!=o.componentDidCatch&&(o.componentDidCatch(_,t||{}),l=o.__d),l)return o.__E=o}catch(e){_=e}throw _}},t=0,d.prototype.setState=function(_,e){var n;n=null!=this.__s&&this.__s!==this.state?this.__s:this.__s=f({},this.state),"function"==typeof _&&(_=_(f({},n),this.props)),_&&f(n,_),null!=_&&this.__v&&(e&&this.__h.push(e),m(this))},d.prototype.forceUpdate=function(_){this.__v&&(this.__e=!0,_&&this.__h.push(_),m(this))},d.prototype.render=h,o=[],r="function"==typeof Promise?Promise.prototype.then.bind(Promise.resolve()):setTimeout,g.__r=0;var U,M,N,L=0,W=[],R=n.__b,O=n.__r,q=n.diffed,I=n.__c,j=n.unmount;function B(_,e){n.__h&&n.__h(M,_,L||e),L=0;var t=M.__H||(M.__H={__:[],__h:[]});return _>=t.__.length&&t.__.push({}),t.__[_]}function $(){for(var _;_=W.shift();)if(_.__P)try{_.__H.__h.forEach(V),_.__H.__h.forEach(z),_.__H.__h=[]}catch(e){_.__H.__h=[],n.__e(e,_.__v)}}n.__b=function(_){M=null,R&&R(_)},n.__r=function(_){O&&O(_),U=0;var e=(M=_.__c).__H;e&&(e.__h.forEach(V),e.__h.forEach(z),e.__h=[])},n.diffed=function(_){q&&q(_);var e=_.__c;e&&e.__H&&e.__H.__h.length&&(1!==W.push(e)&&N===n.requestAnimationFrame||((N=n.requestAnimationFrame)||function(_){var e,n=function(){clearTimeout(t),G&&cancelAnimationFrame(e),setTimeout(_)},t=setTimeout(n,100);G&&(e=requestAnimationFrame(n))})($)),M=null},n.__c=function(_,e){e.some((function(_){try{_.__h.forEach(V),_.__h=_.__h.filter((function(_){return!_.__||z(_)}))}catch(t){e.some((function(_){_.__h&&(_.__h=[])})),e=[],n.__e(t,_.__v)}})),I&&I(_,e)},n.unmount=function(_){j&&j(_);var e,t=_.__c;t&&t.__H&&(t.__H.__.forEach((function(_){try{V(_)}catch(_){e=_}})),e&&n.__e(e,t.__v))};var G="function"==typeof requestAnimationFrame;function V(_){var e=M,n=_.__c;"function"==typeof n&&(_.__c=void 0,n()),M=e}function z(_){var e=M;_.__c=_.__(),M=e}function J(_,e){return!_||_.length!==e.length||e.some((function(e,n){return e!==_[n]}))}function K(_,e){return"function"==typeof e?e(_):e}let Q={useState:function(_){return L=1,function(_,e,n){var t=B(U++,2);return t.t=_,t.__c||(t.__=[n?n(e):K(void 0,e),function(_){var e=t.t(t.__[0],_);t.__[0]!==e&&(t.__=[e,t.__[1]],t.__c.setState({}))}],t.__c=M),t.__}(K,_)},useEffect:function(_,e){var t=B(U++,3);!n.__s&&J(t.__H,e)&&(t.__=_,t.__H=e,M.__H.__h.push(t))},useRef:function(_){return L=5,function(_,e){var n=B(U++,7);return J(n.__H,e)&&(n.__=_(),n.__H=e,n.__h=_),n.__}((function(){return{current:_}}),[])},Component:d,render:function(_,t,o){var r,l,i;n.__&&n.__(_,t),l=(r="function"==typeof o)?null:o&&o.__k||t.__k,i=[],T(t,_=(!r&&o||t).__k=a(h,null,[_]),l||u,u,void 0!==t.ownerSVGElement,!r&&o?[o]:l?null:t.firstChild?e.call(t.childNodes):null,i,!r&&o?o:l?l.__e:t.firstChild,r),C(i,_)},React:{createElement:a}};Object.assign(globalThis,Q),globalThis.__debug&&console.log(globalThis);let X=Q;return _.__preact=X,Object.defineProperty(_,"__esModule",{value:!0}),_}({});
//# sourceMappingURL=_preact.js.map
