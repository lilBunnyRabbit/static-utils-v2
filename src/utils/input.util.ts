/** Number input helper. Checks min/max. */
export const checkNumberInput = (onInput?: React.ComponentProps<"input">["onInput"]) => {
  return (e: React.FormEvent<HTMLInputElement>) => {
    const element = e.target as HTMLInputElement;

    if ("max" in element && element.max !== undefined) {
      const max = typeof element.max === "string" ? Number.parseFloat(element.max) : element.max;
      if (element.valueAsNumber > max) {
        (e.target as HTMLInputElement).value = String(max);
      }
    }

    if ("min" in element && element.min !== undefined) {
      const min = typeof element.min === "string" ? Number.parseFloat(element.min) : element.min;
      if (element.valueAsNumber < min) {
        (e.target as HTMLInputElement).value = String(min);
      }
    }

    return onInput && onInput(e);
  };
};


export type StateProp<T> = [T, React.Dispatch<React.SetStateAction<T>>]