import { cx } from "@/utils/class.util";
import { ExtendProps } from "@/utils/type.util";
import React from "react";
import "./Button.scss";

export interface ButtonDataAttributes {
  size?: "sm" | "lg";
  color?: "primary" | "secondary" | "tertiary" | "error" | "success";
}

export interface ButtonProps extends ButtonDataAttributes {}

export const Button = React.forwardRef<HTMLButtonElement, ExtendProps<"button", ButtonProps>>(
  ({ size, color, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className={cx("neu-button", className)}
        data-size={size}
        data-color={color}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
