declare class ChoiceMenu extends HTMLElement {
    itemStyle: string;
    selectedElement: HTMLElement;
    checkedElement: HTMLElement;
    rootElement: HTMLUListElement;
    checkInfo: {
        id: string;
        metaId: string;
        value: string;
    };
    itemInitialize: (el: HTMLLIElement) => any;
    visibleChanged(): void;
    pickItem(element: HTMLElement): void;
    selectedChanged(e: Event): void;
}
//# sourceMappingURL=DropDownMenu.d.ts.map