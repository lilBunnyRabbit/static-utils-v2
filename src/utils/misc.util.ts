export function propertyCombinations<S>(data: { [P in keyof S]?: S[P][] }): S[] {
  return Object.keys(data)
    .reduce((prev: any, key) => {
      const values: S[keyof S][] | undefined = data[key as keyof typeof data];
      if (values === undefined) return prev;
      if (prev.length === 0) return values.map((value) => ({ [key]: value }));
      return prev.flatMap((combination: S) => values.map((value) => ({ ...combination, [key]: value })));
    }, [])
    .flatMap((value: S) => value);
}
