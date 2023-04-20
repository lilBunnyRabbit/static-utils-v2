export function cx<T extends Array<string | false | null | undefined>>(...classes: T): string {
  return classes.filter(Boolean).join(" ");
}
