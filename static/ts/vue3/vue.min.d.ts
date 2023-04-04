import * as CSS from './csstype'

declare const camelize: (str: string) => string
declare const capitalize: (str: string) => string
declare const toHandlerKey: (str: string) => string
declare const enum SlotFlags {
  STABLE = 1,
  DYNAMIC = 2,
  FORWARDED = 3
}
type NormalizedStyle = Record<string, string | number>
declare function normalizeStyle(
  value: unknown
): NormalizedStyle | string | undefined
declare function normalizeClass(value: unknown): string
declare function normalizeProps(
  props: Record<string, any> | null
): Record<string, any> | null
declare const toDisplayString: (val: unknown) => string
type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never
type LooseRequired<T> = {
  [P in keyof (T & Required<T>)]: T[P]
}
type IfAny<T, Y, N> = 0 extends 1 & T ? Y : N
declare const enum ReactiveFlags {
  SKIP = '__v_skip',
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly',
  IS_SHALLOW = '__v_isShallow',
  RAW = '__v_raw'
}
type UnwrapNestedRefs<T> = T extends Ref ? T : UnwrapRefSimple<T>
declare function reactive<T extends object>(target: T): UnwrapNestedRefs<T>
declare const ShallowReactiveMarker: unique symbol
type ShallowReactive<T> = T & {
  [ShallowReactiveMarker]?: true
}
declare function shallowReactive<T extends object>(
  target: T
): ShallowReactive<T>
type Primitive = string | number | boolean | bigint | symbol | undefined | null
type Builtin = Primitive | Function | Date | Error | RegExp
type DeepReadonly<T> = T extends Builtin
  ? T
  : T extends Map<infer K, infer V>
  ? ReadonlyMap<DeepReadonly<K>, DeepReadonly<V>>
  : T extends ReadonlyMap<infer K, infer V>
  ? ReadonlyMap<DeepReadonly<K>, DeepReadonly<V>>
  : T extends WeakMap<infer K, infer V>
  ? WeakMap<DeepReadonly<K>, DeepReadonly<V>>
  : T extends Set<infer U>
  ? ReadonlySet<DeepReadonly<U>>
  : T extends ReadonlySet<infer U>
  ? ReadonlySet<DeepReadonly<U>>
  : T extends WeakSet<infer U>
  ? WeakSet<DeepReadonly<U>>
  : T extends Promise<infer U>
  ? Promise<DeepReadonly<U>>
  : T extends Ref<infer U>
  ? Readonly<Ref<DeepReadonly<U>>>
  : T extends {}
  ? {
      readonly [K in keyof T]: DeepReadonly<T[K]>
    }
  : Readonly<T>
declare function readonly<T extends object>(
  target: T
): DeepReadonly<UnwrapNestedRefs<T>>
declare function shallowReadonly<T extends object>(target: T): Readonly<T>
declare function isReactive(value: unknown): boolean
declare function isReadonly(value: unknown): boolean
declare function isShallow(value: unknown): boolean
declare function isProxy(value: unknown): boolean
declare function toRaw<T>(observed: T): T
type Raw<T> = T & {
  [RawSymbol]?: true
}
declare function markRaw<T extends object>(value: T): Raw<T>
type CollectionTypes = IterableCollections | WeakCollections
type IterableCollections = Map<any, any> | Set<any>
type WeakCollections = WeakMap<any, any> | WeakSet<any>
declare const enum TrackOpTypes {
  GET = 'get',
  HAS = 'has',
  ITERATE = 'iterate'
}
declare const enum TriggerOpTypes {
  SET = 'set',
  ADD = 'add',
  DELETE = 'delete',
  CLEAR = 'clear'
}
declare class EffectScope {
  detached: boolean
  private _active
  effects: ReactiveEffect[]
  cleanups: (() => void)[]
  parent: EffectScope | undefined
  scopes: EffectScope[] | undefined
  private index
  constructor(detached?: boolean)
  get active(): boolean
  run<T>(fn: () => T): T | undefined
  on(): void
  off(): void
  stop(fromParent?: boolean): void
}
declare function effectScope(detached?: boolean): EffectScope
declare function getCurrentScope(): EffectScope | undefined
declare function onScopeDispose(fn: () => void): void
declare const ComputedRefSymbol: unique symbol
interface ComputedRef<T = any> extends WritableComputedRef<T> {
  readonly value: T
  [ComputedRefSymbol]: true
}
interface WritableComputedRef<T> extends Ref<T> {
  readonly effect: ReactiveEffect<T>
}
type ComputedGetter<T> = (...args: any[]) => T
type ComputedSetter<T> = (v: T) => void
interface WritableComputedOptions<T> {
  get: ComputedGetter<T>
  set: ComputedSetter<T>
}
declare class ComputedRefImpl<T> {
  private readonly _setter
  dep?: Dep
  private _value
  readonly effect: ReactiveEffect<T>
  readonly __v_isRef = true;
  readonly [ReactiveFlags.IS_READONLY]: boolean
  _dirty: boolean
  _cacheable: boolean
  constructor(
    getter: ComputedGetter<T>,
    _setter: ComputedSetter<T>,
    isReadonly: boolean,
    isSSR: boolean
  )
  get value(): T
  set value(newValue: T)
}
declare function _computed<T>(
  getter: ComputedGetter<T>,
  debugOptions?: DebuggerOptions
): ComputedRef<T>
declare function _computed<T>(
  options: WritableComputedOptions<T>,
  debugOptions?: DebuggerOptions
): WritableComputedRef<T>
type EffectScheduler = (...args: any[]) => any
type DebuggerEvent = {
  effect: ReactiveEffect
} & DebuggerEventExtraInfo
type DebuggerEventExtraInfo = {
  target: object
  type: TrackOpTypes | TriggerOpTypes
  key: any
  newValue?: any
  oldValue?: any
  oldTarget?: Map<any, any> | Set<any>
}
declare class ReactiveEffect<T = any> {
  fn: () => T
  scheduler: EffectScheduler | null
  active: boolean
  deps: Dep[]
  parent: ReactiveEffect | undefined
  computed?: ComputedRefImpl<T>
  allowRecurse?: boolean
  private deferStop?
  onStop?: () => void
  onTrack?: (event: DebuggerEvent) => void
  onTrigger?: (event: DebuggerEvent) => void
  constructor(
    fn: () => T,
    scheduler?: EffectScheduler | null,
    scope?: EffectScope
  )
  run(): T | undefined
  stop(): void
}
interface DebuggerOptions {
  onTrack?: (event: DebuggerEvent) => void
  onTrigger?: (event: DebuggerEvent) => void
}
interface ReactiveEffectOptions extends DebuggerOptions {
  lazy?: boolean
  scheduler?: EffectScheduler
  scope?: EffectScope
  allowRecurse?: boolean
  onStop?: () => void
}
interface ReactiveEffectRunner<T = any> {
  (): T
  effect: ReactiveEffect
}
declare function effect<T = any>(
  fn: () => T,
  options?: ReactiveEffectOptions
): ReactiveEffectRunner
declare function stop(runner: ReactiveEffectRunner): void
type Dep = Set<ReactiveEffect> & TrackedMarkers
type TrackedMarkers = {
  w: number
  n: number
}
declare const RefSymbol: unique symbol
declare const RawSymbol: unique symbol
interface Ref<T = any> {
  value: T
  [RefSymbol]: true
}
declare function isRef<T>(r: Ref<T> | unknown): r is Ref<T>
declare function ref<T extends object>(
  value: T
): [T] extends [Ref] ? T : Ref<UnwrapRef<T>>
declare function ref<T>(value: T): Ref<UnwrapRef<T>>
declare function ref<T = any>(): Ref<T | undefined>
declare const ShallowRefMarker: unique symbol
type ShallowRef<T = any> = Ref<T> & {
  [ShallowRefMarker]?: true
}
declare function shallowRef<T extends object>(
  value: T
): T extends Ref ? T : ShallowRef<T>
declare function shallowRef<T>(value: T): ShallowRef<T>
declare function shallowRef<T = any>(): ShallowRef<T | undefined>
declare function triggerRef(ref: Ref): void
declare function unref<T>(ref: T | Ref<T>): T
declare function proxyRefs<T extends object>(
  objectWithRefs: T
): ShallowUnwrapRef<T>
type CustomRefFactory<T> = (
  track: () => void,
  trigger: () => void
) => {
  get: () => T
  set: (value: T) => void
}
declare function customRef<T>(factory: CustomRefFactory<T>): Ref<T>
type ToRefs<T = any> = {
  [K in keyof T]: ToRef<T[K]>
}
declare function toRefs<T extends object>(object: T): ToRefs<T>
type ToRef<T> = IfAny<T, Ref<T>, [T] extends [Ref] ? T : Ref<T>>
declare function toRef<T extends object, K extends keyof T>(
  object: T,
  key: K
): ToRef<T[K]>
declare function toRef<T extends object, K extends keyof T>(
  object: T,
  key: K,
  defaultValue: T[K]
): ToRef<Exclude<T[K], undefined>>
type BaseTypes = string | number | boolean
type ShallowUnwrapRef<T> = {
  [K in keyof T]: T[K] extends Ref<infer V>
    ? V
    : T[K] extends Ref<infer V> | undefined
    ? unknown extends V
      ? undefined
      : V | undefined
    : T[K]
}
type UnwrapRef<T> = T extends ShallowRef<infer V>
  ? V
  : T extends Ref<infer V>
  ? UnwrapRefSimple<V>
  : UnwrapRefSimple<T>
type UnwrapRefSimple<T> = T extends
  | Function
  | CollectionTypes
  | BaseTypes
  | Ref
  | RefUnwrapBailTypes[keyof RefUnwrapBailTypes]
  | {
      [RawSymbol]?: true
    }
  ? T
  : T extends ReadonlyArray<any>
  ? {
      [K in keyof T]: UnwrapRefSimple<T[K]>
    }
  : T extends object & {
      [ShallowReactiveMarker]?: never
    }
  ? {
      [P in keyof T]: P extends symbol ? T[P] : UnwrapRef<T[P]>
    }
  : T
declare const computed: typeof _computed
type Slot = (...args: any[]) => VNode[]
type InternalSlots = {
  [name: string]: Slot | undefined
}
type Slots = Readonly<InternalSlots>
type RawSlots = {
  [name: string]: unknown
  $stable?: boolean
  _ctx?: ComponentInternalInstance | null
  _?: SlotFlags
}
interface SchedulerJob extends Function {
  id?: number
  pre?: boolean
  active?: boolean
  computed?: boolean
  allowRecurse?: boolean
  ownerInstance?: ComponentInternalInstance
}
type SchedulerJobs = SchedulerJob | SchedulerJob[]
declare function nextTick<T = void>(
  this: T,
  fn?: (this: T) => void
): Promise<void>
declare function queuePostFlushCb(cb: SchedulerJobs): void
type ObjectEmitsOptions = Record<string, ((...args: any[]) => any) | null>
type EmitsOptions = ObjectEmitsOptions | string[]
type EmitsToProps<T extends EmitsOptions> = T extends string[]
  ? {
      [K in string & `on${Capitalize<T[number]>}`]?: (...args: any[]) => any
    }
  : T extends ObjectEmitsOptions
  ? {
      [K in string &
        `on${Capitalize<string & keyof T>}`]?: K extends `on${infer C}`
        ? T[Uncapitalize<C>] extends null
          ? (...args: any[]) => any
          : (
              ...args: T[Uncapitalize<C>] extends (...args: infer P) => any
                ? P
                : never
            ) => any
        : never
    }
  : {}
type EmitFn<
  Options = ObjectEmitsOptions,
  Event extends keyof Options = keyof Options
> = Options extends Array<infer V>
  ? (event: V, ...args: any[]) => void
  : {} extends Options
  ? (event: string, ...args: any[]) => void
  : UnionToIntersection<
      {
        [key in Event]: Options[key] extends (...args: infer Args) => any
          ? (event: key, ...args: Args) => void
          : (event: key, ...args: any[]) => void
      }[Event]
    >
interface ComponentCustomProperties {}
type IsDefaultMixinComponent<T> = T extends ComponentOptionsMixin
  ? ComponentOptionsMixin extends T
    ? true
    : false
  : false
type MixinToOptionTypes<T> = T extends ComponentOptionsBase<
  infer P,
  infer B,
  infer D,
  infer C,
  infer M,
  infer Mixin,
  infer Extends,
  any,
  any,
  infer Defaults
>
  ? OptionTypesType<P & {}, B & {}, D & {}, C & {}, M & {}, Defaults & {}> &
      IntersectionMixin<Mixin> &
      IntersectionMixin<Extends>
  : never
type ExtractMixin<T> = {
  Mixin: MixinToOptionTypes<T>
}[T extends ComponentOptionsMixin ? 'Mixin' : never]
type IntersectionMixin<T> = IsDefaultMixinComponent<T> extends true
  ? OptionTypesType<{}, {}, {}, {}, {}>
  : UnionToIntersection<ExtractMixin<T>>
type UnwrapMixinsType<
  T,
  Type extends OptionTypesKeys
> = T extends OptionTypesType ? T[Type] : never
type EnsureNonVoid<T> = T extends void ? {} : T
type ComponentPublicInstanceConstructor<
  T extends ComponentPublicInstance<
    Props,
    RawBindings,
    D,
    C,
    M
  > = ComponentPublicInstance<any>,
  Props = any,
  RawBindings = any,
  D = any,
  C extends ComputedOptions = ComputedOptions,
  M extends MethodOptions = MethodOptions
> = {
  __isFragment?: never
  __isTeleport?: never
  __isSuspense?: never
  new (...args: any[]): T
}
type CreateComponentPublicInstance<
  P = {},
  B = {},
  D = {},
  C extends ComputedOptions = {},
  M extends MethodOptions = {},
  Mixin extends ComponentOptionsMixin = ComponentOptionsMixin,
  Extends extends ComponentOptionsMixin = ComponentOptionsMixin,
  E extends EmitsOptions = {},
  PublicProps = P,
  Defaults = {},
  MakeDefaultsOptional extends boolean = false,
  I extends ComponentInjectOptions = {},
  PublicMixin = IntersectionMixin<Mixin> & IntersectionMixin<Extends>,
  PublicP = UnwrapMixinsType<PublicMixin, 'P'> & EnsureNonVoid<P>,
  PublicB = UnwrapMixinsType<PublicMixin, 'B'> & EnsureNonVoid<B>,
  PublicD = UnwrapMixinsType<PublicMixin, 'D'> & EnsureNonVoid<D>,
  PublicC extends ComputedOptions = UnwrapMixinsType<PublicMixin, 'C'> &
    EnsureNonVoid<C>,
  PublicM extends MethodOptions = UnwrapMixinsType<PublicMixin, 'M'> &
    EnsureNonVoid<M>,
  PublicDefaults = UnwrapMixinsType<PublicMixin, 'Defaults'> &
    EnsureNonVoid<Defaults>
> = ComponentPublicInstance<
  PublicP,
  PublicB,
  PublicD,
  PublicC,
  PublicM,
  E,
  PublicProps,
  PublicDefaults,
  MakeDefaultsOptional,
  ComponentOptionsBase<P, B, D, C, M, Mixin, Extends, E, string, Defaults>,
  I
>
type ComponentPublicInstance<
  P = {},
  B = {},
  D = {},
  C extends ComputedOptions = {},
  M extends MethodOptions = {},
  E extends EmitsOptions = {},
  PublicProps = P,
  Defaults = {},
  MakeDefaultsOptional extends boolean = false,
  Options = ComponentOptionsBase<any, any, any, any, any, any, any, any, any>,
  I extends ComponentInjectOptions = {}
> = {
  $: ComponentInternalInstance
  $data: D
  $props: Prettify<
    MakeDefaultsOptional extends true
      ? Partial<Defaults> & Omit<P & PublicProps, keyof Defaults>
      : P & PublicProps
  >
  $attrs: Data
  $refs: Data
  $slots: Slots
  $root: ComponentPublicInstance | null
  $parent: ComponentPublicInstance | null
  $emit: EmitFn<E>
  $el: any
  $options: Options & MergedComponentOptionsOverride
  $forceUpdate: () => void
  $nextTick: typeof nextTick
  $watch<T extends string | ((...args: any) => any)>(
    source: T,
    cb: T extends (...args: any) => infer R
      ? (...args: [R, R]) => any
      : (...args: any) => any,
    options?: WatchOptions
  ): WatchStopHandle
} & P &
  ShallowUnwrapRef<B> &
  UnwrapNestedRefs<D> &
  ExtractComputedReturns<C> &
  M &
  ComponentCustomProperties &
  InjectToObject<I>
declare const enum LifecycleHooks {
  BEFORE_CREATE = 'bc',
  CREATED = 'c',
  BEFORE_MOUNT = 'bm',
  MOUNTED = 'm',
  BEFORE_UPDATE = 'bu',
  UPDATED = 'u',
  BEFORE_UNMOUNT = 'bum',
  UNMOUNTED = 'um',
  DEACTIVATED = 'da',
  ACTIVATED = 'a',
  RENDER_TRIGGERED = 'rtg',
  RENDER_TRACKED = 'rtc',
  ERROR_CAPTURED = 'ec',
  SERVER_PREFETCH = 'sp'
}
interface SuspenseProps {
  onResolve?: () => void
  onPending?: () => void
  onFallback?: () => void
  timeout?: string | number
}
declare const SuspenseImpl: {
  name: string
  __isSuspense: boolean
  process(
    n1: VNode | null,
    n2: VNode,
    container: RendererElement,
    anchor: RendererNode | null,
    parentComponent: ComponentInternalInstance | null,
    parentSuspense: SuspenseBoundary | null,
    isSVG: boolean,
    slotScopeIds: string[] | null,
    optimized: boolean,
    rendererInternals: RendererInternals
  ): void
  hydrate: typeof hydrateSuspense
  create: typeof createSuspenseBoundary
  normalize: typeof normalizeSuspenseChildren
}
declare const Suspense: {
  new (): {
    $props: VNodeProps & SuspenseProps
  }
  __isSuspense: true
}
interface SuspenseBoundary {
  vnode: VNode<RendererNode, RendererElement, SuspenseProps>
  parent: SuspenseBoundary | null
  parentComponent: ComponentInternalInstance | null
  isSVG: boolean
  container: RendererElement
  hiddenContainer: RendererElement
  anchor: RendererNode | null
  activeBranch: VNode | null
  pendingBranch: VNode | null
  deps: number
  pendingId: number
  timeout: number
  isInFallback: boolean
  isHydrating: boolean
  isUnmounted: boolean
  effects: Function[]
  resolve(force?: boolean): void
  fallback(fallbackVNode: VNode): void
  move(
    container: RendererElement,
    anchor: RendererNode | null,
    type: MoveType
  ): void
  next(): RendererNode | null
  registerDep(
    instance: ComponentInternalInstance,
    setupRenderEffect: SetupRenderEffectFn
  ): void
  unmount(parentSuspense: SuspenseBoundary | null, doRemove?: boolean): void
}
declare function createSuspenseBoundary(
  vnode: VNode,
  parent: SuspenseBoundary | null,
  parentComponent: ComponentInternalInstance | null,
  container: RendererElement,
  hiddenContainer: RendererElement,
  anchor: RendererNode | null,
  isSVG: boolean,
  slotScopeIds: string[] | null,
  optimized: boolean,
  rendererInternals: RendererInternals,
  isHydrating?: boolean
): SuspenseBoundary
declare function hydrateSuspense(
  node: Node,
  vnode: VNode,
  parentComponent: ComponentInternalInstance | null,
  parentSuspense: SuspenseBoundary | null,
  isSVG: boolean,
  slotScopeIds: string[] | null,
  optimized: boolean,
  rendererInternals: RendererInternals,
  hydrateNode: (
    node: Node,
    vnode: VNode,
    parentComponent: ComponentInternalInstance | null,
    parentSuspense: SuspenseBoundary | null,
    slotScopeIds: string[] | null,
    optimized: boolean
  ) => Node | null
): Node | null
declare function normalizeSuspenseChildren(vnode: VNode): void
type RootHydrateFunction = (
  vnode: VNode<Node, Element>,
  container: (Element | ShadowRoot) & {
    _vnode?: VNode
  }
) => void
interface Renderer<HostElement = RendererElement> {
  render: RootRenderFunction<HostElement>
  createApp: CreateAppFunction<HostElement>
}
interface HydrationRenderer extends Renderer<Element | ShadowRoot> {
  hydrate: RootHydrateFunction
}
type RootRenderFunction<HostElement = RendererElement> = (
  vnode: VNode | null,
  container: HostElement,
  isSVG?: boolean
) => void
interface RendererOptions<
  HostNode = RendererNode,
  HostElement = RendererElement
> {
  patchProp(
    el: HostElement,
    key: string,
    prevValue: any,
    nextValue: any,
    isSVG?: boolean,
    prevChildren?: VNode<HostNode, HostElement>[],
    parentComponent?: ComponentInternalInstance | null,
    parentSuspense?: SuspenseBoundary | null,
    unmountChildren?: UnmountChildrenFn
  ): void
  insert(el: HostNode, parent: HostElement, anchor?: HostNode | null): void
  remove(el: HostNode): void
  createElement(
    type: string,
    isSVG?: boolean,
    isCustomizedBuiltIn?: string,
    vnodeProps?:
      | (VNodeProps & {
          [key: string]: any
        })
      | null
  ): HostElement
  createText(text: string): HostNode
  createComment(text: string): HostNode
  setText(node: HostNode, text: string): void
  setElementText(node: HostElement, text: string): void
  parentNode(node: HostNode): HostElement | null
  nextSibling(node: HostNode): HostNode | null
  querySelector?(selector: string): HostElement | null
  setScopeId?(el: HostElement, id: string): void
  cloneNode?(node: HostNode): HostNode
  insertStaticContent?(
    content: string,
    parent: HostElement,
    anchor: HostNode | null,
    isSVG: boolean,
    start?: HostNode | null,
    end?: HostNode | null
  ): [HostNode, HostNode]
}
interface RendererNode {
  [key: string]: any
}
interface RendererElement extends RendererNode {}
interface RendererInternals<
  HostNode = RendererNode,
  HostElement = RendererElement
> {
  p: PatchFn
  um: UnmountFn
  r: RemoveFn
  m: MoveFn
  mt: MountComponentFn
  mc: MountChildrenFn
  pc: PatchChildrenFn
  pbc: PatchBlockChildrenFn
  n: NextFn
  o: RendererOptions<HostNode, HostElement>
}
type PatchFn = (
  n1: VNode | null,
  n2: VNode,
  container: RendererElement,
  anchor?: RendererNode | null,
  parentComponent?: ComponentInternalInstance | null,
  parentSuspense?: SuspenseBoundary | null,
  isSVG?: boolean,
  slotScopeIds?: string[] | null,
  optimized?: boolean
) => void
type MountChildrenFn = (
  children: VNodeArrayChildren,
  container: RendererElement,
  anchor: RendererNode | null,
  parentComponent: ComponentInternalInstance | null,
  parentSuspense: SuspenseBoundary | null,
  isSVG: boolean,
  slotScopeIds: string[] | null,
  optimized: boolean,
  start?: number
) => void
type PatchChildrenFn = (
  n1: VNode | null,
  n2: VNode,
  container: RendererElement,
  anchor: RendererNode | null,
  parentComponent: ComponentInternalInstance | null,
  parentSuspense: SuspenseBoundary | null,
  isSVG: boolean,
  slotScopeIds: string[] | null,
  optimized: boolean
) => void
type PatchBlockChildrenFn = (
  oldChildren: VNode[],
  newChildren: VNode[],
  fallbackContainer: RendererElement,
  parentComponent: ComponentInternalInstance | null,
  parentSuspense: SuspenseBoundary | null,
  isSVG: boolean,
  slotScopeIds: string[] | null
) => void
type MoveFn = (
  vnode: VNode,
  container: RendererElement,
  anchor: RendererNode | null,
  type: MoveType,
  parentSuspense?: SuspenseBoundary | null
) => void
type NextFn = (vnode: VNode) => RendererNode | null
type UnmountFn = (
  vnode: VNode,
  parentComponent: ComponentInternalInstance | null,
  parentSuspense: SuspenseBoundary | null,
  doRemove?: boolean,
  optimized?: boolean
) => void
type RemoveFn = (vnode: VNode) => void
type UnmountChildrenFn = (
  children: VNode[],
  parentComponent: ComponentInternalInstance | null,
  parentSuspense: SuspenseBoundary | null,
  doRemove?: boolean,
  optimized?: boolean,
  start?: number
) => void
type MountComponentFn = (
  initialVNode: VNode,
  container: RendererElement,
  anchor: RendererNode | null,
  parentComponent: ComponentInternalInstance | null,
  parentSuspense: SuspenseBoundary | null,
  isSVG: boolean,
  optimized: boolean
) => void
type SetupRenderEffectFn = (
  instance: ComponentInternalInstance,
  initialVNode: VNode,
  container: RendererElement,
  anchor: RendererNode | null,
  parentSuspense: SuspenseBoundary | null,
  isSVG: boolean,
  optimized: boolean
) => void
declare const enum MoveType {
  ENTER = 0,
  LEAVE = 1,
  REORDER = 2
}
declare function createRenderer<
  HostNode = RendererNode,
  HostElement = RendererElement
>(options: RendererOptions<HostNode, HostElement>): Renderer<HostElement>
declare function createHydrationRenderer(
  options: RendererOptions<Node, Element>
): HydrationRenderer
type MatchPattern = string | RegExp | (string | RegExp)[]
interface KeepAliveProps {
  include?: MatchPattern
  exclude?: MatchPattern
  max?: number | string
}
declare const KeepAlive: {
  new (): {
    $props: VNodeProps & KeepAliveProps
  }
  __isKeepAlive: true
}
declare function onActivated(
  hook: Function,
  target?: ComponentInternalInstance | null
): void
declare function onDeactivated(
  hook: Function,
  target?: ComponentInternalInstance | null
): void
declare const onBeforeMount: (
  hook: () => any,
  target?: ComponentInternalInstance | null
) => false | Function | undefined
declare const onMounted: (
  hook: () => any,
  target?: ComponentInternalInstance | null
) => false | Function | undefined
declare const onBeforeUpdate: (
  hook: () => any,
  target?: ComponentInternalInstance | null
) => false | Function | undefined
declare const onUpdated: (
  hook: () => any,
  target?: ComponentInternalInstance | null
) => false | Function | undefined
declare const onBeforeUnmount: (
  hook: () => any,
  target?: ComponentInternalInstance | null
) => false | Function | undefined
declare const onUnmounted: (
  hook: () => any,
  target?: ComponentInternalInstance | null
) => false | Function | undefined
declare const onServerPrefetch: (
  hook: () => any,
  target?: ComponentInternalInstance | null
) => false | Function | undefined
type DebuggerHook = (e: DebuggerEvent) => void
declare const onRenderTriggered: (
  hook: DebuggerHook,
  target?: ComponentInternalInstance | null
) => false | Function | undefined
declare const onRenderTracked: (
  hook: DebuggerHook,
  target?: ComponentInternalInstance | null
) => false | Function | undefined
type ErrorCapturedHook<TError = unknown> = (
  err: TError,
  instance: ComponentPublicInstance | null,
  info: string
) => boolean | void
declare function onErrorCaptured<TError = Error>(
  hook: ErrorCapturedHook<TError>,
  target?: ComponentInternalInstance | null
): void
type ComponentPropsOptions<P = Data> = ComponentObjectPropsOptions<P> | string[]
type ComponentObjectPropsOptions<P = Data> = {
  [K in keyof P]: Prop<P[K]> | null
}
type Prop<T, D = T> = PropOptions<T, D> | PropType<T>
type DefaultFactory<T> = (props: Data) => T | null | undefined
interface PropOptions<T = any, D = T> {
  type?: PropType<T> | true | null
  required?: boolean
  default?: D | DefaultFactory<D> | null | undefined | object
  validator?(value: unknown): boolean
  skipCheck?: boolean
  skipFactory?: boolean
}
type PropType<T> = PropConstructor<T> | PropConstructor<T>[]
type PropConstructor<T = any> =
  | {
      new (...args: any[]): T & {}
    }
  | {
      (): T
    }
  | PropMethod<T>
type PropMethod<T, TConstructor = any> = [T] extends [
  ((...args: any) => any) | undefined
]
  ? {
      new (): TConstructor
      (): T
      readonly prototype: TConstructor
    }
  : never
type RequiredKeys<T> = {
  [K in keyof T]: T[K] extends
    | {
        required: true
      }
    | {
        default: any
      }
    | BooleanConstructor
    | {
        type: BooleanConstructor
      }
    ? T[K] extends {
        default: undefined | (() => undefined)
      }
      ? never
      : K
    : never
}[keyof T]
type OptionalKeys<T> = Exclude<keyof T, RequiredKeys<T>>
type DefaultKeys<T> = {
  [K in keyof T]: T[K] extends
    | {
        default: any
      }
    | BooleanConstructor
    | {
        type: BooleanConstructor
      }
    ? T[K] extends {
        type: BooleanConstructor
        required: true
      }
      ? never
      : K
    : never
}[keyof T]
type InferPropType<T> = [T] extends [null]
  ? any
  : [T] extends [
      {
        type: null | true
      }
    ]
  ? any
  : [T] extends [
      | ObjectConstructor
      | {
          type: ObjectConstructor
        }
    ]
  ? Record<string, any>
  : [T] extends [
      | BooleanConstructor
      | {
          type: BooleanConstructor
        }
    ]
  ? boolean
  : [T] extends [
      | DateConstructor
      | {
          type: DateConstructor
        }
    ]
  ? Date
  : [T] extends [
      | (infer U)[]
      | {
          type: (infer U)[]
        }
    ]
  ? U extends DateConstructor
    ? Date | InferPropType<U>
    : InferPropType<U>
  : [T] extends [Prop<infer V, infer D>]
  ? unknown extends V
    ? IfAny<V, V, D>
    : V
  : T
type ExtractPropTypes<O> = {
  [K in keyof Pick<O, RequiredKeys<O>>]: InferPropType<O[K]>
} & {
  [K in keyof Pick<O, OptionalKeys<O>>]?: InferPropType<O[K]>
}
declare const enum BooleanFlags {
  shouldCast = 0,
  shouldCastTrue = 1
}
type ExtractDefaultPropTypes<O> = O extends object
  ? {
      [K in keyof Pick<O, DefaultKeys<O>>]: InferPropType<O[K]>
    }
  : {}
type NormalizedProp =
  | null
  | (PropOptions & {
      [BooleanFlags.shouldCast]?: boolean
      [BooleanFlags.shouldCastTrue]?: boolean
    })
type NormalizedProps = Record<string, NormalizedProp>
type NormalizedPropsOptions = [NormalizedProps, string[]] | []
interface DirectiveBinding<V = any> {
  instance: ComponentPublicInstance | null
  value: V
  oldValue: V | null
  arg?: string
  modifiers: DirectiveModifiers
  dir: ObjectDirective<any, V>
}
type DirectiveHook<T = any, Prev = VNode<any, T> | null, V = any> = (
  el: T,
  binding: DirectiveBinding<V>,
  vnode: VNode<any, T>,
  prevVNode: Prev
) => void
type SSRDirectiveHook = (
  binding: DirectiveBinding,
  vnode: VNode
) => Data | undefined
interface ObjectDirective<T = any, V = any> {
  created?: DirectiveHook<T, null, V>
  beforeMount?: DirectiveHook<T, null, V>
  mounted?: DirectiveHook<T, null, V>
  beforeUpdate?: DirectiveHook<T, VNode<any, T>, V>
  updated?: DirectiveHook<T, VNode<any, T>, V>
  beforeUnmount?: DirectiveHook<T, null, V>
  unmounted?: DirectiveHook<T, null, V>
  getSSRProps?: SSRDirectiveHook
  deep?: boolean
}
type FunctionDirective<T = any, V = any> = DirectiveHook<T, any, V>
type Directive<T = any, V = any> =
  | ObjectDirective<T, V>
  | FunctionDirective<T, V>
type DirectiveModifiers = Record<string, boolean>
type DirectiveArguments = Array<
  | [Directive | undefined]
  | [Directive | undefined, any]
  | [Directive | undefined, any, string]
  | [Directive | undefined, any, string, DirectiveModifiers]
>
declare function withDirectives<T extends VNode>(
  vnode: T,
  directives: DirectiveArguments
): T
declare const enum DeprecationTypes {
  GLOBAL_MOUNT = 'GLOBAL_MOUNT',
  GLOBAL_MOUNT_CONTAINER = 'GLOBAL_MOUNT_CONTAINER',
  GLOBAL_EXTEND = 'GLOBAL_EXTEND',
  GLOBAL_PROTOTYPE = 'GLOBAL_PROTOTYPE',
  GLOBAL_SET = 'GLOBAL_SET',
  GLOBAL_DELETE = 'GLOBAL_DELETE',
  GLOBAL_OBSERVABLE = 'GLOBAL_OBSERVABLE',
  GLOBAL_PRIVATE_UTIL = 'GLOBAL_PRIVATE_UTIL',
  CONFIG_SILENT = 'CONFIG_SILENT',
  CONFIG_DEVTOOLS = 'CONFIG_DEVTOOLS',
  CONFIG_KEY_CODES = 'CONFIG_KEY_CODES',
  CONFIG_PRODUCTION_TIP = 'CONFIG_PRODUCTION_TIP',
  CONFIG_IGNORED_ELEMENTS = 'CONFIG_IGNORED_ELEMENTS',
  CONFIG_WHITESPACE = 'CONFIG_WHITESPACE',
  CONFIG_OPTION_MERGE_STRATS = 'CONFIG_OPTION_MERGE_STRATS',
  INSTANCE_SET = 'INSTANCE_SET',
  INSTANCE_DELETE = 'INSTANCE_DELETE',
  INSTANCE_DESTROY = 'INSTANCE_DESTROY',
  INSTANCE_EVENT_EMITTER = 'INSTANCE_EVENT_EMITTER',
  INSTANCE_EVENT_HOOKS = 'INSTANCE_EVENT_HOOKS',
  INSTANCE_CHILDREN = 'INSTANCE_CHILDREN',
  INSTANCE_LISTENERS = 'INSTANCE_LISTENERS',
  INSTANCE_SCOPED_SLOTS = 'INSTANCE_SCOPED_SLOTS',
  INSTANCE_ATTRS_CLASS_STYLE = 'INSTANCE_ATTRS_CLASS_STYLE',
  OPTIONS_DATA_FN = 'OPTIONS_DATA_FN',
  OPTIONS_DATA_MERGE = 'OPTIONS_DATA_MERGE',
  OPTIONS_BEFORE_DESTROY = 'OPTIONS_BEFORE_DESTROY',
  OPTIONS_DESTROYED = 'OPTIONS_DESTROYED',
  WATCH_ARRAY = 'WATCH_ARRAY',
  PROPS_DEFAULT_THIS = 'PROPS_DEFAULT_THIS',
  V_ON_KEYCODE_MODIFIER = 'V_ON_KEYCODE_MODIFIER',
  CUSTOM_DIR = 'CUSTOM_DIR',
  ATTR_FALSE_VALUE = 'ATTR_FALSE_VALUE',
  ATTR_ENUMERATED_COERCION = 'ATTR_ENUMERATED_COERCION',
  TRANSITION_CLASSES = 'TRANSITION_CLASSES',
  TRANSITION_GROUP_ROOT = 'TRANSITION_GROUP_ROOT',
  COMPONENT_ASYNC = 'COMPONENT_ASYNC',
  COMPONENT_FUNCTIONAL = 'COMPONENT_FUNCTIONAL',
  COMPONENT_V_MODEL = 'COMPONENT_V_MODEL',
  RENDER_FUNCTION = 'RENDER_FUNCTION',
  FILTERS = 'FILTERS',
  PRIVATE_APIS = 'PRIVATE_APIS'
}
declare function warnDeprecation(
  key: DeprecationTypes,
  instance: ComponentInternalInstance | null,
  ...args: any[]
): void
type CompatConfig = Partial<
  Record<DeprecationTypes, boolean | 'suppress-warning'>
> & {
  MODE?: 2 | 3 | ((comp: Component | null) => 2 | 3)
}
declare function configureCompat(config: CompatConfig): void
declare function isCompatEnabled(
  key: DeprecationTypes,
  instance: ComponentInternalInstance | null,
  enableForBuiltIn?: boolean
): boolean
declare function softAssertCompatEnabled(
  key: DeprecationTypes,
  instance: ComponentInternalInstance | null,
  ...args: any[]
): boolean
declare function checkCompatEnabled(
  key: DeprecationTypes,
  instance: ComponentInternalInstance | null,
  ...args: any[]
): boolean
interface ComponentCustomOptions {}
type RenderFunction = () => VNodeChild
interface ComponentOptionsBase<
  Props,
  RawBindings,
  D,
  C extends ComputedOptions,
  M extends MethodOptions,
  Mixin extends ComponentOptionsMixin,
  Extends extends ComponentOptionsMixin,
  E extends EmitsOptions,
  EE extends string = string,
  Defaults = {},
  I extends ComponentInjectOptions = {},
  II extends string = string
> extends LegacyOptions<Props, D, C, M, Mixin, Extends, I, II>,
    ComponentInternalOptions,
    ComponentCustomOptions {
  setup?: (
    this: void,
    props: LooseRequired<
      Props &
        Prettify<
          UnwrapMixinsType<
            IntersectionMixin<Mixin> & IntersectionMixin<Extends>,
            'P'
          >
        >
    >,
    ctx: SetupContext<E>
  ) => Promise<RawBindings> | RawBindings | RenderFunction | void
  name?: string
  template?: string | object
  render?: Function
  components?: Record<string, Component>
  directives?: Record<string, Directive>
  inheritAttrs?: boolean
  emits?: (E | EE[]) & ThisType<void>
  expose?: string[]
  serverPrefetch?(): void | Promise<any>
  compilerOptions?: RuntimeCompilerOptions
  ssrRender?: (
    ctx: any,
    push: (item: any) => void,
    parentInstance: ComponentInternalInstance,
    attrs: Data | undefined,
    $props: ComponentInternalInstance['props'],
    $setup: ComponentInternalInstance['setupState'],
    $data: ComponentInternalInstance['data'],
    $options: ComponentInternalInstance['ctx']
  ) => void
  __ssrInlineRender?: boolean
  __asyncLoader?: () => Promise<ConcreteComponent>
  __asyncResolved?: ConcreteComponent
  call?: (this: unknown, ...args: unknown[]) => never
  __isFragment?: never
  __isTeleport?: never
  __isSuspense?: never
  __defaults?: Defaults
}
interface RuntimeCompilerOptions {
  isCustomElement?: (tag: string) => boolean
  whitespace?: 'preserve' | 'condense'
  comments?: boolean
  delimiters?: [string, string]
}
type ComponentOptionsWithoutProps<
  Props = {},
  RawBindings = {},
  D = {},
  C extends ComputedOptions = {},
  M extends MethodOptions = {},
  Mixin extends ComponentOptionsMixin = ComponentOptionsMixin,
  Extends extends ComponentOptionsMixin = ComponentOptionsMixin,
  E extends EmitsOptions = EmitsOptions,
  EE extends string = string,
  I extends ComponentInjectOptions = {},
  II extends string = string,
  PE = Props & EmitsToProps<E>
> = ComponentOptionsBase<
  PE,
  RawBindings,
  D,
  C,
  M,
  Mixin,
  Extends,
  E,
  EE,
  {},
  I,
  II
> & {
  props?: undefined
} & ThisType<
    CreateComponentPublicInstance<
      PE,
      RawBindings,
      D,
      C,
      M,
      Mixin,
      Extends,
      E,
      PE,
      {},
      false,
      I
    >
  >
type ComponentOptionsWithArrayProps<
  PropNames extends string = string,
  RawBindings = {},
  D = {},
  C extends ComputedOptions = {},
  M extends MethodOptions = {},
  Mixin extends ComponentOptionsMixin = ComponentOptionsMixin,
  Extends extends ComponentOptionsMixin = ComponentOptionsMixin,
  E extends EmitsOptions = EmitsOptions,
  EE extends string = string,
  I extends ComponentInjectOptions = {},
  II extends string = string,
  Props = Prettify<
    Readonly<
      {
        [key in PropNames]?: any
      } & EmitsToProps<E>
    >
  >
> = ComponentOptionsBase<
  Props,
  RawBindings,
  D,
  C,
  M,
  Mixin,
  Extends,
  E,
  EE,
  {},
  I,
  II
> & {
  props: PropNames[]
} & ThisType<
    CreateComponentPublicInstance<
      Props,
      RawBindings,
      D,
      C,
      M,
      Mixin,
      Extends,
      E,
      Props,
      {},
      false,
      I
    >
  >
type ComponentOptionsWithObjectProps<
  PropsOptions = ComponentObjectPropsOptions,
  RawBindings = {},
  D = {},
  C extends ComputedOptions = {},
  M extends MethodOptions = {},
  Mixin extends ComponentOptionsMixin = ComponentOptionsMixin,
  Extends extends ComponentOptionsMixin = ComponentOptionsMixin,
  E extends EmitsOptions = EmitsOptions,
  EE extends string = string,
  I extends ComponentInjectOptions = {},
  II extends string = string,
  Props = Prettify<Readonly<ExtractPropTypes<PropsOptions> & EmitsToProps<E>>>,
  Defaults = ExtractDefaultPropTypes<PropsOptions>
> = ComponentOptionsBase<
  Props,
  RawBindings,
  D,
  C,
  M,
  Mixin,
  Extends,
  E,
  EE,
  Defaults,
  I,
  II
> & {
  props: PropsOptions & ThisType<void>
} & ThisType<
    CreateComponentPublicInstance<
      Props,
      RawBindings,
      D,
      C,
      M,
      Mixin,
      Extends,
      E,
      Props,
      Defaults,
      false,
      I
    >
  >
type ComponentOptions<
  Props = {},
  RawBindings = any,
  D = any,
  C extends ComputedOptions = any,
  M extends MethodOptions = any,
  Mixin extends ComponentOptionsMixin = any,
  Extends extends ComponentOptionsMixin = any,
  E extends EmitsOptions = any
> = ComponentOptionsBase<Props, RawBindings, D, C, M, Mixin, Extends, E> &
  ThisType<
    CreateComponentPublicInstance<
      {},
      RawBindings,
      D,
      C,
      M,
      Mixin,
      Extends,
      E,
      Readonly<Props>
    >
  >
type ComponentOptionsMixin = ComponentOptionsBase<
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any
>
type ComputedOptions = Record<
  string,
  ComputedGetter<any> | WritableComputedOptions<any>
>
interface MethodOptions {
  [key: string]: Function
}
type ExtractComputedReturns<T extends any> = {
  [key in keyof T]: T[key] extends {
    get: (...args: any[]) => infer TReturn
  }
    ? TReturn
    : T[key] extends (...args: any[]) => infer TReturn
    ? TReturn
    : never
}
type ObjectWatchOptionItem = {
  handler: WatchCallback | string
} & WatchOptions
type WatchOptionItem = string | WatchCallback | ObjectWatchOptionItem
type ComponentWatchOptionItem = WatchOptionItem | WatchOptionItem[]
type ComponentWatchOptions = Record<string, ComponentWatchOptionItem>
type ComponentProvideOptions = ObjectProvideOptions | Function
type ObjectProvideOptions = Record<string | symbol, unknown>
type ComponentInjectOptions = string[] | ObjectInjectOptions
type ObjectInjectOptions = Record<
  string | symbol,
  | string
  | symbol
  | {
      from?: string | symbol
      default?: unknown
    }
>
type InjectToObject<T extends ComponentInjectOptions> = T extends string[]
  ? {
      [K in T[number]]?: unknown
    }
  : T extends ObjectInjectOptions
  ? {
      [K in keyof T]?: unknown
    }
  : never
interface LegacyOptions<
  Props,
  D,
  C extends ComputedOptions,
  M extends MethodOptions,
  Mixin extends ComponentOptionsMixin,
  Extends extends ComponentOptionsMixin,
  I extends ComponentInjectOptions,
  II extends string
> {
  compatConfig?: CompatConfig
  [key: string]: any
  data?: (
    this: CreateComponentPublicInstance<
      Props,
      {},
      {},
      {},
      MethodOptions,
      Mixin,
      Extends
    >,
    vm: CreateComponentPublicInstance<
      Props,
      {},
      {},
      {},
      MethodOptions,
      Mixin,
      Extends
    >
  ) => D
  computed?: C
  methods?: M
  watch?: ComponentWatchOptions
  provide?: ComponentProvideOptions
  inject?: I | II[]
  filters?: Record<string, Function>
  mixins?: Mixin[]
  extends?: Extends
  beforeCreate?(): void
  created?(): void
  beforeMount?(): void
  mounted?(): void
  beforeUpdate?(): void
  updated?(): void
  activated?(): void
  deactivated?(): void
  beforeDestroy?(): void
  beforeUnmount?(): void
  destroyed?(): void
  unmounted?(): void
  renderTracked?: DebuggerHook
  renderTriggered?: DebuggerHook
  errorCaptured?: ErrorCapturedHook
  delimiters?: [string, string]
  __differentiator?: keyof D | keyof C | keyof M
}
type MergedHook<T = () => void> = T | T[]
type MergedComponentOptions = ComponentOptions & MergedComponentOptionsOverride
type MergedComponentOptionsOverride = {
  beforeCreate?: MergedHook
  created?: MergedHook
  beforeMount?: MergedHook
  mounted?: MergedHook
  beforeUpdate?: MergedHook
  updated?: MergedHook
  activated?: MergedHook
  deactivated?: MergedHook
  beforeDestroy?: MergedHook
  beforeUnmount?: MergedHook
  destroyed?: MergedHook
  unmounted?: MergedHook
  renderTracked?: MergedHook<DebuggerHook>
  renderTriggered?: MergedHook<DebuggerHook>
  errorCaptured?: MergedHook<ErrorCapturedHook>
}
type OptionTypesKeys = 'P' | 'B' | 'D' | 'C' | 'M' | 'Defaults'
type OptionTypesType<
  P = {},
  B = {},
  D = {},
  C extends ComputedOptions = {},
  M extends MethodOptions = {},
  Defaults = {}
> = {
  P: P
  B: B
  D: D
  C: C
  M: M
  Defaults: Defaults
}
interface InjectionKey<T> extends Symbol {}
declare function provide<T>(
  key: InjectionKey<T> | string | number,
  value: T
): void
declare function inject<T>(key: InjectionKey<T> | string): T | undefined
declare function inject<T>(
  key: InjectionKey<T> | string,
  defaultValue: T,
  treatDefaultAsFactory?: false
): T
declare function inject<T>(
  key: InjectionKey<T> | string,
  defaultValue: T | (() => T),
  treatDefaultAsFactory: true
): T
interface App<HostElement = any> {
  version: string
  config: AppConfig
  use<Options extends unknown[]>(
    plugin: Plugin<Options>,
    ...options: Options
  ): this
  use<Options>(plugin: Plugin<Options>, options: Options): this
  mixin(mixin: ComponentOptions): this
  component(name: string): Component | undefined
  component(name: string, component: Component): this
  directive(name: string): Directive | undefined
  directive(name: string, directive: Directive): this
  mount(
    rootContainer: HostElement | string,
    isHydrate?: boolean,
    isSVG?: boolean
  ): ComponentPublicInstance
  unmount(): void
  provide<T>(key: InjectionKey<T> | string, value: T): this
  _uid: number
  _component: ConcreteComponent
  _props: Data | null
  _container: HostElement | null
  _context: AppContext
  _instance: ComponentInternalInstance | null
  filter?(name: string): Function | undefined
  filter?(name: string, filter: Function): this
  _createRoot?(options: ComponentOptions): ComponentPublicInstance
}
type OptionMergeFunction = (to: unknown, from: unknown) => any
interface AppConfig {
  readonly isNativeTag?: (tag: string) => boolean
  performance: boolean
  optionMergeStrategies: Record<string, OptionMergeFunction>
  globalProperties: ComponentCustomProperties & Record<string, any>
  errorHandler?: (
    err: unknown,
    instance: ComponentPublicInstance | null,
    info: string
  ) => void
  warnHandler?: (
    msg: string,
    instance: ComponentPublicInstance | null,
    trace: string
  ) => void
  compilerOptions: RuntimeCompilerOptions
  isCustomElement?: (tag: string) => boolean
  unwrapInjectedRef?: boolean
}
interface AppContext {
  app: App
  config: AppConfig
  mixins: ComponentOptions[]
  components: Record<string, Component>
  directives: Record<string, Directive>
  provides: Record<string | symbol, any>
  optionsCache: WeakMap<ComponentOptions, MergedComponentOptions>
  propsCache: WeakMap<ConcreteComponent, NormalizedPropsOptions>
  emitsCache: WeakMap<ConcreteComponent, ObjectEmitsOptions | null>
  reload?: () => void
  filters?: Record<string, Function>
}
type PluginInstallFunction<Options> = Options extends unknown[]
  ? (app: App, ...options: Options) => any
  : (app: App, options: Options) => any
type Plugin<Options = any[]> =
  | (PluginInstallFunction<Options> & {
      install?: PluginInstallFunction<Options>
    })
  | {
      install: PluginInstallFunction<Options>
    }
type CreateAppFunction<HostElement> = (
  rootComponent: Component,
  rootProps?: Data | null
) => App<HostElement>
type Hook<T = () => void> = T | T[]
interface BaseTransitionProps<HostElement = RendererElement> {
  mode?: 'in-out' | 'out-in' | 'default'
  appear?: boolean
  persisted?: boolean
  onBeforeEnter?: Hook<(el: HostElement) => void>
  onEnter?: Hook<(el: HostElement, done: () => void) => void>
  onAfterEnter?: Hook<(el: HostElement) => void>
  onEnterCancelled?: Hook<(el: HostElement) => void>
  onBeforeLeave?: Hook<(el: HostElement) => void>
  onLeave?: Hook<(el: HostElement, done: () => void) => void>
  onAfterLeave?: Hook<(el: HostElement) => void>
  onLeaveCancelled?: Hook<(el: HostElement) => void>
  onBeforeAppear?: Hook<(el: HostElement) => void>
  onAppear?: Hook<(el: HostElement, done: () => void) => void>
  onAfterAppear?: Hook<(el: HostElement) => void>
  onAppearCancelled?: Hook<(el: HostElement) => void>
}
interface TransitionHooks<HostElement = RendererElement> {
  mode: BaseTransitionProps['mode']
  persisted: boolean
  beforeEnter(el: HostElement): void
  enter(el: HostElement): void
  leave(el: HostElement, remove: () => void): void
  clone(vnode: VNode): TransitionHooks<HostElement>
  afterLeave?(): void
  delayLeave?(
    el: HostElement,
    earlyRemove: () => void,
    delayedLeave: () => void
  ): void
  delayedLeave?(): void
}
interface TransitionState {
  isMounted: boolean
  isLeaving: boolean
  isUnmounting: boolean
  leavingVNodes: Map<any, Record<string, VNode>>
}
declare function useTransitionState(): TransitionState
declare const BaseTransitionPropsValidators: {
  mode: StringConstructor
  appear: BooleanConstructor
  persisted: BooleanConstructor
  onBeforeEnter: (ArrayConstructor | FunctionConstructor)[]
  onEnter: (ArrayConstructor | FunctionConstructor)[]
  onAfterEnter: (ArrayConstructor | FunctionConstructor)[]
  onEnterCancelled: (ArrayConstructor | FunctionConstructor)[]
  onBeforeLeave: (ArrayConstructor | FunctionConstructor)[]
  onLeave: (ArrayConstructor | FunctionConstructor)[]
  onAfterLeave: (ArrayConstructor | FunctionConstructor)[]
  onLeaveCancelled: (ArrayConstructor | FunctionConstructor)[]
  onBeforeAppear: (ArrayConstructor | FunctionConstructor)[]
  onAppear: (ArrayConstructor | FunctionConstructor)[]
  onAfterAppear: (ArrayConstructor | FunctionConstructor)[]
  onAppearCancelled: (ArrayConstructor | FunctionConstructor)[]
}
declare const BaseTransition: new () => {
  $props: BaseTransitionProps<any>
}
declare function resolveTransitionHooks(
  vnode: VNode,
  props: BaseTransitionProps<any>,
  state: TransitionState,
  instance: ComponentInternalInstance
): TransitionHooks
declare function setTransitionHooks(vnode: VNode, hooks: TransitionHooks): void
declare function getTransitionRawChildren(
  children: VNode[],
  keepComment?: boolean,
  parentKey?: VNode['key']
): VNode[]
type TeleportVNode = VNode<RendererNode, RendererElement, TeleportProps>
interface TeleportProps {
  to: string | RendererElement | null | undefined
  disabled?: boolean
}
declare const TeleportImpl: {
  __isTeleport: boolean
  process(
    n1: TeleportVNode | null,
    n2: TeleportVNode,
    container: RendererElement,
    anchor: RendererNode | null,
    parentComponent: ComponentInternalInstance | null,
    parentSuspense: SuspenseBoundary | null,
    isSVG: boolean,
    slotScopeIds: string[] | null,
    optimized: boolean,
    internals: RendererInternals
  ): void
  remove(
    vnode: VNode,
    parentComponent: ComponentInternalInstance | null,
    parentSuspense: SuspenseBoundary | null,
    optimized: boolean,
    {
      um: unmount,
      o: { remove: hostRemove }
    }: RendererInternals,
    doRemove: Boolean
  ): void
  move: typeof moveTeleport
  hydrate: typeof hydrateTeleport
}
declare const enum TeleportMoveTypes {
  TARGET_CHANGE = 0,
  TOGGLE = 1,
  REORDER = 2
}
declare function moveTeleport(
  vnode: VNode,
  container: RendererElement,
  parentAnchor: RendererNode | null,
  {
    o: { insert },
    m: move
  }: RendererInternals,
  moveType?: TeleportMoveTypes
): void
declare function hydrateTeleport(
  node: Node,
  vnode: TeleportVNode,
  parentComponent: ComponentInternalInstance | null,
  parentSuspense: SuspenseBoundary | null,
  slotScopeIds: string[] | null,
  optimized: boolean,
  {
    o: { nextSibling, parentNode, querySelector }
  }: RendererInternals<Node, Element>,
  hydrateChildren: (
    node: Node | null,
    vnode: VNode,
    container: Element,
    parentComponent: ComponentInternalInstance | null,
    parentSuspense: SuspenseBoundary | null,
    slotScopeIds: string[] | null,
    optimized: boolean
  ) => Node | null
): Node | null
declare const Teleport: {
  new (): {
    $props: VNodeProps & TeleportProps
  }
  __isTeleport: true
}
declare function resolveComponent(
  name: string,
  maybeSelfReference?: boolean
): ConcreteComponent | string
declare const NULL_DYNAMIC_COMPONENT: unique symbol
declare function resolveDynamicComponent(component: unknown): VNodeTypes
declare function resolveDirective(name: string): Directive | undefined
declare function _resolveFilter(name: string): Function | undefined
declare const Fragment: {
  new (): {
    $props: VNodeProps
  }
  __isFragment: true
}
declare const Text: unique symbol
declare const Comment: unique symbol
declare const Static: unique symbol
type VNodeTypes =
  | string
  | VNode
  | Component
  | typeof Text
  | typeof Static
  | typeof Comment
  | typeof Fragment
  | typeof Teleport
  | typeof TeleportImpl
  | typeof Suspense
  | typeof SuspenseImpl
type VNodeRef =
  | string
  | Ref
  | ((
      ref: Element | ComponentPublicInstance | null,
      refs: Record<string, any>
    ) => void)
type VNodeNormalizedRefAtom = {
  i: ComponentInternalInstance
  r: VNodeRef
  k?: string
  f?: boolean
}
type VNodeNormalizedRef = VNodeNormalizedRefAtom | VNodeNormalizedRefAtom[]
type VNodeMountHook = (vnode: VNode) => void
type VNodeUpdateHook = (vnode: VNode, oldVNode: VNode) => void
type VNodeProps = {
  key?: string | number | symbol
  ref?: VNodeRef
  ref_for?: boolean
  ref_key?: string
  onVnodeBeforeMount?: VNodeMountHook | VNodeMountHook[]
  onVnodeMounted?: VNodeMountHook | VNodeMountHook[]
  onVnodeBeforeUpdate?: VNodeUpdateHook | VNodeUpdateHook[]
  onVnodeUpdated?: VNodeUpdateHook | VNodeUpdateHook[]
  onVnodeBeforeUnmount?: VNodeMountHook | VNodeMountHook[]
  onVnodeUnmounted?: VNodeMountHook | VNodeMountHook[]
}
type VNodeChildAtom =
  | VNode
  | string
  | number
  | boolean
  | null
  | undefined
  | void
type VNodeArrayChildren = Array<VNodeArrayChildren | VNodeChildAtom>
type VNodeChild = VNodeChildAtom | VNodeArrayChildren
type VNodeNormalizedChildren = string | VNodeArrayChildren | RawSlots | null
interface VNode<
  HostNode = RendererNode,
  HostElement = RendererElement,
  ExtraProps = {
    [key: string]: any
  }
> {
  __v_isVNode: true
  [ReactiveFlags.SKIP]: true
  type: VNodeTypes
  props: (VNodeProps & ExtraProps) | null
  key: string | number | symbol | null
  ref: VNodeNormalizedRef | null
  scopeId: string | null
  slotScopeIds: string[] | null
  children: VNodeNormalizedChildren
  component: ComponentInternalInstance | null
  dirs: DirectiveBinding[] | null
  transition: TransitionHooks<HostElement> | null
  el: HostNode | null
  anchor: HostNode | null
  target: HostElement | null
  targetAnchor: HostNode | null
  staticCount: number
  suspense: SuspenseBoundary | null
  ssContent: VNode | null
  ssFallback: VNode | null
  shapeFlag: number
  patchFlag: number
  dynamicProps: string[] | null
  dynamicChildren: VNode[] | null
  appContext: AppContext | null
  ctx: ComponentInternalInstance | null
  memo?: any[]
  isCompatRoot?: true
  ce?: (instance: ComponentInternalInstance) => void
}
declare function openBlock(disableTracking?: boolean): void
declare function setBlockTracking(value: number): void
declare function createElementBlock(
  type: string | typeof Fragment,
  props?: Record<string, any> | null,
  children?: any,
  patchFlag?: number,
  dynamicProps?: string[],
  shapeFlag?: number
): VNode<
  RendererNode,
  RendererElement,
  {
    [key: string]: any
  }
>
declare function createBlock(
  type: VNodeTypes | ClassComponent,
  props?: Record<string, any> | null,
  children?: any,
  patchFlag?: number,
  dynamicProps?: string[]
): VNode
declare function isVNode(value: any): value is VNode
declare let vnodeArgsTransformer:
  | ((
      args: Parameters<typeof _createVNode>,
      instance: ComponentInternalInstance | null
    ) => Parameters<typeof _createVNode>)
  | undefined
declare function transformVNodeArgs(
  transformer?: typeof vnodeArgsTransformer
): void
declare const createVNode: typeof _createVNode
declare function _createVNode(
  type: VNodeTypes | ClassComponent | typeof NULL_DYNAMIC_COMPONENT,
  props?: (Data & VNodeProps) | null,
  children?: unknown,
  patchFlag?: number,
  dynamicProps?: string[] | null,
  isBlockNode?: boolean
): VNode
declare function guardReactiveProps(
  props: (Data & VNodeProps) | null
): (Data & VNodeProps) | null
declare function cloneVNode<T, U>(
  vnode: VNode<T, U>,
  extraProps?: (Data & VNodeProps) | null,
  mergeRef?: boolean
): VNode<T, U>
declare function createTextVNode(text?: string, flag?: number): VNode
declare function createStaticVNode(
  content: string,
  numberOfNodes: number
): VNode
declare function createCommentVNode(text?: string, asBlock?: boolean): VNode
declare function normalizeVNode(child: VNodeChild): VNode
declare function mergeProps(...args: (Data & VNodeProps)[]): Data
type Data = Record<string, unknown>
interface ComponentCustomProps {}
interface AllowedComponentProps {
  class?: unknown
  style?: unknown
}
interface ComponentInternalOptions {
  __scopeId?: string
  __cssModules?: Data
  __hmrId?: string
  __isBuiltIn?: boolean
  __file?: string
  __name?: string
}
interface FunctionalComponent<P = {}, E extends EmitsOptions = {}>
  extends ComponentInternalOptions {
  (props: P, ctx: Omit<SetupContext<E>, 'expose'>): any
  props?: ComponentPropsOptions<P>
  emits?: E | (keyof E)[]
  inheritAttrs?: boolean
  displayName?: string
  compatConfig?: CompatConfig
}
interface ClassComponent {
  new (...args: any[]): ComponentPublicInstance<any, any, any, any, any>
  __vccOpts: ComponentOptions
}
type ConcreteComponent<
  Props = {},
  RawBindings = any,
  D = any,
  C extends ComputedOptions = ComputedOptions,
  M extends MethodOptions = MethodOptions
> =
  | ComponentOptions<Props, RawBindings, D, C, M>
  | FunctionalComponent<Props, any>
type Component<
  Props = any,
  RawBindings = any,
  D = any,
  C extends ComputedOptions = ComputedOptions,
  M extends MethodOptions = MethodOptions
> =
  | ConcreteComponent<Props, RawBindings, D, C, M>
  | ComponentPublicInstanceConstructor<Props>
type LifecycleHook<TFn = Function> = TFn[] | null
type SetupContext<E = EmitsOptions> = E extends any
  ? {
      attrs: Data
      slots: Slots
      emit: EmitFn<E>
      expose: (exposed?: Record<string, any>) => void
    }
  : never
type InternalRenderFunction = {
  (
    ctx: ComponentPublicInstance,
    cache: ComponentInternalInstance['renderCache'],
    $props: ComponentInternalInstance['props'],
    $setup: ComponentInternalInstance['setupState'],
    $data: ComponentInternalInstance['data'],
    $options: ComponentInternalInstance['ctx']
  ): VNodeChild
  _rc?: boolean
  _compatChecked?: boolean
  _compatWrapped?: boolean
}
interface ComponentInternalInstance {
  uid: number
  type: ConcreteComponent
  parent: ComponentInternalInstance | null
  root: ComponentInternalInstance
  appContext: AppContext
  vnode: VNode
  next: VNode | null
  subTree: VNode
  effect: ReactiveEffect
  update: SchedulerJob
  render: InternalRenderFunction | null
  ssrRender?: Function | null
  provides: Data
  scope: EffectScope
  accessCache: Data | null
  renderCache: (Function | VNode)[]
  components: Record<string, ConcreteComponent> | null
  directives: Record<string, Directive> | null
  filters?: Record<string, Function>
  propsOptions: NormalizedPropsOptions
  emitsOptions: ObjectEmitsOptions | null
  inheritAttrs?: boolean
  isCE?: boolean
  ceReload?: (newStyles?: string[]) => void
  proxy: ComponentPublicInstance | null
  exposed: Record<string, any> | null
  exposeProxy: Record<string, any> | null
  withProxy: ComponentPublicInstance | null
  ctx: Data
  data: Data
  props: Data
  attrs: Data
  slots: InternalSlots
  refs: Data
  emit: EmitFn
  emitted: Record<string, boolean> | null
  propsDefaults: Data
  setupState: Data
  devtoolsRawSetupState?: any
  setupContext: SetupContext | null
  suspense: SuspenseBoundary | null
  suspenseId: number
  asyncDep: Promise<any> | null
  asyncResolved: boolean
  isMounted: boolean
  isUnmounted: boolean
  isDeactivated: boolean
  [LifecycleHooks.BEFORE_CREATE]: LifecycleHook
  [LifecycleHooks.CREATED]: LifecycleHook
  [LifecycleHooks.BEFORE_MOUNT]: LifecycleHook
  [LifecycleHooks.MOUNTED]: LifecycleHook
  [LifecycleHooks.BEFORE_UPDATE]: LifecycleHook
  [LifecycleHooks.UPDATED]: LifecycleHook
  [LifecycleHooks.BEFORE_UNMOUNT]: LifecycleHook
  [LifecycleHooks.UNMOUNTED]: LifecycleHook
  [LifecycleHooks.RENDER_TRACKED]: LifecycleHook
  [LifecycleHooks.RENDER_TRIGGERED]: LifecycleHook
  [LifecycleHooks.ACTIVATED]: LifecycleHook
  [LifecycleHooks.DEACTIVATED]: LifecycleHook
  [LifecycleHooks.ERROR_CAPTURED]: LifecycleHook
  [LifecycleHooks.SERVER_PREFETCH]: LifecycleHook<() => Promise<unknown>>
  f?: () => void
  n?: () => Promise<void>
  ut?: (vars?: Record<string, string>) => void
}
declare function createComponentInstance(
  vnode: VNode,
  parent: ComponentInternalInstance | null,
  suspense: SuspenseBoundary | null
): ComponentInternalInstance
declare const getCurrentInstance: () => ComponentInternalInstance | null
declare function setupComponent(
  instance: ComponentInternalInstance,
  isSSR?: boolean
): Promise<void> | undefined
declare function registerRuntimeCompiler(_compile: any): void
declare const isRuntimeOnly: () => boolean
type WatchEffect = (onCleanup: OnCleanup) => void
type WatchSource<T = any> = Ref<T> | ComputedRef<T> | (() => T)
type WatchCallback<V = any, OV = any> = (
  value: V,
  oldValue: OV,
  onCleanup: OnCleanup
) => any
type MapSources<T, Immediate> = {
  [K in keyof T]: T[K] extends WatchSource<infer V>
    ? Immediate extends true
      ? V | undefined
      : V
    : T[K] extends object
    ? Immediate extends true
      ? T[K] | undefined
      : T[K]
    : never
}
type OnCleanup = (cleanupFn: () => void) => void
interface WatchOptionsBase extends DebuggerOptions {
  flush?: 'pre' | 'post' | 'sync'
}
interface WatchOptions<Immediate = boolean> extends WatchOptionsBase {
  immediate?: Immediate
  deep?: boolean
}
type WatchStopHandle = () => void
declare function watchEffect(
  effect: WatchEffect,
  options?: WatchOptionsBase
): WatchStopHandle
declare function watchPostEffect(
  effect: WatchEffect,
  options?: DebuggerOptions
): WatchStopHandle
declare function watchSyncEffect(
  effect: WatchEffect,
  options?: DebuggerOptions
): WatchStopHandle
type MultiWatchSources = (WatchSource<unknown> | object)[]
declare function watch<
  T extends MultiWatchSources,
  Immediate extends Readonly<boolean> = false
>(
  sources: [...T],
  cb: WatchCallback<MapSources<T, false>, MapSources<T, Immediate>>,
  options?: WatchOptions<Immediate>
): WatchStopHandle
declare function watch<
  T extends Readonly<MultiWatchSources>,
  Immediate extends Readonly<boolean> = false
>(
  source: T,
  cb: WatchCallback<MapSources<T, false>, MapSources<T, Immediate>>,
  options?: WatchOptions<Immediate>
): WatchStopHandle
declare function watch<T, Immediate extends Readonly<boolean> = false>(
  source: WatchSource<T>,
  cb: WatchCallback<T, Immediate extends true ? T | undefined : T>,
  options?: WatchOptions<Immediate>
): WatchStopHandle
declare function watch<
  T extends object,
  Immediate extends Readonly<boolean> = false
>(
  source: T,
  cb: WatchCallback<T, Immediate extends true ? T | undefined : T>,
  options?: WatchOptions<Immediate>
): WatchStopHandle
type PublicProps = VNodeProps & AllowedComponentProps & ComponentCustomProps
type DefineComponent<
  PropsOrPropOptions = {},
  RawBindings = {},
  D = {},
  C extends ComputedOptions = ComputedOptions,
  M extends MethodOptions = MethodOptions,
  Mixin extends ComponentOptionsMixin = ComponentOptionsMixin,
  Extends extends ComponentOptionsMixin = ComponentOptionsMixin,
  E extends EmitsOptions = {},
  EE extends string = string,
  PP = PublicProps,
  Props = Readonly<
    PropsOrPropOptions extends ComponentPropsOptions
      ? ExtractPropTypes<PropsOrPropOptions>
      : PropsOrPropOptions
  > &
    ({} extends E ? {} : EmitsToProps<E>),
  Defaults = ExtractDefaultPropTypes<PropsOrPropOptions>
> = ComponentPublicInstanceConstructor<
  CreateComponentPublicInstance<
    Props,
    RawBindings,
    D,
    C,
    M,
    Mixin,
    Extends,
    E,
    PP & Props,
    Defaults,
    true
  > &
    Props
> &
  ComponentOptionsBase<
    Props,
    RawBindings,
    D,
    C,
    M,
    Mixin,
    Extends,
    E,
    EE,
    Defaults
  > &
  PP
declare function defineComponent<
  Props extends Record<string, any>,
  E extends EmitsOptions = {},
  EE extends string = string
>(
  setup: (
    props: Props,
    ctx: SetupContext<E>
  ) => RenderFunction | Promise<RenderFunction>,
  options?: Pick<ComponentOptions, 'name' | 'inheritAttrs'> & {
    props?: (keyof Props)[]
    emits?: E | EE[]
  }
): (props: Props & EmitsToProps<E>) => any
declare function defineComponent<
  Props extends Record<string, any>,
  E extends EmitsOptions = {},
  EE extends string = string
>(
  setup: (
    props: Props,
    ctx: SetupContext<E>
  ) => RenderFunction | Promise<RenderFunction>,
  options?: Pick<ComponentOptions, 'name' | 'inheritAttrs'> & {
    props?: ComponentObjectPropsOptions<Props>
    emits?: E | EE[]
  }
): (props: Props & EmitsToProps<E>) => any
declare function defineComponent<
  Props = {},
  RawBindings = {},
  D = {},
  C extends ComputedOptions = {},
  M extends MethodOptions = {},
  Mixin extends ComponentOptionsMixin = ComponentOptionsMixin,
  Extends extends ComponentOptionsMixin = ComponentOptionsMixin,
  E extends EmitsOptions = {},
  EE extends string = string,
  I extends ComponentInjectOptions = {},
  II extends string = string
>(
  options: ComponentOptionsWithoutProps<
    Props,
    RawBindings,
    D,
    C,
    M,
    Mixin,
    Extends,
    E,
    EE,
    I,
    II
  >
): DefineComponent<Props, RawBindings, D, C, M, Mixin, Extends, E, EE>
declare function defineComponent<
  PropNames extends string,
  RawBindings,
  D,
  C extends ComputedOptions = {},
  M extends MethodOptions = {},
  Mixin extends ComponentOptionsMixin = ComponentOptionsMixin,
  Extends extends ComponentOptionsMixin = ComponentOptionsMixin,
  E extends EmitsOptions = {},
  EE extends string = string,
  I extends ComponentInjectOptions = {},
  II extends string = string
>(
  options: ComponentOptionsWithArrayProps<
    PropNames,
    RawBindings,
    D,
    C,
    M,
    Mixin,
    Extends,
    E,
    EE,
    I,
    II
  >
): DefineComponent<
  Readonly<{
    [key in PropNames]?: any
  }>,
  RawBindings,
  D,
  C,
  M,
  Mixin,
  Extends,
  E,
  EE
>
declare function defineComponent<
  PropsOptions extends Readonly<ComponentPropsOptions>,
  RawBindings,
  D,
  C extends ComputedOptions = {},
  M extends MethodOptions = {},
  Mixin extends ComponentOptionsMixin = ComponentOptionsMixin,
  Extends extends ComponentOptionsMixin = ComponentOptionsMixin,
  E extends EmitsOptions = {},
  EE extends string = string,
  I extends ComponentInjectOptions = {},
  II extends string = string
>(
  options: ComponentOptionsWithObjectProps<
    PropsOptions,
    RawBindings,
    D,
    C,
    M,
    Mixin,
    Extends,
    E,
    EE,
    I,
    II
  >
): DefineComponent<PropsOptions, RawBindings, D, C, M, Mixin, Extends, E, EE>
type AsyncComponentResolveResult<T = Component> =
  | T
  | {
      default: T
    }
type AsyncComponentLoader<T = any> = () => Promise<
  AsyncComponentResolveResult<T>
>
interface AsyncComponentOptions<T = any> {
  loader: AsyncComponentLoader<T>
  loadingComponent?: Component
  errorComponent?: Component
  delay?: number
  timeout?: number
  suspensible?: boolean
  onError?: (
    error: Error,
    retry: () => void,
    fail: () => void,
    attempts: number
  ) => any
}
declare function defineAsyncComponent<
  T extends Component = {
    new (): ComponentPublicInstance
  }
>(source: AsyncComponentLoader<T> | AsyncComponentOptions<T>): T
declare function defineProps<PropNames extends string = string>(
  props: PropNames[]
): Prettify<
  Readonly<{
    [key in PropNames]?: any
  }>
>
declare function defineProps<
  PP extends ComponentObjectPropsOptions = ComponentObjectPropsOptions
>(props: PP): Prettify<Readonly<ExtractPropTypes<PP>>>
declare function defineProps<TypeProps>(): ResolveProps<TypeProps>
type ResolveProps<T, BooleanKeys extends keyof T = BooleanKey<T>> = Prettify<
  Readonly<
    T & {
      [K in BooleanKeys]-?: boolean
    }
  >
>
type BooleanKey<T, K extends keyof T = keyof T> = K extends any
  ? [T[K]] extends [boolean | undefined]
    ? K
    : never
  : never
declare function defineEmits<EE extends string = string>(
  emitOptions: EE[]
): EmitFn<EE[]>
declare function defineEmits<E extends EmitsOptions = EmitsOptions>(
  emitOptions: E
): EmitFn<E>
declare function defineEmits<
  T extends ((...args: any[]) => any) | Record<string, any[]>
>(): T extends (...args: any[]) => any ? T : ShortEmits<T>
type RecordToUnion<T extends Record<string, any>> = T[keyof T]
type ShortEmits<T extends Record<string, any>> = UnionToIntersection<
  RecordToUnion<{
    [K in keyof T]: (evt: K, ...args: T[K]) => void
  }>
>
declare function defineExpose<
  Exposed extends Record<string, any> = Record<string, any>
>(exposed?: Exposed): void
declare function defineOptions<
  RawBindings = {},
  D = {},
  C extends ComputedOptions = {},
  M extends MethodOptions = {},
  Mixin extends ComponentOptionsMixin = ComponentOptionsMixin,
  Extends extends ComponentOptionsMixin = ComponentOptionsMixin,
  E extends EmitsOptions = EmitsOptions,
  EE extends string = string
>(
  options?: ComponentOptionsWithoutProps<
    {},
    RawBindings,
    D,
    C,
    M,
    Mixin,
    Extends,
    E,
    EE
  > & {
    emits?: undefined
    expose?: undefined
  }
): void
type NotUndefined<T> = T extends undefined ? never : T
type InferDefaults<T> = {
  [K in keyof T]?: InferDefault<T, NotUndefined<T[K]>>
}
type InferDefault<P, T> = T extends
  | null
  | number
  | string
  | boolean
  | symbol
  | Function
  ? T | ((props: P) => T)
  : (props: P) => T
type PropsWithDefaults<Base, Defaults> = Base & {
  [K in keyof Defaults]: K extends keyof Base
    ? Defaults[K] extends undefined
      ? Base[K]
      : NotUndefined<Base[K]>
    : never
}
declare function withDefaults<Props, Defaults extends InferDefaults<Props>>(
  props: Props,
  defaults: Defaults
): PropsWithDefaults<Props, Defaults>
declare function useSlots(): SetupContext['slots']
declare function useAttrs(): SetupContext['attrs']
declare function mergeDefaults(
  raw: ComponentPropsOptions,
  defaults: Record<string, any>
): ComponentObjectPropsOptions
declare function createPropsRestProxy(
  props: any,
  excludedKeys: string[]
): Record<string, any>
declare function withAsyncContext(getAwaitable: () => any): any[]
type RawProps = VNodeProps & {
  __v_isVNode?: never
  [Symbol.iterator]?: never
} & Record<string, any>
type RawChildren =
  | string
  | number
  | boolean
  | VNode
  | VNodeArrayChildren
  | (() => any)
interface Constructor<P = any> {
  __isFragment?: never
  __isTeleport?: never
  __isSuspense?: never
  new (...args: any[]): {
    $props: P
  }
}
declare function h(type: string, children?: RawChildren): VNode
declare function h(
  type: string,
  props?: RawProps | null,
  children?: RawChildren | RawSlots
): VNode
declare function h(
  type: typeof Text | typeof Comment,
  children?: string | number | boolean
): VNode
declare function h(
  type: typeof Text | typeof Comment,
  props?: null,
  children?: string | number | boolean
): VNode
declare function h(type: typeof Fragment, children?: VNodeArrayChildren): VNode
declare function h(
  type: typeof Fragment,
  props?: RawProps | null,
  children?: VNodeArrayChildren
): VNode
declare function h(
  type: typeof Teleport,
  props: RawProps & TeleportProps,
  children: RawChildren | RawSlots
): VNode
declare function h(type: typeof Suspense, children?: RawChildren): VNode
declare function h(
  type: typeof Suspense,
  props?: (RawProps & SuspenseProps) | null,
  children?: RawChildren | RawSlots
): VNode
declare function h<P, E extends EmitsOptions = {}>(
  type: FunctionalComponent<P, E>,
  props?: (RawProps & P) | ({} extends P ? null : never),
  children?: RawChildren | RawSlots
): VNode
declare function h(type: Component, children?: RawChildren): VNode
declare function h<P>(
  type: ConcreteComponent | string,
  children?: RawChildren
): VNode
declare function h<P>(
  type: ConcreteComponent<P> | string,
  props?: (RawProps & P) | ({} extends P ? null : never),
  children?: RawChildren
): VNode
declare function h<P>(
  type: Component<P>,
  props?: (RawProps & P) | null,
  children?: RawChildren | RawSlots
): VNode
declare function h<P>(
  type: ComponentOptions<P>,
  props?: (RawProps & P) | ({} extends P ? null : never),
  children?: RawChildren | RawSlots
): VNode
declare function h(type: Constructor, children?: RawChildren): VNode
declare function h<P>(
  type: Constructor<P>,
  props?: (RawProps & P) | ({} extends P ? null : never),
  children?: RawChildren | RawSlots
): VNode
declare function h(type: DefineComponent, children?: RawChildren): VNode
declare function h<P>(
  type: DefineComponent<P>,
  props?: (RawProps & P) | ({} extends P ? null : never),
  children?: RawChildren | RawSlots
): VNode
declare const ssrContextKey: unique symbol
declare const useSSRContext: <T = Record<string, any>>() => T | undefined
declare function warn(msg: string, ...args: any[]): void
declare function assertNumber(val: unknown, type: string): void
declare const enum ErrorCodes {
  SETUP_FUNCTION = 0,
  RENDER_FUNCTION = 1,
  WATCH_GETTER = 2,
  WATCH_CALLBACK = 3,
  WATCH_CLEANUP = 4,
  NATIVE_EVENT_HANDLER = 5,
  COMPONENT_EVENT_HANDLER = 6,
  VNODE_HOOK = 7,
  DIRECTIVE_HOOK = 8,
  TRANSITION_HOOK = 9,
  APP_ERROR_HANDLER = 10,
  APP_WARN_HANDLER = 11,
  FUNCTION_REF = 12,
  ASYNC_COMPONENT_LOADER = 13,
  SCHEDULER = 14
}
type ErrorTypes = LifecycleHooks | ErrorCodes
declare function callWithErrorHandling(
  fn: Function,
  instance: ComponentInternalInstance | null,
  type: ErrorTypes,
  args?: unknown[]
): any
declare function callWithAsyncErrorHandling(
  fn: Function | Function[],
  instance: ComponentInternalInstance | null,
  type: ErrorTypes,
  args?: unknown[]
): any[]
declare function handleError(
  err: unknown,
  instance: ComponentInternalInstance | null,
  type: ErrorTypes,
  throwInDev?: boolean
): void
declare function initCustomFormatter(): void
interface AppRecord {
  id: number
  app: App
  version: string
  types: Record<string, string | Symbol>
}
interface DevtoolsHook {
  enabled?: boolean
  emit: (event: string, ...payload: any[]) => void
  on: (event: string, handler: Function) => void
  once: (event: string, handler: Function) => void
  off: (event: string, handler: Function) => void
  appRecords: AppRecord[]
  cleanupBuffer?: (matchArg: unknown) => boolean
}
declare let devtools: DevtoolsHook
declare function setDevtoolsHook(hook: DevtoolsHook, target: any): void
type HMRComponent = ComponentOptions | ClassComponent
interface HMRRuntime {
  createRecord: typeof createRecord
  rerender: typeof rerender
  reload: typeof reload
}
declare function createRecord(id: string, initialDef: HMRComponent): boolean
declare function rerender(id: string, newRender?: Function): void
declare function reload(id: string, newComp: HMRComponent): void
declare function setCurrentRenderingInstance(
  instance: ComponentInternalInstance | null
): ComponentInternalInstance | null
declare function pushScopeId(id: string | null): void
declare function popScopeId(): void
declare const withScopeId: (_id: string) => typeof withCtx
declare function withCtx(
  fn: Function,
  ctx?: ComponentInternalInstance | null,
  isNonScopedSlot?: boolean
): Function
declare function renderList(
  source: string,
  renderItem: (value: string, index: number) => VNodeChild
): VNodeChild[]
declare function renderList(
  source: number,
  renderItem: (value: number, index: number) => VNodeChild
): VNodeChild[]
declare function renderList<T>(
  source: T[],
  renderItem: (value: T, index: number) => VNodeChild
): VNodeChild[]
declare function renderList<T>(
  source: Iterable<T>,
  renderItem: (value: T, index: number) => VNodeChild
): VNodeChild[]
declare function renderList<T>(
  source: T,
  renderItem: <K extends keyof T>(
    value: T[K],
    key: K,
    index: number
  ) => VNodeChild
): VNodeChild[]
declare function toHandlers(
  obj: Record<string, any>,
  preserveCaseIfNecessary?: boolean
): Record<string, any>
declare function renderSlot(
  slots: Slots,
  name: string,
  props?: Data,
  fallback?: () => VNodeArrayChildren,
  noSlotted?: boolean
): VNode
type SSRSlot = (...args: any[]) => VNode[] | undefined
interface CompiledSlotDescriptor {
  name: string
  fn: SSRSlot
  key?: string
}
declare function createSlots(
  slots: Record<string, SSRSlot>,
  dynamicSlots: (
    | CompiledSlotDescriptor
    | CompiledSlotDescriptor[]
    | undefined
  )[]
): Record<string, SSRSlot>
declare function withMemo(
  memo: any[],
  render: () => VNode<any, any>,
  cache: any[],
  index: number
): VNode<
  any,
  any,
  {
    [key: string]: any
  }
>
declare function isMemoSame(cached: VNode, memo: any[]): boolean
declare function renderComponentRoot(instance: ComponentInternalInstance): VNode
type LegacyConfig = {
  silent?: boolean
  devtools?: boolean
  ignoredElements?: (string | RegExp)[]
  keyCodes?: Record<string, number | number[]>
  productionTip?: boolean
}
type LegacyPublicInstance = ComponentPublicInstance & LegacyPublicProperties
interface LegacyPublicProperties {
  $set(target: object, key: string, value: any): void
  $delete(target: object, key: string): void
  $mount(el?: string | Element): this
  $destroy(): void
  $scopedSlots: Slots
  $on(event: string | string[], fn: Function): this
  $once(event: string, fn: Function): this
  $off(event?: string | string[], fn?: Function): this
  $children: LegacyPublicProperties[]
  $listeners: Record<string, Function | Function[]>
}
type CompatVue = Pick<App, 'version' | 'component' | 'directive'> & {
  configureCompat: typeof configureCompat
  new (options?: ComponentOptions): LegacyPublicInstance
  version: string
  config: AppConfig & LegacyConfig
  nextTick: typeof nextTick
  use(plugin: Plugin, ...options: any[]): CompatVue
  mixin(mixin: ComponentOptions): CompatVue
  component(name: string): Component | undefined
  component(name: string, component: Component): CompatVue
  directive(name: string): Directive | undefined
  directive(name: string, directive: Directive): CompatVue
  compile(template: string): RenderFunction
  extend: (options?: ComponentOptions) => CompatVue
  set(target: any, key: string | number | symbol, value: any): void
  delete(target: any, key: string | number | symbol): void
  observable: typeof reactive
  filter(name: string, arg?: any): null
  cid: number
  options: ComponentOptions
  util: any
  super: CompatVue
}
declare function createCompatVue(
  createApp: CreateAppFunction<Element>,
  createSingletonApp: CreateAppFunction<Element>
): CompatVue
declare const version: string
declare const ssrUtils: {
  createComponentInstance: typeof createComponentInstance
  setupComponent: typeof setupComponent
  renderComponentRoot: typeof renderComponentRoot
  setCurrentRenderingInstance: typeof setCurrentRenderingInstance
  isVNode: typeof isVNode
  normalizeVNode: typeof normalizeVNode
}
declare const resolveFilter: typeof _resolveFilter | null
declare const compatUtils: {
  warnDeprecation: typeof warnDeprecation
  createCompatVue: typeof createCompatVue
  isCompatEnabled: typeof isCompatEnabled
  checkCompatEnabled: typeof checkCompatEnabled
  softAssertCompatEnabled: typeof softAssertCompatEnabled
}
declare const enum TextModes {
  DATA = 0,
  RCDATA = 1,
  RAWTEXT = 2,
  CDATA = 3,
  ATTRIBUTE_VALUE = 4
}
type CompilerCompatConfig = Partial<
  Record<CompilerDeprecationTypes, boolean | 'suppress-warning'>
> & {
  MODE?: 2 | 3
}
interface CompilerCompatOptions {
  compatConfig?: CompilerCompatConfig
}
declare const enum CompilerDeprecationTypes {
  COMPILER_IS_ON_ELEMENT = 'COMPILER_IS_ON_ELEMENT',
  COMPILER_V_BIND_SYNC = 'COMPILER_V_BIND_SYNC',
  COMPILER_V_BIND_PROP = 'COMPILER_V_BIND_PROP',
  COMPILER_V_BIND_OBJECT_ORDER = 'COMPILER_V_BIND_OBJECT_ORDER',
  COMPILER_V_ON_NATIVE = 'COMPILER_V_ON_NATIVE',
  COMPILER_V_IF_V_FOR_PRECEDENCE = 'COMPILER_V_IF_V_FOR_PRECEDENCE',
  COMPILER_NATIVE_TEMPLATE = 'COMPILER_NATIVE_TEMPLATE',
  COMPILER_INLINE_TEMPLATE = 'COMPILER_INLINE_TEMPLATE',
  COMPILER_FILTERS = 'COMPILER_FILTER'
}
type NodeTransform = (
  node: RootNode | TemplateChildNode,
  context: TransformContext
) => void | (() => void) | (() => void)[]
type DirectiveTransform = (
  dir: DirectiveNode,
  node: ElementNode,
  context: TransformContext,
  augmentor?: (ret: DirectiveTransformResult) => DirectiveTransformResult
) => DirectiveTransformResult
interface DirectiveTransformResult {
  props: Property[]
  needRuntime?: boolean | symbol
  ssrTagParts?: TemplateLiteral['elements']
}
interface ImportItem {
  exp: string | ExpressionNode
  path: string
}
interface TransformContext
  extends Required<
      Omit<TransformOptions, 'filename' | keyof CompilerCompatOptions>
    >,
    CompilerCompatOptions {
  selfName: string | null
  root: RootNode
  helpers: Map<symbol, number>
  components: Set<string>
  directives: Set<string>
  hoists: (JSChildNode | null)[]
  imports: ImportItem[]
  temps: number
  cached: number
  identifiers: {
    [name: string]: number | undefined
  }
  scopes: {
    vFor: number
    vSlot: number
    vPre: number
    vOnce: number
  }
  parent: ParentNode | null
  childIndex: number
  currentNode: RootNode | TemplateChildNode | null
  inVOnce: boolean
  helper<T extends symbol>(name: T): T
  removeHelper<T extends symbol>(name: T): void
  helperString(name: symbol): string
  replaceNode(node: TemplateChildNode): void
  removeNode(node?: TemplateChildNode): void
  onNodeRemoved(): void
  addIdentifiers(exp: ExpressionNode | string): void
  removeIdentifiers(exp: ExpressionNode | string): void
  hoist(exp: string | JSChildNode | ArrayExpression): SimpleExpressionNode
  cache<T extends JSChildNode>(exp: T, isVNode?: boolean): CacheExpression | T
  constantCache: Map<TemplateChildNode, ConstantTypes>
  filters?: Set<string>
}
interface ForParseResult {
  source: ExpressionNode
  value: ExpressionNode | undefined
  key: ExpressionNode | undefined
  index: ExpressionNode | undefined
}
declare const FRAGMENT: unique symbol
declare const RENDER_LIST: unique symbol
declare const RENDER_SLOT: unique symbol
declare const CREATE_SLOTS: unique symbol
declare const WITH_MEMO: unique symbol
type PropsExpression = ObjectExpression | CallExpression | ExpressionNode
type Namespace = number
declare const enum NodeTypes {
  ROOT = 0,
  ELEMENT = 1,
  TEXT = 2,
  COMMENT = 3,
  SIMPLE_EXPRESSION = 4,
  INTERPOLATION = 5,
  ATTRIBUTE = 6,
  DIRECTIVE = 7,
  COMPOUND_EXPRESSION = 8,
  IF = 9,
  IF_BRANCH = 10,
  FOR = 11,
  TEXT_CALL = 12,
  VNODE_CALL = 13,
  JS_CALL_EXPRESSION = 14,
  JS_OBJECT_EXPRESSION = 15,
  JS_PROPERTY = 16,
  JS_ARRAY_EXPRESSION = 17,
  JS_FUNCTION_EXPRESSION = 18,
  JS_CONDITIONAL_EXPRESSION = 19,
  JS_CACHE_EXPRESSION = 20,
  JS_BLOCK_STATEMENT = 21,
  JS_TEMPLATE_LITERAL = 22,
  JS_IF_STATEMENT = 23,
  JS_ASSIGNMENT_EXPRESSION = 24,
  JS_SEQUENCE_EXPRESSION = 25,
  JS_RETURN_STATEMENT = 26
}
declare const enum ElementTypes {
  ELEMENT = 0,
  COMPONENT = 1,
  SLOT = 2,
  TEMPLATE = 3
}
interface Node {
  type: NodeTypes
  loc: SourceLocation
}
interface SourceLocation {
  start: Position
  end: Position
  source: string
}
interface Position {
  offset: number
  line: number
  column: number
}
type ParentNode = RootNode | ElementNode | IfBranchNode | ForNode
type ExpressionNode = SimpleExpressionNode | CompoundExpressionNode
type TemplateChildNode =
  | ElementNode
  | InterpolationNode
  | CompoundExpressionNode
  | TextNode
  | CommentNode
  | IfNode
  | IfBranchNode
  | ForNode
  | TextCallNode
interface RootNode extends Node {
  type: NodeTypes.ROOT
  children: TemplateChildNode[]
  helpers: Set<symbol>
  components: string[]
  directives: string[]
  hoists: (JSChildNode | null)[]
  imports: ImportItem[]
  cached: number
  temps: number
  ssrHelpers?: symbol[]
  codegenNode?: TemplateChildNode | JSChildNode | BlockStatement
  filters?: string[]
}
type ElementNode =
  | PlainElementNode
  | ComponentNode
  | SlotOutletNode
  | TemplateNode
interface BaseElementNode extends Node {
  type: NodeTypes.ELEMENT
  ns: Namespace
  tag: string
  tagType: ElementTypes
  isSelfClosing: boolean
  props: Array<AttributeNode | DirectiveNode>
  children: TemplateChildNode[]
}
interface PlainElementNode extends BaseElementNode {
  tagType: ElementTypes.ELEMENT
  codegenNode:
    | VNodeCall
    | SimpleExpressionNode
    | CacheExpression
    | MemoExpression
    | undefined
  ssrCodegenNode?: TemplateLiteral
}
interface ComponentNode extends BaseElementNode {
  tagType: ElementTypes.COMPONENT
  codegenNode: VNodeCall | CacheExpression | MemoExpression | undefined
  ssrCodegenNode?: CallExpression
}
interface SlotOutletNode extends BaseElementNode {
  tagType: ElementTypes.SLOT
  codegenNode: RenderSlotCall | CacheExpression | undefined
  ssrCodegenNode?: CallExpression
}
interface TemplateNode extends BaseElementNode {
  tagType: ElementTypes.TEMPLATE
  codegenNode: undefined
}
interface TextNode extends Node {
  type: NodeTypes.TEXT
  content: string
}
interface CommentNode extends Node {
  type: NodeTypes.COMMENT
  content: string
}
interface AttributeNode extends Node {
  type: NodeTypes.ATTRIBUTE
  name: string
  value: TextNode | undefined
}
interface DirectiveNode extends Node {
  type: NodeTypes.DIRECTIVE
  name: string
  exp: ExpressionNode | undefined
  arg: ExpressionNode | undefined
  modifiers: string[]
  parseResult?: ForParseResult
}
declare const enum ConstantTypes {
  NOT_CONSTANT = 0,
  CAN_SKIP_PATCH = 1,
  CAN_HOIST = 2,
  CAN_STRINGIFY = 3
}
interface SimpleExpressionNode extends Node {
  type: NodeTypes.SIMPLE_EXPRESSION
  content: string
  isStatic: boolean
  constType: ConstantTypes
  hoisted?: JSChildNode
  identifiers?: string[]
  isHandlerKey?: boolean
}
interface InterpolationNode extends Node {
  type: NodeTypes.INTERPOLATION
  content: ExpressionNode
}
interface CompoundExpressionNode extends Node {
  type: NodeTypes.COMPOUND_EXPRESSION
  children: (
    | SimpleExpressionNode
    | CompoundExpressionNode
    | InterpolationNode
    | TextNode
    | string
    | symbol
  )[]
  identifiers?: string[]
  isHandlerKey?: boolean
}
interface IfNode extends Node {
  type: NodeTypes.IF
  branches: IfBranchNode[]
  codegenNode?: IfConditionalExpression | CacheExpression
}
interface IfBranchNode extends Node {
  type: NodeTypes.IF_BRANCH
  condition: ExpressionNode | undefined
  children: TemplateChildNode[]
  userKey?: AttributeNode | DirectiveNode
  isTemplateIf?: boolean
}
interface ForNode extends Node {
  type: NodeTypes.FOR
  source: ExpressionNode
  valueAlias: ExpressionNode | undefined
  keyAlias: ExpressionNode | undefined
  objectIndexAlias: ExpressionNode | undefined
  parseResult: ForParseResult
  children: TemplateChildNode[]
  codegenNode?: ForCodegenNode
}
interface TextCallNode extends Node {
  type: NodeTypes.TEXT_CALL
  content: TextNode | InterpolationNode | CompoundExpressionNode
  codegenNode: CallExpression | SimpleExpressionNode
}
type TemplateTextChildNode =
  | TextNode
  | InterpolationNode
  | CompoundExpressionNode
interface VNodeCall extends Node {
  type: NodeTypes.VNODE_CALL
  tag: string | symbol | CallExpression
  props: PropsExpression | undefined
  children:
    | TemplateChildNode[]
    | TemplateTextChildNode
    | SlotsExpression
    | ForRenderListExpression
    | SimpleExpressionNode
    | undefined
  patchFlag: string | undefined
  dynamicProps: string | SimpleExpressionNode | undefined
  directives: DirectiveArguments | undefined
  isBlock: boolean
  disableTracking: boolean
  isComponent: boolean
}
type JSChildNode =
  | VNodeCall
  | CallExpression
  | ObjectExpression
  | ArrayExpression
  | ExpressionNode
  | FunctionExpression
  | ConditionalExpression
  | CacheExpression
  | AssignmentExpression
  | SequenceExpression
interface CallExpression extends Node {
  type: NodeTypes.JS_CALL_EXPRESSION
  callee: string | symbol
  arguments: (
    | string
    | symbol
    | JSChildNode
    | SSRCodegenNode
    | TemplateChildNode
    | TemplateChildNode[]
  )[]
}
interface ObjectExpression extends Node {
  type: NodeTypes.JS_OBJECT_EXPRESSION
  properties: Array<Property>
}
interface Property extends Node {
  type: NodeTypes.JS_PROPERTY
  key: ExpressionNode
  value: JSChildNode
}
interface ArrayExpression extends Node {
  type: NodeTypes.JS_ARRAY_EXPRESSION
  elements: Array<string | Node>
}
interface FunctionExpression extends Node {
  type: NodeTypes.JS_FUNCTION_EXPRESSION
  params: ExpressionNode | string | (ExpressionNode | string)[] | undefined
  returns?: TemplateChildNode | TemplateChildNode[] | JSChildNode
  body?: BlockStatement | IfStatement
  newline: boolean
  isSlot: boolean
  isNonScopedSlot?: boolean
}
interface ConditionalExpression extends Node {
  type: NodeTypes.JS_CONDITIONAL_EXPRESSION
  test: JSChildNode
  consequent: JSChildNode
  alternate: JSChildNode
  newline: boolean
}
interface CacheExpression extends Node {
  type: NodeTypes.JS_CACHE_EXPRESSION
  index: number
  value: JSChildNode
  isVNode: boolean
}
interface MemoExpression extends CallExpression {
  callee: typeof WITH_MEMO
  arguments: [ExpressionNode, MemoFactory, string, string]
}
interface MemoFactory extends FunctionExpression {
  returns: BlockCodegenNode
}
type SSRCodegenNode =
  | BlockStatement
  | TemplateLiteral
  | IfStatement
  | AssignmentExpression
  | ReturnStatement
  | SequenceExpression
interface BlockStatement extends Node {
  type: NodeTypes.JS_BLOCK_STATEMENT
  body: (JSChildNode | IfStatement)[]
}
interface TemplateLiteral extends Node {
  type: NodeTypes.JS_TEMPLATE_LITERAL
  elements: (string | JSChildNode)[]
}
interface IfStatement extends Node {
  type: NodeTypes.JS_IF_STATEMENT
  test: ExpressionNode
  consequent: BlockStatement
  alternate: IfStatement | BlockStatement | ReturnStatement | undefined
}
interface AssignmentExpression extends Node {
  type: NodeTypes.JS_ASSIGNMENT_EXPRESSION
  left: SimpleExpressionNode
  right: JSChildNode
}
interface SequenceExpression extends Node {
  type: NodeTypes.JS_SEQUENCE_EXPRESSION
  expressions: JSChildNode[]
}
interface ReturnStatement extends Node {
  type: NodeTypes.JS_RETURN_STATEMENT
  returns: TemplateChildNode | TemplateChildNode[] | JSChildNode
}
interface DirectiveArgumentNode extends ArrayExpression {
  elements:
    | [string]
    | [string, ExpressionNode]
    | [string, ExpressionNode, ExpressionNode]
    | [string, ExpressionNode, ExpressionNode, ObjectExpression]
}
interface RenderSlotCall extends CallExpression {
  callee: typeof RENDER_SLOT
  arguments:
    | [string, string | ExpressionNode]
    | [string, string | ExpressionNode, PropsExpression]
    | [
        string,
        string | ExpressionNode,
        PropsExpression | '{}',
        TemplateChildNode[]
      ]
}
type SlotsExpression = SlotsObjectExpression | DynamicSlotsExpression
interface SlotsObjectExpression extends ObjectExpression {
  properties: SlotsObjectProperty[]
}
interface SlotsObjectProperty extends Property {
  value: SlotFunctionExpression
}
interface SlotFunctionExpression extends FunctionExpression {
  returns: TemplateChildNode[]
}
interface DynamicSlotsExpression extends CallExpression {
  callee: typeof CREATE_SLOTS
  arguments: [SlotsObjectExpression, DynamicSlotEntries]
}
interface DynamicSlotEntries extends ArrayExpression {
  elements: (ConditionalDynamicSlotNode | ListDynamicSlotNode)[]
}
interface ConditionalDynamicSlotNode extends ConditionalExpression {
  consequent: DynamicSlotNode
  alternate: DynamicSlotNode | SimpleExpressionNode
}
interface ListDynamicSlotNode extends CallExpression {
  callee: typeof RENDER_LIST
  arguments: [ExpressionNode, ListDynamicSlotIterator]
}
interface ListDynamicSlotIterator extends FunctionExpression {
  returns: DynamicSlotNode
}
interface DynamicSlotNode extends ObjectExpression {
  properties: [Property, DynamicSlotFnProperty]
}
interface DynamicSlotFnProperty extends Property {
  value: SlotFunctionExpression
}
type BlockCodegenNode = VNodeCall | RenderSlotCall
interface IfConditionalExpression extends ConditionalExpression {
  consequent: BlockCodegenNode | MemoExpression
  alternate: BlockCodegenNode | IfConditionalExpression | MemoExpression
}
interface ForCodegenNode extends VNodeCall {
  isBlock: true
  tag: typeof FRAGMENT
  props: undefined
  children: ForRenderListExpression
  patchFlag: string
  disableTracking: boolean
}
interface ForRenderListExpression extends CallExpression {
  callee: typeof RENDER_LIST
  arguments: [ExpressionNode, ForIteratorExpression]
}
interface ForIteratorExpression extends FunctionExpression {
  returns: BlockCodegenNode
}
interface CompilerError extends SyntaxError {
  code: number | string
  loc?: SourceLocation
}
interface ErrorHandlingOptions {
  onWarn?: (warning: CompilerError) => void
  onError?: (error: CompilerError) => void
}
interface ParserOptions extends ErrorHandlingOptions, CompilerCompatOptions {
  isNativeTag?: (tag: string) => boolean
  isVoidTag?: (tag: string) => boolean
  isPreTag?: (tag: string) => boolean
  isBuiltInComponent?: (tag: string) => symbol | void
  isCustomElement?: (tag: string) => boolean | void
  getNamespace?: (tag: string, parent: ElementNode | undefined) => Namespace
  getTextMode?: (
    node: ElementNode,
    parent: ElementNode | undefined
  ) => TextModes
  delimiters?: [string, string]
  whitespace?: 'preserve' | 'condense'
  decodeEntities?: (rawText: string, asAttr: boolean) => string
  comments?: boolean
}
type HoistTransform = (
  children: TemplateChildNode[],
  context: TransformContext,
  parent: ParentNode
) => void
declare const enum BindingTypes {
  DATA = 'data',
  PROPS = 'props',
  PROPS_ALIASED = 'props-aliased',
  SETUP_LET = 'setup-let',
  SETUP_CONST = 'setup-const',
  SETUP_REACTIVE_CONST = 'setup-reactive-const',
  SETUP_MAYBE_REF = 'setup-maybe-ref',
  SETUP_REF = 'setup-ref',
  OPTIONS = 'options',
  LITERAL_CONST = 'literal-const'
}
type BindingMetadata = {
  [key: string]: BindingTypes | undefined
} & {
  __isScriptSetup?: boolean
  __propsAliases?: Record<string, string>
}
interface SharedTransformCodegenOptions {
  prefixIdentifiers?: boolean
  ssr?: boolean
  inSSR?: boolean
  bindingMetadata?: BindingMetadata
  inline?: boolean
  isTS?: boolean
  filename?: string
}
interface TransformOptions
  extends SharedTransformCodegenOptions,
    ErrorHandlingOptions,
    CompilerCompatOptions {
  nodeTransforms?: NodeTransform[]
  directiveTransforms?: Record<string, DirectiveTransform | undefined>
  transformHoist?: HoistTransform | null
  isBuiltInComponent?: (tag: string) => symbol | void
  isCustomElement?: (tag: string) => boolean | void
  prefixIdentifiers?: boolean
  hoistStatic?: boolean
  cacheHandlers?: boolean
  scopeId?: string | null
  slotted?: boolean
  ssrCssVars?: string
}
interface CodegenOptions extends SharedTransformCodegenOptions {
  mode?: 'module' | 'function'
  sourceMap?: boolean
  scopeId?: string | null
  optimizeImports?: boolean
  runtimeModuleName?: string
  ssrRuntimeModuleName?: string
  runtimeGlobalName?: string
}
type CompilerOptions = ParserOptions & TransformOptions & CodegenOptions
type VueElementConstructor<P = {}> = {
  new (initialProps?: Record<string, any>): VueElement & P
}
declare function defineCustomElement<Props, RawBindings = object>(
  setup: (
    props: Readonly<Props>,
    ctx: SetupContext
  ) => RawBindings | RenderFunction
): VueElementConstructor<Props>
declare function defineCustomElement<
  Props = {},
  RawBindings = {},
  D = {},
  C extends ComputedOptions = {},
  M extends MethodOptions = {},
  Mixin extends ComponentOptionsMixin = ComponentOptionsMixin,
  Extends extends ComponentOptionsMixin = ComponentOptionsMixin,
  E extends EmitsOptions = EmitsOptions,
  EE extends string = string,
  I extends ComponentInjectOptions = {},
  II extends string = string
>(
  options: ComponentOptionsWithoutProps<
    Props,
    RawBindings,
    D,
    C,
    M,
    Mixin,
    Extends,
    E,
    EE,
    I,
    II
  > & {
    styles?: string[]
  }
): VueElementConstructor<Props>
declare function defineCustomElement<
  PropNames extends string,
  RawBindings,
  D,
  C extends ComputedOptions = {},
  M extends MethodOptions = {},
  Mixin extends ComponentOptionsMixin = ComponentOptionsMixin,
  Extends extends ComponentOptionsMixin = ComponentOptionsMixin,
  E extends EmitsOptions = Record<string, any>,
  EE extends string = string,
  I extends ComponentInjectOptions = {},
  II extends string = string
>(
  options: ComponentOptionsWithArrayProps<
    PropNames,
    RawBindings,
    D,
    C,
    M,
    Mixin,
    Extends,
    E,
    EE,
    I,
    II
  > & {
    styles?: string[]
  }
): VueElementConstructor<{
  [K in PropNames]: any
}>
declare function defineCustomElement<
  PropsOptions extends Readonly<ComponentPropsOptions>,
  RawBindings,
  D,
  C extends ComputedOptions = {},
  M extends MethodOptions = {},
  Mixin extends ComponentOptionsMixin = ComponentOptionsMixin,
  Extends extends ComponentOptionsMixin = ComponentOptionsMixin,
  E extends EmitsOptions = Record<string, any>,
  EE extends string = string,
  I extends ComponentInjectOptions = {},
  II extends string = string
>(
  options: ComponentOptionsWithObjectProps<
    PropsOptions,
    RawBindings,
    D,
    C,
    M,
    Mixin,
    Extends,
    E,
    EE,
    I,
    II
  > & {
    styles?: string[]
  }
): VueElementConstructor<ExtractPropTypes<PropsOptions>>
declare function defineCustomElement(options: {
  new (...args: any[]): ComponentPublicInstance
}): VueElementConstructor
declare const defineSSRCustomElement: typeof defineCustomElement
declare const BaseClass: {
  new (): HTMLElement
  prototype: HTMLElement
}
type InnerComponentDef = ConcreteComponent & {
  styles?: string[]
}
declare class VueElement extends BaseClass {
  private _def
  private _props
  _instance: ComponentInternalInstance | null
  private _connected
  private _resolved
  private _numberProps
  private _styles?
  constructor(
    _def: InnerComponentDef,
    _props?: Record<string, any>,
    hydrate?: RootHydrateFunction
  )
  connectedCallback(): void
  disconnectedCallback(): void
  private _resolveDef
  private _resolveProps
  protected _setAttr(key: string): void
  protected _getProp(key: string): any
  protected _setProp(
    key: string,
    val: any,
    shouldReflect?: boolean,
    shouldUpdate?: boolean
  ): void
  private _update
  private _createVNode
  private _applyStyles
}
declare function useCssModule(name?: string): Record<string, string>
declare function useCssVars(getter: (ctx: any) => Record<string, string>): void
declare const TRANSITION = 'transition'
declare const ANIMATION = 'animation'
type AnimationTypes = typeof TRANSITION | typeof ANIMATION
interface TransitionProps extends BaseTransitionProps<Element> {
  name?: string
  type?: AnimationTypes
  css?: boolean
  duration?:
    | number
    | {
        enter: number
        leave: number
      }
  enterFromClass?: string
  enterActiveClass?: string
  enterToClass?: string
  appearFromClass?: string
  appearActiveClass?: string
  appearToClass?: string
  leaveFromClass?: string
  leaveActiveClass?: string
  leaveToClass?: string
}
declare const Transition: FunctionalComponent<TransitionProps>
type TransitionGroupProps = Omit<TransitionProps, 'mode'> & {
  tag?: string
  moveClass?: string
}
declare const TransitionGroup: new () => {
  $props: TransitionGroupProps
}
type AssignerFn = (value: any) => void
type ModelDirective<T> = ObjectDirective<
  T & {
    _assign: AssignerFn
  }
>
declare const vModelText: ModelDirective<HTMLInputElement | HTMLTextAreaElement>
declare const vModelCheckbox: ModelDirective<HTMLInputElement>
declare const vModelRadio: ModelDirective<HTMLInputElement>
declare const vModelSelect: ModelDirective<HTMLSelectElement>
declare const vModelDynamic: ObjectDirective<
  HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
>
declare const withModifiers: (
  fn: Function,
  modifiers: string[]
) => (event: Event, ...args: unknown[]) => any
declare const withKeys: (
  fn: Function,
  modifiers: string[]
) => (event: KeyboardEvent) => any
interface VShowElement extends HTMLElement {
  _vod: string
}
declare const vShow: ObjectDirective<VShowElement>
interface CSSProperties
  extends CSS.Properties<string | number>,
    CSS.PropertiesHyphen<string | number> {
  [v: `--${string}`]: string | number | undefined
}
type Booleanish = boolean | 'true' | 'false'
type Numberish = number | string
interface AriaAttributes {
  'aria-activedescendant'?: string
  'aria-atomic'?: Booleanish
  'aria-autocomplete'?: 'none' | 'inline' | 'list' | 'both'
  'aria-busy'?: Booleanish
  'aria-checked'?: Booleanish | 'mixed'
  'aria-colcount'?: Numberish
  'aria-colindex'?: Numberish
  'aria-colspan'?: Numberish
  'aria-controls'?: string
  'aria-current'?: Booleanish | 'page' | 'step' | 'location' | 'date' | 'time'
  'aria-describedby'?: string
  'aria-details'?: string
  'aria-disabled'?: Booleanish
  'aria-dropeffect'?: 'none' | 'copy' | 'execute' | 'link' | 'move' | 'popup'
  'aria-errormessage'?: string
  'aria-expanded'?: Booleanish
  'aria-flowto'?: string
  'aria-grabbed'?: Booleanish
  'aria-haspopup'?: Booleanish | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog'
  'aria-hidden'?: Booleanish
  'aria-invalid'?: Booleanish | 'grammar' | 'spelling'
  'aria-keyshortcuts'?: string
  'aria-label'?: string
  'aria-labelledby'?: string
  'aria-level'?: Numberish
  'aria-live'?: 'off' | 'assertive' | 'polite'
  'aria-modal'?: Booleanish
  'aria-multiline'?: Booleanish
  'aria-multiselectable'?: Booleanish
  'aria-orientation'?: 'horizontal' | 'vertical'
  'aria-owns'?: string
  'aria-placeholder'?: string
  'aria-posinset'?: Numberish
  'aria-pressed'?: Booleanish | 'mixed'
  'aria-readonly'?: Booleanish
  'aria-relevant'?: 'additions' | 'additions text' | 'all' | 'removals' | 'text'
  'aria-required'?: Booleanish
  'aria-roledescription'?: string
  'aria-rowcount'?: Numberish
  'aria-rowindex'?: Numberish
  'aria-rowspan'?: Numberish
  'aria-selected'?: Booleanish
  'aria-setsize'?: Numberish
  'aria-sort'?: 'none' | 'ascending' | 'descending' | 'other'
  'aria-valuemax'?: Numberish
  'aria-valuemin'?: Numberish
  'aria-valuenow'?: Numberish
  'aria-valuetext'?: string
}
type StyleValue = string | CSSProperties | Array<StyleValue>
interface HTMLAttributes extends AriaAttributes, EventHandlers<Events> {
  innerHTML?: string
  class?: any
  style?: StyleValue
  accesskey?: string
  contenteditable?: Booleanish | 'inherit'
  contextmenu?: string
  dir?: string
  draggable?: Booleanish
  hidden?: Booleanish
  id?: string
  lang?: string
  placeholder?: string
  spellcheck?: Booleanish
  tabindex?: Numberish
  title?: string
  translate?: 'yes' | 'no'
  radiogroup?: string
  role?: string
  about?: string
  datatype?: string
  inlist?: any
  prefix?: string
  property?: string
  resource?: string
  typeof?: string
  vocab?: string
  autocapitalize?: string
  autocorrect?: string
  autosave?: string
  color?: string
  itemprop?: string
  itemscope?: Booleanish
  itemtype?: string
  itemid?: string
  itemref?: string
  results?: Numberish
  security?: string
  unselectable?: 'on' | 'off'
  inputmode?:
    | 'none'
    | 'text'
    | 'tel'
    | 'url'
    | 'email'
    | 'numeric'
    | 'decimal'
    | 'search'
  is?: string
}
type HTMLAttributeReferrerPolicy =
  | ''
  | 'no-referrer'
  | 'no-referrer-when-downgrade'
  | 'origin'
  | 'origin-when-cross-origin'
  | 'same-origin'
  | 'strict-origin'
  | 'strict-origin-when-cross-origin'
  | 'unsafe-url'
interface AnchorHTMLAttributes extends HTMLAttributes {
  download?: any
  href?: string
  hreflang?: string
  media?: string
  ping?: string
  rel?: string
  target?: string
  type?: string
  referrerpolicy?: HTMLAttributeReferrerPolicy
}
interface AreaHTMLAttributes extends HTMLAttributes {
  alt?: string
  coords?: string
  download?: any
  href?: string
  hreflang?: string
  media?: string
  referrerpolicy?: HTMLAttributeReferrerPolicy
  rel?: string
  shape?: string
  target?: string
}
interface AudioHTMLAttributes extends MediaHTMLAttributes {}
interface BaseHTMLAttributes extends HTMLAttributes {
  href?: string
  target?: string
}
interface BlockquoteHTMLAttributes extends HTMLAttributes {
  cite?: string
}
interface ButtonHTMLAttributes extends HTMLAttributes {
  autofocus?: Booleanish
  disabled?: Booleanish
  form?: string
  formaction?: string
  formenctype?: string
  formmethod?: string
  formnovalidate?: Booleanish
  formtarget?: string
  name?: string
  type?: 'submit' | 'reset' | 'button'
  value?: string | string[] | number
}
interface CanvasHTMLAttributes extends HTMLAttributes {
  height?: Numberish
  width?: Numberish
}
interface ColHTMLAttributes extends HTMLAttributes {
  span?: Numberish
  width?: Numberish
}
interface ColgroupHTMLAttributes extends HTMLAttributes {
  span?: Numberish
}
interface DataHTMLAttributes extends HTMLAttributes {
  value?: string | string[] | number
}
interface DetailsHTMLAttributes extends HTMLAttributes {
  open?: Booleanish
}
interface DelHTMLAttributes extends HTMLAttributes {
  cite?: string
  datetime?: string
}
interface DialogHTMLAttributes extends HTMLAttributes {
  open?: Booleanish
}
interface EmbedHTMLAttributes extends HTMLAttributes {
  height?: Numberish
  src?: string
  type?: string
  width?: Numberish
}
interface FieldsetHTMLAttributes extends HTMLAttributes {
  disabled?: Booleanish
  form?: string
  name?: string
}
interface FormHTMLAttributes extends HTMLAttributes {
  acceptcharset?: string
  action?: string
  autocomplete?: string
  enctype?: string
  method?: string
  name?: string
  novalidate?: Booleanish
  target?: string
}
interface HtmlHTMLAttributes extends HTMLAttributes {
  manifest?: string
}
interface IframeHTMLAttributes extends HTMLAttributes {
  allow?: string
  allowfullscreen?: Booleanish
  allowtransparency?: Booleanish
  frameborder?: Numberish
  height?: Numberish
  marginheight?: Numberish
  marginwidth?: Numberish
  name?: string
  referrerpolicy?: HTMLAttributeReferrerPolicy
  sandbox?: string
  scrolling?: string
  seamless?: Booleanish
  src?: string
  srcdoc?: string
  width?: Numberish
}
interface ImgHTMLAttributes extends HTMLAttributes {
  alt?: string
  crossorigin?: 'anonymous' | 'use-credentials' | ''
  decoding?: 'async' | 'auto' | 'sync'
  height?: Numberish
  referrerpolicy?: HTMLAttributeReferrerPolicy
  sizes?: string
  src?: string
  srcset?: string
  usemap?: string
  width?: Numberish
}
interface InsHTMLAttributes extends HTMLAttributes {
  cite?: string
  datetime?: string
}
interface InputHTMLAttributes extends HTMLAttributes {
  accept?: string
  alt?: string
  autocomplete?: string
  autofocus?: Booleanish
  capture?: boolean | 'user' | 'environment'
  checked?: Booleanish | any[] | Set<any>
  crossorigin?: string
  disabled?: Booleanish
  form?: string
  formaction?: string
  formenctype?: string
  formmethod?: string
  formnovalidate?: Booleanish
  formtarget?: string
  height?: Numberish
  indeterminate?: boolean
  list?: string
  max?: Numberish
  maxlength?: Numberish
  min?: Numberish
  minlength?: Numberish
  multiple?: Booleanish
  name?: string
  pattern?: string
  placeholder?: string
  readonly?: Booleanish
  required?: Booleanish
  size?: Numberish
  src?: string
  step?: Numberish
  type?: string
  value?: any
  width?: Numberish
}
interface KeygenHTMLAttributes extends HTMLAttributes {
  autofocus?: Booleanish
  challenge?: string
  disabled?: Booleanish
  form?: string
  keytype?: string
  keyparams?: string
  name?: string
}
interface LabelHTMLAttributes extends HTMLAttributes {
  for?: string
  form?: string
}
interface LiHTMLAttributes extends HTMLAttributes {
  value?: string | string[] | number
}
interface LinkHTMLAttributes extends HTMLAttributes {
  as?: string
  crossorigin?: string
  href?: string
  hreflang?: string
  integrity?: string
  media?: string
  referrerpolicy?: HTMLAttributeReferrerPolicy
  rel?: string
  sizes?: string
  type?: string
}
interface MapHTMLAttributes extends HTMLAttributes {
  name?: string
}
interface MenuHTMLAttributes extends HTMLAttributes {
  type?: string
}
interface MediaHTMLAttributes extends HTMLAttributes {
  autoplay?: Booleanish
  controls?: Booleanish
  controlslist?: string
  crossorigin?: string
  loop?: Booleanish
  mediagroup?: string
  muted?: Booleanish
  playsinline?: Booleanish
  preload?: string
  src?: string
}
interface MetaHTMLAttributes extends HTMLAttributes {
  charset?: string
  content?: string
  httpequiv?: string
  name?: string
}
interface MeterHTMLAttributes extends HTMLAttributes {
  form?: string
  high?: Numberish
  low?: Numberish
  max?: Numberish
  min?: Numberish
  optimum?: Numberish
  value?: string | string[] | number
}
interface QuoteHTMLAttributes extends HTMLAttributes {
  cite?: string
}
interface ObjectHTMLAttributes extends HTMLAttributes {
  classid?: string
  data?: string
  form?: string
  height?: Numberish
  name?: string
  type?: string
  usemap?: string
  width?: Numberish
  wmode?: string
}
interface OlHTMLAttributes extends HTMLAttributes {
  reversed?: Booleanish
  start?: Numberish
  type?: '1' | 'a' | 'A' | 'i' | 'I'
}
interface OptgroupHTMLAttributes extends HTMLAttributes {
  disabled?: Booleanish
  label?: string
}
interface OptionHTMLAttributes extends HTMLAttributes {
  disabled?: Booleanish
  label?: string
  selected?: Booleanish
  value?: any
}
interface OutputHTMLAttributes extends HTMLAttributes {
  for?: string
  form?: string
  name?: string
}
interface ParamHTMLAttributes extends HTMLAttributes {
  name?: string
  value?: string | string[] | number
}
interface ProgressHTMLAttributes extends HTMLAttributes {
  max?: Numberish
  value?: string | string[] | number
}
interface ScriptHTMLAttributes extends HTMLAttributes {
  async?: Booleanish
  charset?: string
  crossorigin?: string
  defer?: Booleanish
  integrity?: string
  nomodule?: Booleanish
  referrerpolicy?: HTMLAttributeReferrerPolicy
  nonce?: string
  src?: string
  type?: string
}
interface SelectHTMLAttributes extends HTMLAttributes {
  autocomplete?: string
  autofocus?: Booleanish
  disabled?: Booleanish
  form?: string
  multiple?: Booleanish
  name?: string
  required?: Booleanish
  size?: Numberish
  value?: any
}
interface SourceHTMLAttributes extends HTMLAttributes {
  media?: string
  sizes?: string
  src?: string
  srcset?: string
  type?: string
}
interface StyleHTMLAttributes extends HTMLAttributes {
  media?: string
  nonce?: string
  scoped?: Booleanish
  type?: string
}
interface TableHTMLAttributes extends HTMLAttributes {
  cellpadding?: Numberish
  cellspacing?: Numberish
  summary?: string
}
interface TextareaHTMLAttributes extends HTMLAttributes {
  autocomplete?: string
  autofocus?: Booleanish
  cols?: Numberish
  dirname?: string
  disabled?: Booleanish
  form?: string
  maxlength?: Numberish
  minlength?: Numberish
  name?: string
  placeholder?: string
  readonly?: boolean
  required?: Booleanish
  rows?: Numberish
  value?: string | string[] | number
  wrap?: string
}
interface TdHTMLAttributes extends HTMLAttributes {
  align?: 'left' | 'center' | 'right' | 'justify' | 'char'
  colspan?: Numberish
  headers?: string
  rowspan?: Numberish
  scope?: string
  valign?: 'top' | 'middle' | 'bottom' | 'baseline'
}
interface ThHTMLAttributes extends HTMLAttributes {
  align?: 'left' | 'center' | 'right' | 'justify' | 'char'
  colspan?: Numberish
  headers?: string
  rowspan?: Numberish
  scope?: string
}
interface TimeHTMLAttributes extends HTMLAttributes {
  datetime?: string
}
interface TrackHTMLAttributes extends HTMLAttributes {
  default?: Booleanish
  kind?: string
  label?: string
  src?: string
  srclang?: string
}
interface VideoHTMLAttributes extends MediaHTMLAttributes {
  height?: Numberish
  playsinline?: Booleanish
  poster?: string
  width?: Numberish
  disablePictureInPicture?: Booleanish
}
interface WebViewHTMLAttributes extends HTMLAttributes {
  allowfullscreen?: Booleanish
  allowpopups?: Booleanish
  autoFocus?: Booleanish
  autosize?: Booleanish
  blinkfeatures?: string
  disableblinkfeatures?: string
  disableguestresize?: Booleanish
  disablewebsecurity?: Booleanish
  guestinstance?: string
  httpreferrer?: string
  nodeintegration?: Booleanish
  partition?: string
  plugins?: Booleanish
  preload?: string
  src?: string
  useragent?: string
  webpreferences?: string
}
interface SVGAttributes extends AriaAttributes, EventHandlers<Events> {
  innerHTML?: string
  class?: any
  style?: string | CSSProperties
  color?: string
  height?: Numberish
  id?: string
  lang?: string
  max?: Numberish
  media?: string
  method?: string
  min?: Numberish
  name?: string
  target?: string
  type?: string
  width?: Numberish
  role?: string
  tabindex?: Numberish
  'accent-height'?: Numberish
  accumulate?: 'none' | 'sum'
  additive?: 'replace' | 'sum'
  'alignment-baseline'?:
    | 'auto'
    | 'baseline'
    | 'before-edge'
    | 'text-before-edge'
    | 'middle'
    | 'central'
    | 'after-edge'
    | 'text-after-edge'
    | 'ideographic'
    | 'alphabetic'
    | 'hanging'
    | 'mathematical'
    | 'inherit'
  allowReorder?: 'no' | 'yes'
  alphabetic?: Numberish
  amplitude?: Numberish
  'arabic-form'?: 'initial' | 'medial' | 'terminal' | 'isolated'
  ascent?: Numberish
  attributeName?: string
  attributeType?: string
  autoReverse?: Numberish
  azimuth?: Numberish
  baseFrequency?: Numberish
  'baseline-shift'?: Numberish
  baseProfile?: Numberish
  bbox?: Numberish
  begin?: Numberish
  bias?: Numberish
  by?: Numberish
  calcMode?: Numberish
  'cap-height'?: Numberish
  clip?: Numberish
  'clip-path'?: string
  clipPathUnits?: Numberish
  'clip-rule'?: Numberish
  'color-interpolation'?: Numberish
  'color-interpolation-filters'?: 'auto' | 'sRGB' | 'linearRGB' | 'inherit'
  'color-profile'?: Numberish
  'color-rendering'?: Numberish
  contentScriptType?: Numberish
  contentStyleType?: Numberish
  cursor?: Numberish
  cx?: Numberish
  cy?: Numberish
  d?: string
  decelerate?: Numberish
  descent?: Numberish
  diffuseConstant?: Numberish
  direction?: Numberish
  display?: Numberish
  divisor?: Numberish
  'dominant-baseline'?: Numberish
  dur?: Numberish
  dx?: Numberish
  dy?: Numberish
  edgeMode?: Numberish
  elevation?: Numberish
  'enable-background'?: Numberish
  end?: Numberish
  exponent?: Numberish
  externalResourcesRequired?: Numberish
  fill?: string
  'fill-opacity'?: Numberish
  'fill-rule'?: 'nonzero' | 'evenodd' | 'inherit'
  filter?: string
  filterRes?: Numberish
  filterUnits?: Numberish
  'flood-color'?: Numberish
  'flood-opacity'?: Numberish
  focusable?: Numberish
  'font-family'?: string
  'font-size'?: Numberish
  'font-size-adjust'?: Numberish
  'font-stretch'?: Numberish
  'font-style'?: Numberish
  'font-variant'?: Numberish
  'font-weight'?: Numberish
  format?: Numberish
  from?: Numberish
  fx?: Numberish
  fy?: Numberish
  g1?: Numberish
  g2?: Numberish
  'glyph-name'?: Numberish
  'glyph-orientation-horizontal'?: Numberish
  'glyph-orientation-vertical'?: Numberish
  glyphRef?: Numberish
  gradientTransform?: string
  gradientUnits?: string
  hanging?: Numberish
  'horiz-adv-x'?: Numberish
  'horiz-origin-x'?: Numberish
  href?: string
  ideographic?: Numberish
  'image-rendering'?: Numberish
  in2?: Numberish
  in?: string
  intercept?: Numberish
  k1?: Numberish
  k2?: Numberish
  k3?: Numberish
  k4?: Numberish
  k?: Numberish
  kernelMatrix?: Numberish
  kernelUnitLength?: Numberish
  kerning?: Numberish
  keyPoints?: Numberish
  keySplines?: Numberish
  keyTimes?: Numberish
  lengthAdjust?: Numberish
  'letter-spacing'?: Numberish
  'lighting-color'?: Numberish
  limitingConeAngle?: Numberish
  local?: Numberish
  'marker-end'?: string
  markerHeight?: Numberish
  'marker-mid'?: string
  'marker-start'?: string
  markerUnits?: Numberish
  markerWidth?: Numberish
  mask?: string
  maskContentUnits?: Numberish
  maskUnits?: Numberish
  mathematical?: Numberish
  mode?: Numberish
  numOctaves?: Numberish
  offset?: Numberish
  opacity?: Numberish
  operator?: Numberish
  order?: Numberish
  orient?: Numberish
  orientation?: Numberish
  origin?: Numberish
  overflow?: Numberish
  'overline-position'?: Numberish
  'overline-thickness'?: Numberish
  'paint-order'?: Numberish
  'panose-1'?: Numberish
  pathLength?: Numberish
  patternContentUnits?: string
  patternTransform?: Numberish
  patternUnits?: string
  'pointer-events'?: Numberish
  points?: string
  pointsAtX?: Numberish
  pointsAtY?: Numberish
  pointsAtZ?: Numberish
  preserveAlpha?: Numberish
  preserveAspectRatio?: string
  primitiveUnits?: Numberish
  r?: Numberish
  radius?: Numberish
  refX?: Numberish
  refY?: Numberish
  renderingIntent?: Numberish
  repeatCount?: Numberish
  repeatDur?: Numberish
  requiredExtensions?: Numberish
  requiredFeatures?: Numberish
  restart?: Numberish
  result?: string
  rotate?: Numberish
  rx?: Numberish
  ry?: Numberish
  scale?: Numberish
  seed?: Numberish
  'shape-rendering'?: Numberish
  slope?: Numberish
  spacing?: Numberish
  specularConstant?: Numberish
  specularExponent?: Numberish
  speed?: Numberish
  spreadMethod?: string
  startOffset?: Numberish
  stdDeviation?: Numberish
  stemh?: Numberish
  stemv?: Numberish
  stitchTiles?: Numberish
  'stop-color'?: string
  'stop-opacity'?: Numberish
  'strikethrough-position'?: Numberish
  'strikethrough-thickness'?: Numberish
  string?: Numberish
  stroke?: string
  'stroke-dasharray'?: Numberish
  'stroke-dashoffset'?: Numberish
  'stroke-linecap'?: 'butt' | 'round' | 'square' | 'inherit'
  'stroke-linejoin'?: 'miter' | 'round' | 'bevel' | 'inherit'
  'stroke-miterlimit'?: Numberish
  'stroke-opacity'?: Numberish
  'stroke-width'?: Numberish
  surfaceScale?: Numberish
  systemLanguage?: Numberish
  tableValues?: Numberish
  targetX?: Numberish
  targetY?: Numberish
  'text-anchor'?: string
  'text-decoration'?: Numberish
  textLength?: Numberish
  'text-rendering'?: Numberish
  to?: Numberish
  transform?: string
  u1?: Numberish
  u2?: Numberish
  'underline-position'?: Numberish
  'underline-thickness'?: Numberish
  unicode?: Numberish
  'unicode-bidi'?: Numberish
  'unicode-range'?: Numberish
  'unitsPer-em'?: Numberish
  'v-alphabetic'?: Numberish
  values?: string
  'vector-effect'?: Numberish
  version?: string
  'vert-adv-y'?: Numberish
  'vert-origin-x'?: Numberish
  'vert-origin-y'?: Numberish
  'v-hanging'?: Numberish
  'v-ideographic'?: Numberish
  viewBox?: string
  viewTarget?: Numberish
  visibility?: Numberish
  'v-mathematical'?: Numberish
  widths?: Numberish
  'word-spacing'?: Numberish
  'writing-mode'?: Numberish
  x1?: Numberish
  x2?: Numberish
  x?: Numberish
  xChannelSelector?: string
  'x-height'?: Numberish
  xlinkActuate?: string
  xlinkArcrole?: string
  xlinkHref?: string
  xlinkRole?: string
  xlinkShow?: string
  xlinkTitle?: string
  xlinkType?: string
  xmlns?: string
  y1?: Numberish
  y2?: Numberish
  y?: Numberish
  yChannelSelector?: string
  z?: Numberish
  zoomAndPan?: string
}
interface IntrinsicElementAttributes {
  a: AnchorHTMLAttributes
  abbr: HTMLAttributes
  address: HTMLAttributes
  area: AreaHTMLAttributes
  article: HTMLAttributes
  aside: HTMLAttributes
  audio: AudioHTMLAttributes
  b: HTMLAttributes
  base: BaseHTMLAttributes
  bdi: HTMLAttributes
  bdo: HTMLAttributes
  blockquote: BlockquoteHTMLAttributes
  body: HTMLAttributes
  br: HTMLAttributes
  button: ButtonHTMLAttributes
  canvas: CanvasHTMLAttributes
  caption: HTMLAttributes
  cite: HTMLAttributes
  code: HTMLAttributes
  col: ColHTMLAttributes
  colgroup: ColgroupHTMLAttributes
  data: DataHTMLAttributes
  datalist: HTMLAttributes
  dd: HTMLAttributes
  del: DelHTMLAttributes
  details: DetailsHTMLAttributes
  dfn: HTMLAttributes
  dialog: DialogHTMLAttributes
  div: HTMLAttributes
  dl: HTMLAttributes
  dt: HTMLAttributes
  em: HTMLAttributes
  embed: EmbedHTMLAttributes
  fieldset: FieldsetHTMLAttributes
  figcaption: HTMLAttributes
  figure: HTMLAttributes
  footer: HTMLAttributes
  form: FormHTMLAttributes
  h1: HTMLAttributes
  h2: HTMLAttributes
  h3: HTMLAttributes
  h4: HTMLAttributes
  h5: HTMLAttributes
  h6: HTMLAttributes
  head: HTMLAttributes
  header: HTMLAttributes
  hgroup: HTMLAttributes
  hr: HTMLAttributes
  html: HtmlHTMLAttributes
  i: HTMLAttributes
  iframe: IframeHTMLAttributes
  img: ImgHTMLAttributes
  input: InputHTMLAttributes
  ins: InsHTMLAttributes
  kbd: HTMLAttributes
  keygen: KeygenHTMLAttributes
  label: LabelHTMLAttributes
  legend: HTMLAttributes
  li: LiHTMLAttributes
  link: LinkHTMLAttributes
  main: HTMLAttributes
  map: MapHTMLAttributes
  mark: HTMLAttributes
  menu: MenuHTMLAttributes
  meta: MetaHTMLAttributes
  meter: MeterHTMLAttributes
  nav: HTMLAttributes
  noindex: HTMLAttributes
  noscript: HTMLAttributes
  object: ObjectHTMLAttributes
  ol: OlHTMLAttributes
  optgroup: OptgroupHTMLAttributes
  option: OptionHTMLAttributes
  output: OutputHTMLAttributes
  p: HTMLAttributes
  param: ParamHTMLAttributes
  picture: HTMLAttributes
  pre: HTMLAttributes
  progress: ProgressHTMLAttributes
  q: QuoteHTMLAttributes
  rp: HTMLAttributes
  rt: HTMLAttributes
  ruby: HTMLAttributes
  s: HTMLAttributes
  samp: HTMLAttributes
  script: ScriptHTMLAttributes
  section: HTMLAttributes
  select: SelectHTMLAttributes
  small: HTMLAttributes
  source: SourceHTMLAttributes
  span: HTMLAttributes
  strong: HTMLAttributes
  style: StyleHTMLAttributes
  sub: HTMLAttributes
  summary: HTMLAttributes
  sup: HTMLAttributes
  table: TableHTMLAttributes
  template: HTMLAttributes
  tbody: HTMLAttributes
  td: TdHTMLAttributes
  textarea: TextareaHTMLAttributes
  tfoot: HTMLAttributes
  th: ThHTMLAttributes
  thead: HTMLAttributes
  time: TimeHTMLAttributes
  title: HTMLAttributes
  tr: HTMLAttributes
  track: TrackHTMLAttributes
  u: HTMLAttributes
  ul: HTMLAttributes
  var: HTMLAttributes
  video: VideoHTMLAttributes
  wbr: HTMLAttributes
  webview: WebViewHTMLAttributes
  svg: SVGAttributes
  animate: SVGAttributes
  animateMotion: SVGAttributes
  animateTransform: SVGAttributes
  circle: SVGAttributes
  clipPath: SVGAttributes
  defs: SVGAttributes
  desc: SVGAttributes
  ellipse: SVGAttributes
  feBlend: SVGAttributes
  feColorMatrix: SVGAttributes
  feComponentTransfer: SVGAttributes
  feComposite: SVGAttributes
  feConvolveMatrix: SVGAttributes
  feDiffuseLighting: SVGAttributes
  feDisplacementMap: SVGAttributes
  feDistantLight: SVGAttributes
  feDropShadow: SVGAttributes
  feFlood: SVGAttributes
  feFuncA: SVGAttributes
  feFuncB: SVGAttributes
  feFuncG: SVGAttributes
  feFuncR: SVGAttributes
  feGaussianBlur: SVGAttributes
  feImage: SVGAttributes
  feMerge: SVGAttributes
  feMergeNode: SVGAttributes
  feMorphology: SVGAttributes
  feOffset: SVGAttributes
  fePointLight: SVGAttributes
  feSpecularLighting: SVGAttributes
  feSpotLight: SVGAttributes
  feTile: SVGAttributes
  feTurbulence: SVGAttributes
  filter: SVGAttributes
  foreignObject: SVGAttributes
  g: SVGAttributes
  image: SVGAttributes
  line: SVGAttributes
  linearGradient: SVGAttributes
  marker: SVGAttributes
  mask: SVGAttributes
  metadata: SVGAttributes
  mpath: SVGAttributes
  path: SVGAttributes
  pattern: SVGAttributes
  polygon: SVGAttributes
  polyline: SVGAttributes
  radialGradient: SVGAttributes
  rect: SVGAttributes
  stop: SVGAttributes
  switch: SVGAttributes
  symbol: SVGAttributes
  text: SVGAttributes
  textPath: SVGAttributes
  tspan: SVGAttributes
  use: SVGAttributes
  view: SVGAttributes
}
interface Events {
  onCopy: ClipboardEvent
  onCut: ClipboardEvent
  onPaste: ClipboardEvent
  onCompositionend: CompositionEvent
  onCompositionstart: CompositionEvent
  onCompositionupdate: CompositionEvent
  onDrag: DragEvent
  onDragend: DragEvent
  onDragenter: DragEvent
  onDragexit: DragEvent
  onDragleave: DragEvent
  onDragover: DragEvent
  onDragstart: DragEvent
  onDrop: DragEvent
  onFocus: FocusEvent
  onFocusin: FocusEvent
  onFocusout: FocusEvent
  onBlur: FocusEvent
  onChange: Event
  onBeforeinput: Event
  onInput: Event
  onReset: Event
  onSubmit: Event
  onInvalid: Event
  onLoad: Event
  onError: Event
  onKeydown: KeyboardEvent
  onKeypress: KeyboardEvent
  onKeyup: KeyboardEvent
  onAuxclick: MouseEvent
  onClick: MouseEvent
  onContextmenu: MouseEvent
  onDblclick: MouseEvent
  onMousedown: MouseEvent
  onMouseenter: MouseEvent
  onMouseleave: MouseEvent
  onMousemove: MouseEvent
  onMouseout: MouseEvent
  onMouseover: MouseEvent
  onMouseup: MouseEvent
  onAbort: Event
  onCanplay: Event
  onCanplaythrough: Event
  onDurationchange: Event
  onEmptied: Event
  onEncrypted: Event
  onEnded: Event
  onLoadeddata: Event
  onLoadedmetadata: Event
  onLoadstart: Event
  onPause: Event
  onPlay: Event
  onPlaying: Event
  onProgress: Event
  onRatechange: Event
  onSeeked: Event
  onSeeking: Event
  onStalled: Event
  onSuspend: Event
  onTimeupdate: Event
  onVolumechange: Event
  onWaiting: Event
  onSelect: Event
  onScroll: UIEvent
  onTouchcancel: TouchEvent
  onTouchend: TouchEvent
  onTouchmove: TouchEvent
  onTouchstart: TouchEvent
  onPointerdown: PointerEvent
  onPointermove: PointerEvent
  onPointerup: PointerEvent
  onPointercancel: PointerEvent
  onPointerenter: PointerEvent
  onPointerleave: PointerEvent
  onPointerover: PointerEvent
  onPointerout: PointerEvent
  onWheel: WheelEvent
  onAnimationstart: AnimationEvent
  onAnimationend: AnimationEvent
  onAnimationiteration: AnimationEvent
  onTransitionend: TransitionEvent
  onTransitionstart: TransitionEvent
}
type EventHandlers<E> = {
  [K in keyof E]?: E[K] extends (...args: any) => any
    ? E[K]
    : (payload: E[K]) => void
}
type ReservedProps = {
  key?: string | number | symbol
  ref?: VNodeRef
  ref_for?: boolean
  ref_key?: string
}
type NativeElements = {
  [K in keyof IntrinsicElementAttributes]: IntrinsicElementAttributes[K] &
    ReservedProps
}
interface RefUnwrapBailTypes {}
interface RefUnwrapBailTypes {
  runtimeCoreBailTypes:
    | VNode
    | {
        $: ComponentInternalInstance
      }
}
interface RefUnwrapBailTypes {
  runtimeDOMBailTypes: Node | Window
}
declare const render: RootRenderFunction<Element | ShadowRoot>
declare const hydrate: RootHydrateFunction
declare const createApp: CreateAppFunction<Element>
declare const createSSRApp: CreateAppFunction<Element>
declare const initDirectivesForSSR: () => void
declare function compileToFunction(
  template: string | HTMLElement,
  options?: CompilerOptions
): RenderFunction

export {
  AllowedComponentProps,
  AnchorHTMLAttributes,
  AnimationTypes,
  App,
  AppConfig,
  AppContext,
  AppRecord,
  AreaHTMLAttributes,
  AriaAttributes,
  ArrayExpression,
  AssignerFn,
  AssignmentExpression,
  AsyncComponentLoader,
  AsyncComponentOptions,
  AsyncComponentResolveResult,
  AttributeNode,
  AudioHTMLAttributes,
  BaseElementNode,
  BaseHTMLAttributes,
  BaseTransition,
  BaseTransitionProps,
  BaseTransitionPropsValidators,
  BaseTypes,
  BindingMetadata,
  BindingTypes,
  BlockCodegenNode,
  BlockStatement,
  BlockquoteHTMLAttributes,
  BooleanFlags,
  BooleanKey,
  Booleanish,
  Builtin,
  ButtonHTMLAttributes,
  CSSProperties,
  CacheExpression,
  CallExpression,
  CanvasHTMLAttributes,
  ClassComponent,
  CodegenOptions,
  ColHTMLAttributes,
  ColgroupHTMLAttributes,
  CollectionTypes,
  Comment,
  CommentNode,
  CompatConfig,
  CompatVue,
  CompiledSlotDescriptor,
  CompilerCompatConfig,
  CompilerCompatOptions,
  CompilerDeprecationTypes,
  CompilerError,
  CompilerOptions,
  Component,
  ComponentCustomOptions,
  ComponentCustomProperties,
  ComponentCustomProps,
  ComponentInjectOptions,
  ComponentInternalInstance,
  ComponentInternalOptions,
  ComponentNode,
  ComponentObjectPropsOptions,
  ComponentOptions,
  ComponentOptionsBase,
  ComponentOptionsMixin,
  ComponentOptionsWithArrayProps,
  ComponentOptionsWithObjectProps,
  ComponentOptionsWithoutProps,
  ComponentPropsOptions,
  ComponentProvideOptions,
  ComponentPublicInstance,
  ComponentPublicInstanceConstructor,
  ComponentWatchOptionItem,
  ComponentWatchOptions,
  CompoundExpressionNode,
  ComputedGetter,
  ComputedOptions,
  ComputedRef,
  ComputedSetter,
  ConcreteComponent,
  ConditionalDynamicSlotNode,
  ConditionalExpression,
  ConstantTypes,
  Constructor,
  CreateAppFunction,
  CreateComponentPublicInstance,
  CustomRefFactory,
  Data,
  DataHTMLAttributes,
  DebuggerEvent,
  DebuggerEventExtraInfo,
  DebuggerHook,
  DebuggerOptions,
  DeepReadonly,
  DefaultFactory,
  DefaultKeys,
  DefineComponent,
  DelHTMLAttributes,
  Dep,
  DeprecationTypes,
  DetailsHTMLAttributes,
  DevtoolsHook,
  DialogHTMLAttributes,
  Directive,
  DirectiveArgumentNode,
  DirectiveArguments,
  DirectiveBinding,
  DirectiveHook,
  DirectiveModifiers,
  DirectiveNode,
  DirectiveTransform,
  DirectiveTransformResult,
  DynamicSlotEntries,
  DynamicSlotFnProperty,
  DynamicSlotNode,
  DynamicSlotsExpression,
  EffectScheduler,
  EffectScope,
  ElementNode,
  ElementTypes,
  EmbedHTMLAttributes,
  EmitFn,
  EmitsOptions,
  EmitsToProps,
  EnsureNonVoid,
  ErrorCapturedHook,
  ErrorCodes,
  ErrorHandlingOptions,
  ErrorTypes,
  EventHandlers,
  Events,
  ExpressionNode,
  ExtractComputedReturns,
  ExtractDefaultPropTypes,
  ExtractMixin,
  ExtractPropTypes,
  FieldsetHTMLAttributes,
  ForCodegenNode,
  ForIteratorExpression,
  ForNode,
  ForParseResult,
  ForRenderListExpression,
  FormHTMLAttributes,
  Fragment,
  FunctionDirective,
  FunctionExpression,
  FunctionalComponent,
  HMRComponent,
  HMRRuntime,
  HTMLAttributeReferrerPolicy,
  HTMLAttributes,
  HoistTransform,
  Hook,
  HtmlHTMLAttributes,
  HydrationRenderer,
  IfAny,
  IfBranchNode,
  IfConditionalExpression,
  IfNode,
  IfStatement,
  IframeHTMLAttributes,
  ImgHTMLAttributes,
  ImportItem,
  InferDefault,
  InferDefaults,
  InferPropType,
  InjectToObject,
  InjectionKey,
  InnerComponentDef,
  InputHTMLAttributes,
  InsHTMLAttributes,
  InternalRenderFunction,
  InternalSlots,
  InterpolationNode,
  IntersectionMixin,
  IntrinsicElementAttributes,
  IsDefaultMixinComponent,
  IterableCollections,
  JSChildNode,
  KeepAlive,
  KeepAliveProps,
  KeygenHTMLAttributes,
  LabelHTMLAttributes,
  LegacyConfig,
  LegacyOptions,
  LegacyPublicInstance,
  LegacyPublicProperties,
  LiHTMLAttributes,
  LifecycleHook,
  LifecycleHooks,
  LinkHTMLAttributes,
  ListDynamicSlotIterator,
  ListDynamicSlotNode,
  LooseRequired,
  MapHTMLAttributes,
  MapSources,
  MatchPattern,
  MediaHTMLAttributes,
  MemoExpression,
  MemoFactory,
  MenuHTMLAttributes,
  MergedComponentOptions,
  MergedComponentOptionsOverride,
  MergedHook,
  MetaHTMLAttributes,
  MeterHTMLAttributes,
  MethodOptions,
  MixinToOptionTypes,
  ModelDirective,
  MountChildrenFn,
  MountComponentFn,
  MoveFn,
  MoveType,
  MultiWatchSources,
  Namespace,
  NativeElements,
  NextFn,
  Node,
  NodeTransform,
  NodeTypes,
  NormalizedProp,
  NormalizedProps,
  NormalizedPropsOptions,
  NormalizedStyle,
  NotUndefined,
  Numberish,
  ObjectDirective,
  ObjectEmitsOptions,
  ObjectExpression,
  ObjectHTMLAttributes,
  ObjectInjectOptions,
  ObjectProvideOptions,
  ObjectWatchOptionItem,
  OlHTMLAttributes,
  OnCleanup,
  OptgroupHTMLAttributes,
  OptionHTMLAttributes,
  OptionMergeFunction,
  OptionTypesKeys,
  OptionTypesType,
  OptionalKeys,
  OutputHTMLAttributes,
  ParamHTMLAttributes,
  ParentNode,
  ParserOptions,
  PatchBlockChildrenFn,
  PatchChildrenFn,
  PatchFn,
  PlainElementNode,
  Plugin,
  PluginInstallFunction,
  Position,
  Prettify,
  Primitive,
  ProgressHTMLAttributes,
  Prop,
  PropConstructor,
  PropMethod,
  PropOptions,
  PropType,
  Property,
  PropsExpression,
  PropsWithDefaults,
  PublicProps,
  QuoteHTMLAttributes,
  Raw,
  RawChildren,
  RawProps,
  RawSlots,
  ReactiveEffect,
  ReactiveEffectOptions,
  ReactiveEffectRunner,
  ReactiveFlags,
  RecordToUnion,
  Ref,
  RefUnwrapBailTypes,
  RemoveFn,
  RenderFunction,
  RenderSlotCall,
  Renderer,
  RendererElement,
  RendererInternals,
  RendererNode,
  RendererOptions,
  RequiredKeys,
  ReservedProps,
  ResolveProps,
  ReturnStatement,
  RootHydrateFunction,
  RootNode,
  RootRenderFunction,
  RuntimeCompilerOptions,
  SSRCodegenNode,
  SSRDirectiveHook,
  SSRSlot,
  SVGAttributes,
  SchedulerJob,
  SchedulerJobs,
  ScriptHTMLAttributes,
  SelectHTMLAttributes,
  SequenceExpression,
  SetupContext,
  SetupRenderEffectFn,
  ShallowReactive,
  ShallowRef,
  ShallowUnwrapRef,
  SharedTransformCodegenOptions,
  ShortEmits,
  SimpleExpressionNode,
  Slot,
  SlotFlags,
  SlotFunctionExpression,
  SlotOutletNode,
  Slots,
  SlotsExpression,
  SlotsObjectExpression,
  SlotsObjectProperty,
  SourceHTMLAttributes,
  SourceLocation,
  Static,
  StyleHTMLAttributes,
  StyleValue,
  Suspense,
  SuspenseBoundary,
  SuspenseProps,
  TableHTMLAttributes,
  TdHTMLAttributes,
  Teleport,
  TeleportMoveTypes,
  TeleportProps,
  TeleportVNode,
  TemplateChildNode,
  TemplateLiteral,
  TemplateNode,
  TemplateTextChildNode,
  Text,
  TextCallNode,
  TextModes,
  TextNode,
  TextareaHTMLAttributes,
  ThHTMLAttributes,
  TimeHTMLAttributes,
  ToRef,
  ToRefs,
  TrackHTMLAttributes,
  TrackOpTypes,
  TrackedMarkers,
  TransformContext,
  TransformOptions,
  Transition,
  TransitionGroup,
  TransitionGroupProps,
  TransitionHooks,
  TransitionProps,
  TransitionState,
  TriggerOpTypes,
  UnionToIntersection,
  UnmountChildrenFn,
  UnmountFn,
  UnwrapMixinsType,
  UnwrapNestedRefs,
  UnwrapRef,
  UnwrapRefSimple,
  VNode,
  VNodeArrayChildren,
  VNodeCall,
  VNodeChild,
  VNodeChildAtom,
  VNodeMountHook,
  VNodeNormalizedChildren,
  VNodeNormalizedRef,
  VNodeNormalizedRefAtom,
  VNodeProps,
  VNodeRef,
  VNodeTypes,
  VNodeUpdateHook,
  VShowElement,
  VideoHTMLAttributes,
  VueElement,
  VueElementConstructor,
  WatchCallback,
  WatchEffect,
  WatchOptionItem,
  WatchOptions,
  WatchOptionsBase,
  WatchSource,
  WatchStopHandle,
  WeakCollections,
  WebViewHTMLAttributes,
  WritableComputedOptions,
  WritableComputedRef,
  assertNumber,
  callWithAsyncErrorHandling,
  callWithErrorHandling,
  camelize,
  capitalize,
  cloneVNode,
  compatUtils,
  compileToFunction as compile,
  compileToFunction,
  computed,
  createApp,
  createBlock,
  createCommentVNode,
  createElementBlock,
  createHydrationRenderer,
  createPropsRestProxy,
  createRenderer,
  createSSRApp,
  createSlots,
  createStaticVNode,
  createTextVNode,
  createVNode,
  customRef,
  defineAsyncComponent,
  defineComponent,
  defineCustomElement,
  defineEmits,
  defineExpose,
  defineOptions,
  defineProps,
  defineSSRCustomElement,
  devtools,
  effect,
  effectScope,
  getCurrentInstance,
  getCurrentScope,
  getTransitionRawChildren,
  guardReactiveProps,
  h,
  handleError,
  hydrate,
  initCustomFormatter,
  initDirectivesForSSR,
  inject,
  isMemoSame,
  isProxy,
  isReactive,
  isReadonly,
  isRef,
  isRuntimeOnly,
  isShallow,
  isVNode,
  markRaw,
  mergeDefaults,
  mergeProps,
  nextTick,
  normalizeClass,
  normalizeProps,
  normalizeStyle,
  onActivated,
  onBeforeMount,
  onBeforeUnmount,
  onBeforeUpdate,
  onDeactivated,
  onErrorCaptured,
  onMounted,
  onRenderTracked,
  onRenderTriggered,
  onScopeDispose,
  onServerPrefetch,
  onUnmounted,
  onUpdated,
  openBlock,
  popScopeId,
  provide,
  proxyRefs,
  pushScopeId,
  queuePostFlushCb,
  reactive,
  readonly,
  ref,
  registerRuntimeCompiler,
  render,
  renderList,
  renderSlot,
  resolveComponent,
  resolveDirective,
  resolveDynamicComponent,
  resolveFilter,
  resolveTransitionHooks,
  setBlockTracking,
  setDevtoolsHook,
  setTransitionHooks,
  shallowReactive,
  shallowReadonly,
  shallowRef,
  ssrContextKey,
  ssrUtils,
  stop,
  toDisplayString,
  toHandlerKey,
  toHandlers,
  toRaw,
  toRef,
  toRefs,
  transformVNodeArgs,
  triggerRef,
  unref,
  useAttrs,
  useCssModule,
  useCssVars,
  useSSRContext,
  useSlots,
  useTransitionState,
  vModelCheckbox,
  vModelDynamic,
  vModelRadio,
  vModelSelect,
  vModelText,
  vShow,
  version,
  warn,
  watch,
  watchEffect,
  watchPostEffect,
  watchSyncEffect,
  withAsyncContext,
  withCtx,
  withDefaults,
  withDirectives,
  withKeys,
  withMemo,
  withModifiers,
  withScopeId
}


declare global{
  const createApp: CreateAppFunction<Element>
}