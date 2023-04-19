import { StateProp, checkNumberInput } from "@/utils/input.util";
import { isUndefined } from "@/utils/type.util";
import React from "react";

interface NumberInputProps {
  label?: string;
  state?: StateProp<number | undefined>;
}

export const NumberInput = React.forwardRef<
  HTMLInputElement,
  Exclude<React.ComponentPropsWithRef<"input">, keyof NumberInputProps> & NumberInputProps
>(({ label, state, onInput, ...props }, ref) => {
  return (
    <div className="flex flex-col gap-2">
      {label && <label children={label} />}
      <input
        type="number"
        ref={ref}
        {...(state && {
          value: isUndefined(state[0]) || isNaN(state[0]) ? "" : state[0],
          onChange: (e) => state[1](isNaN(e.target.valueAsNumber) ? undefined : e.target.valueAsNumber),
        })}
        onInput={checkNumberInput(onInput)}
        {...props}
      />
    </div>
  );
});

NumberInput.displayName = "NumberInput";
