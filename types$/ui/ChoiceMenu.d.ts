/**
 * @typedef {{id: string, metaId: string, value: string, previousValue: string}} ChoiceDetails
 */
export class ChoiceMenu extends HTMLElement {
    /**
     * static constructor
     */
    static __contructor: void;
    itemStyle: string;
    /** selected element
     * @type {HTMLElement}
     */
    selectedElement: HTMLElement;
    /** checked mark // only for external slot //
     * @type {HTMLElement}
     */
    checkedElement: HTMLElement;
    /** ul
     * @type {HTMLUListElement}
     */
    rootElement: HTMLUListElement;
    /** selected info
     * @type {ChoiceDetails}
     */
    checkInfo: ChoiceDetails;
    itemInitialize: (el: HTMLLIElement) => string;
    /**
     * @deprecated
     * @type number
     */
    get selectedIndex(): number;
    /**
     * @type string
     */
    get selectedItem(): string;
    visibleChanged(): void;
    /**
     *
     * @param {HTMLElement} element
     */
    pickItem(element: HTMLElement): void;
    /**
     * @param {Event & {target: HTMLElement}} event
     */
    selectedChanged(event: Event & {
        target: HTMLElement;
    }): void;
}
export type ChoiceDetails = {
    id: string;
    metaId: string;
    value: string;
    previousValue: string;
};
