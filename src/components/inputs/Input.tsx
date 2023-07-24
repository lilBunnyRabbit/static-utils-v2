import React from "react";
import "./Input.scss";
import { ExtendProps } from "@/utils/type.util";
import { cx } from "@/utils/class.util";

interface InputDataAttributes {}

interface InputProps extends InputDataAttributes {
  label?: React.ReactNode;
  color?: "primary" | "secondary" | "tertiary" | "error" | "success";
}

export const Input = React.forwardRef<HTMLInputElement, ExtendProps<"input", InputProps>>(
  ({ label, color, className, ...props }, ref) => {
    const inputRender = React.useMemo(() => {
      return <input ref={ref} className={cx("neu-input", className)} data-has-label={Boolean(label)} {...props} />;
    }, [label, className, props, ref]);

    if (!label) return inputRender;

    return (
      <div>
        <label className="neu-input-label" data-color={color} data-disabled={props.disabled} children={label} />
        {inputRender}
      </div>
    );
  }
);

Input.displayName = "Input";
