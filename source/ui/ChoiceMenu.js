//@ts-check

import { html } from "./../utils/linter";


// HTMLElement
export class ChoiceMenu extends HTMLElement {

    itemStyle = ' \
        color: white; \
        background-color: #666; \
        padding: 0.1em 1em 0.1em 2em; \
        margin-top: 1px; \
        text-align: right; \
        position: relative; '


    /** selected element
     * @type {HTMLElement}
     */
    selectedElement = null;

    /** checked mark // only for external slot //
     * @type {HTMLElement}
     */
    checkedElement = null;

    /** ul
     * @type {HTMLUListElement}
     */
    rootElement = null;

    /** selected info
     * @type {{id: string, metaId: string, value: string}}
     */
    checkInfo = null;

    /// 
    //@ts-ignore
    itemInitialize = (/** @type {HTMLLIElement} */ el) => ((el.onclick = (/** @type {Event} */ e) => this.selectedChanged(e)), el.style = this.itemStyle)

    // get rootElement() { return this._rootElement; };
    // set rootElement(v) {
    //     console.log(v);
    //     this._rootElement = v;
    // }

    
    /** 
     * @deprecated
     * @type number
     */
    // @ts-ignore    
    get selectedIndex() {
        let index = [].slice.call(this.rootElement.querySelectorAll('li')).indexOf(this.rootElement.querySelector('.selected'));
        return index;
    };
    

    /**
     * @type string
     */
    // @ts-ignore
    get selectedItem() {
        //@ts-ignore
        // return (this.rootElement.querySelector('.selected') || {}).innerText
        return this.selectedElement.innerText;
    };


    constructor() {
        super();

        /// base vars

        //@ts-ignore
        const rootElement = document.getElementById('choice-menu').content.cloneNode(true);
        const shadowRoot = this.attachShadow({ mode: 'open' }).appendChild(rootElement);


        // tactic vars

        //
        let menuElement = this.rootElement = this.shadowRoot.querySelector('ul');


        // initialization event
        const self = this; this.shadowRoot.addEventListener("slotchange", function (event) {
            //@ts-ignore
            [menuElement] = [self.rootElement] = event.target.assignedElements();
            self.checkedElement = self.shadowRoot.querySelector('.checked');
            [].slice.call(self.rootElement.querySelectorAll('li')).forEach(self.itemInitialize);
        });


        // other events:                    
        this.addEventListener('opened', () => this.pickItem(this.selectedElement))
        this.addEventListener('click', this.visibleChanged);


        /// only default slot:
        this.rootElement.addEventListener('click', this.selectedChanged)
    }


    ///
    visibleChanged() {

        const self = this;
        const opened = this.rootElement.classList.contains('active');

        setTimeout(
            () => {
                self.rootElement.classList.toggle('active');
                setTimeout(() => self.checkedElement && self.checkedElement.classList.toggle('active'), +!opened * 200)
            },
            +opened * 150
        );

        this.dispatchEvent(new CustomEvent(opened ? 'closed' : 'opened', { detail: null }))
    }


    /**
     * 
     * @param {HTMLElement} element 
     */
    pickItem(element) {
        setTimeout(() => {
            // console.log(this.checkedElement);

            this.checkedElement.style.top = element.offsetTop + this.offsetHeight + 2 + 'px'
            this.checkedElement.style.right = this.rootElement.offsetWidth - 20 + 'px';  // ? + (16 * 4)  
        })
    }



    /**
     * @param {Event} event
     */
    selectedChanged(event) {
        //@ts-expect-error
        if (event.target.tagName === 'li'.toUpperCase()) {
            
            (this.selectedElement || (this.selectedElement = this.rootElement.querySelector('.selected'))) && this.selectedElement.classList.remove('selected');
            //@ts-expect-error
            (this.selectedElement = event.target).classList.add('selected');

            //@ts-expect-error
            this.checkedElement && this.pickItem(event.target)

            this.dispatchEvent(new CustomEvent("selected_changed", {
                detail: this.checkInfo = {
                    //@ts-expect-error
                    id: event.target.id,
                    //@ts-expect-error
                    metaId: event.target.dataset.id,
                    //@ts-expect-error
                    value: event.target.innerText,
                }
            }))
        }
    }

    /**
     * static constructor
     */
    static __contructor = (function () {
        
        document.body.insertAdjacentHTML('afterbegin', html`
            <template id="choice-menu">
                <style>
                    /* slotted need be styled inline */
                    ::slotted(li),
                    li {                
                        color: white;
                        background-color: #666;
                        padding: 0.1em 1em 0.1em 2em;
                        margin-top: 1px;
                        position: relative;
                    }

                    ::slotted(ul), ul{
                        margin: 0;
                        padding-left: 0;
                        position: absolute;
                        top: 100%;
                        right: .1em;
                        width: max-content;
                        list-style-type: none;
                        transition: .3s;
                        /* display: none; */
                        
                        overflow: hidden;
                        height: 0;
                    }

                    /* стили применяемые к самому  my-paragraph*/
                    :host {
                        margin: 0em;
                        /* margin-right: 2em; */
                        position: relative;
                    }

                    ::slotted(.active), .active{
                        /*display: block !important;*/

                        height: 6em;                        
                        display: block !important;
                    }

                    .selected::after, .checked{
                        content: '';
                        background: url(/static/images/check_mark.svg) no-repeat;
                        background-size: contain;
                        width: 1em;
                        height: 2em;
                        position: absolute;
                        left: .5em;
                        top: 0.15em;
                    }

                    .checked{
                        left: auto;
                        /* opacity: 0; */
                        /* transition: opacity .3s ease .3s; */
                        display: none; 
                        z-index: 5;
                    }

                </style>

                <!-- <slot name="text">My default text</slot> -->
                <div class="checked"></div>
                <slot>
                    <ul>
                        <li class="selected">item 1</li>
                        <li>item 2</li>
                    </ul>
                </slot>

            </template>
        `);

    })()

}


