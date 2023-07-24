import { isFunction } from "@/utils/type.util";
import React from "react";

export function useObjectState<T extends Record<string | number | symbol, any>>(defaultValues: T) {
  const [values, setValues] = React.useState<T>(defaultValues);

  const setValue = React.useCallback(function <K extends keyof T>(key: K, value: T[K]) {
    setValues((values) => ({ ...values, [key]: isFunction(value) ? value(values[key]) : value }));
  }, []);

  return [values, setValue] as const;
}
