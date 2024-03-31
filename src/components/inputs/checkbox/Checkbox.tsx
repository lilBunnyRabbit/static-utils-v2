import { cx } from "@/utils/class.util";
import { ExtendProps } from "@/utils/type.util";
import React from "react";
import "./Checkbox.scss";

export interface CheckboxDataAttributes {
  size?: "sm" | "lg";
  color?: "primary" | "secondary" | "tertiary" | "error" | "success";
}

interface CheckboxProps extends CheckboxDataAttributes {
  label?: React.ReactNode;
}

export const Checkbox = React.forwardRef<HTMLInputElement, Omit<ExtendProps<"input", CheckboxProps>, "type">>(
  ({ size, color, label, className, ...props }, ref) => {
    const inputRender = React.useMemo(() => {
      return (
        <input
          ref={ref}
          type="checkbox"
          className={cx("neu-checkbox", className)}
          data-size={size}
          data-color={color}
          {...props}
        />
      );
    }, [size, color, label, className, props, ref]);

    if (!label) return inputRender;

    return (
      <div className="flex items-center gap-2">
        {inputRender}
        <label className="neu-checkbox-label" data-size={size} data-disabled={props.disabled} children={label} />
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";
