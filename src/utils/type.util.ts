// Type Guards
export function isNumber(value: unknown): value is number {
  return typeof value === "number" && !Number.isNaN(value);
}

export function isString(value: unknown): value is string {
  return typeof value === "string";
}

export function isUndefined(value: unknown): value is undefined {
  return value === undefined;
}

export function isObject(value: unknown): value is object {
  return typeof value === "object" && !Array.isArray(value) && value !== null;
}

export function isFunction<TArgs extends any[] = any[], TReturn = any>(
  value: unknown
): value is (...args: TArgs) => TReturn {
  return typeof value === "function";
}

export function isEmptyString(value: unknown): value is "" {
  return isString(value) && value.length === 0;
}

export function isArray<T>(value: unknown): value is T[] {
  return Array.isArray(value);
}

export function isArrayOfType<T>(value: unknown, isType: (element: unknown) => element is T): value is T[] {
  return Array.isArray(value) && value.every((element) => isType(element));
}

export type PropsUnion<First extends object, Second extends object> = Omit<First, keyof Second> & Second;

export type ExtendProps<
  T extends keyof JSX.IntrinsicElements | React.JSXElementConstructor<any>,
  S extends object
> = PropsUnion<React.ComponentProps<T>, S>;

export type ClassNames<T extends string> = Partial<Record<T, string | false>>;
