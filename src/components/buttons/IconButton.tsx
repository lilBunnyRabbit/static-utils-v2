import { cx } from "@/utils/class.util";
import { ExtendProps } from "@/utils/type.util";
import React from "react";
import { Icon } from "../icons";
import { ButtonDataAttributes } from "./Button";
import "./IconButton.scss";

export interface IconButtonProps extends ButtonDataAttributes {
  icon: Icon;
}

export const IconButton = React.forwardRef<HTMLButtonElement, Omit<ExtendProps<"button", IconButtonProps>, "children">>(
  ({ icon, size, color, className, ...props }, ref) => {
    const iconRender = React.useMemo(() => {
      return React.createElement(icon, { color: "currentColor" });
    }, [icon]);

    return (
      <button
        ref={ref}
        type="button"
        className={cx("neu-icon-button", className)}
        data-size={size}
        data-color={color}
        {...props}
        children={iconRender}
      />
    );
  }
);

IconButton.displayName = "IconButton";
