import * as THREE from 'three';
import * as domUtils from './dom-utils';
export interface WebLayer3DOptions {
    pixelRatio?: number;
    layerSeparation?: number;
    windowWidth?: number;
    windowHeight?: number;
    allowTaint?: boolean;
    onLayerCreate?(layer: WebLayer3D): void;
    onBeforeRasterize?(layer: WebLayer3D): void;
    onAfterRasterize?(layer: WebLayer3D): void;
}
export declare type WebLayerHit = ReturnType<typeof WebLayer3D.prototype.hitTest> & {};
/**
 * Transform a DOM tree into 3D layers.
 *
 * When an instance is created, a `layer` data-attribute is set on the
 * the passed DOM element to match this instance's Object3D id.
 * If the passed DOM element has an `id` attribute, this instance's Object3D name
 * will be set to match the element id.
 *
 * Child WebLayer3D instances can be specified with an empty `layer` data-attribute,
 * which will be set when the child WebLayer3D instance is created automatically.
 * The data-attribute can be specified added in HTML or dynamically:
 *  - `<div data-layer></div>`
 *  - `element.dataset.layer = ''`
 *
 * Additionally, the pixel ratio can be adjusted on each layer, individually:
 *  - `<div data-layer data-layer-pixel-ratio="0.5"></div>`
 *  - `element.dataset.layerPixelRatio = '0.5'`
 *
 * Finally, each layer can prerender multipe states specified as CSS classes delimited by spaces:
 *  - `<div data-layer data-layer-states="near far"></div>`
 *  - `element.dataset.layerStates = 'near far'`
 *
 * Each WebLayer3D will render each of its states with the corresponding CSS class applied to the element.
 * The texture state can be changed by alternating between the specified classes,
 * without requiring the DOM to be re-rendered. Setting a state on a parent layer does
 * not affect the state of a child layer.
 *
 * Every layer has an implicit `hover` state which can be mixed with any other declared state,
 * by using the appropriate CSS selector: `.near.hover` or `.far.hover`. Besides than the
 * `hover` state. The hover state is controlled by interaction rays, which can be provided
 * with the `interactionRays` property.
 *
 * Default dimensions: 1px = 0.001 world dimensions = 1mm (assuming meters)
 *     e.g., 500px width means 0.5meters
 */
export default class WebLayer3D extends THREE.Object3D {
    options: WebLayer3DOptions;
    parentLayer: WebLayer3D | null;
    private _level;
    static domUtils: typeof domUtils;
    static DEBUG_PERFORMANCE: boolean;
    static LAYER_ATTRIBUTE: string;
    static LAYER_CONTAINER_ATTRIBUTE: string;
    static PIXEL_RATIO_ATTRIBUTE: string;
    static STATES_ATTRIBUTE: string;
    static HOVER_DEPTH_ATTRIBUTE: string;
    private static DISABLE_TRANSFORMS_ATTRIBUTE;
    static DEFAULT_LAYER_SEPARATION: number;
    static PIXEL_SIZE: number;
    static GEOMETRY: THREE.Geometry;
    static layersByElement: WeakMap<Element, WebLayer3D>;
    static computeNaturalDistance(projection: THREE.Matrix4 | THREE.Camera, renderer: THREE.WebGLRenderer): number;
    static UPDATE_DEFAULT: (layer: WebLayer3D, lerp?: number) => void;
    static shouldUseTargetLayout(layer: WebLayer3D): boolean;
    static updateLayout(layer: WebLayer3D, lerp: number): void;
    static updateVisibility(layer: WebLayer3D, lerp: number): void;
    private static _hoverLayers;
    private static _updateInteractions;
    private static _scheduleRefresh;
    private static _scheduleRasterizations;
    private static _clearHover;
    private static _setHover;
    private static _setHoverClass;
    private static _didInstallStyleSheet;
    element: HTMLElement;
    content: THREE.Object3D;
    mesh: THREE.Mesh;
    depthMaterial: THREE.MeshDepthMaterial;
    childLayers: WebLayer3D[];
    target: THREE.Object3D;
    contentTarget: THREE.Object3D;
    contentTargetOpacity: number;
    cursor: THREE.Object3D;
    needsRasterize: boolean;
    rootLayer: WebLayer3D;
    /**
     * Specifies whether or not this layer's layout
     * should match the layout stored in the `target` object
     *
     * When set to `always`, the target layout should always be applied.
     * When set to `never`, the target layout should never be applied.
     * When set to `auto`, the target layout should only be applied
     * when the `parentLayer` is the same as the `parent` object.
     *
     * It is the responsibiltiy of the update callback
     * to follow these rules.
     *
     * Defaults to `auto`
     */
    shouldUseTargetLayout: 'always' | 'never' | 'auto';
    /**
     * Specifies whether or not the update callback should update
     * the `content` layout to match the layout stored in
     * the `contentTarget` object
     *
     * It is the responsibiltiy of the update callback
     * to follow these rules.
     *
     * Defaults to `true`
     */
    shouldUseContentTargetLayout: boolean;
    private _lastTargetPosition;
    private _lastContentTargetScale;
    private _hover;
    private _hoverDepth;
    private _states;
    private _pixelRatio;
    private _state;
    private _needsRemoval;
    private _rasterizationQueue;
    private _mutationObserver?;
    private _resizeObserver?;
    private _resourceLoader?;
    private _fontMetrics?;
    private _logger?;
    private _meshMap;
    private _interactionRays;
    private _triggerRefresh?;
    private _processMutations?;
    private _raycaster;
    private _hitIntersections;
    constructor(element: Element, options?: WebLayer3DOptions, parentLayer?: WebLayer3D | null, _level?: number);
    /**
     * Get the texture state.
     * Note: if a state is not available, the `default` state will be rendered.
     */
    readonly state: string;
    readonly texture: THREE.Texture;
    readonly bounds: {
        left: number;
        top: number;
        width: number;
        height: number;
    };
    _normalizedBounds: {
        left: number;
        top: number;
        width: number;
        height: number;
    };
    readonly normalizedBounds: {
        left: number;
        top: number;
        width: number;
        height: number;
    };
    /**
     * A list of Rays to be used for interaction.
     * Can only be set on a root WebLayer3D instance.
     * @param rays
     */
    interactionRays: Array<THREE.Ray | THREE.Object3D>;
    /**
     * Get the hover state
     */
    readonly hover: number;
    /**
     * Get the layer level
     */
    readonly level: number;
    /** If true, this layer needs to be removed from the scene */
    readonly needsRemoval: boolean;
    /**
     * Update the pose and opacity of this layer (does not rerender the DOM).
     * This should be called each frame, and can only be called on a root WebLayer3D instance.
     *
     * @param lerp lerp value
     * @param updateCallback update callback called for each layer. Default is WebLayer3D.UDPATE_DEFAULT
     */
    update(lerp?: number, updateCallback?: (layer: WebLayer3D, lerp: number) => void): void;
    traverseLayers<T extends any[]>(each: (layer: WebLayer3D, ...params: T) => void, ...params: T): void;
    traverseChildLayers<T extends any[]>(each: (layer: WebLayer3D, ...params: T) => void, ...params: T): T;
    getLayerForQuery(selector: string): WebLayer3D | undefined;
    getLayerForElement(element: Element): WebLayer3D | undefined;
    hitTest(ray: THREE.Ray): {
        layer: WebLayer3D;
        intersection: THREE.Intersection;
        target: HTMLElement;
    } | undefined;
    refresh(forceRasterize?: boolean): void;
    dispose(): void;
    private _refreshState;
    private _checkRoot;
    private _refreshBounds;
    private _refreshTargetLayout;
    private _refreshMesh;
    private _showChildLayers;
    private _disableTransforms;
    private _setHoverClasses;
    private _markForRemoval;
    private _refreshChildLayers;
    private _tryConvertToWebLayer3D;
    private _rasterize;
}
