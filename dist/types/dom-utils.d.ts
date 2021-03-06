export declare function path(el: HTMLElement, rootNode?: HTMLElement): any;
export declare function hash(el: HTMLElement): void;
export declare function traverseDOM(node: Node, each: (node: HTMLElement, level: number) => boolean, bind?: any, level?: number): void;
export declare function addCSSRule(sheet: any, selector: any, rules: any, index: any): void;
export interface Bounds {
    left: number;
    top: number;
    width: number;
    height: number;
}
export declare function getBounds(element: HTMLElement, bounds?: Bounds): Bounds;
export declare function getViewportBounds(bounds: Bounds): Bounds;
export declare function getDocumentBounds(document: Document, bounds: Bounds): Bounds;
