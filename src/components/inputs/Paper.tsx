import { cx } from "@/utils/class.util";
import React from "react";

export const Paper: React.FC<React.ComponentProps<"div">> = ({ className, ...props }) => {
  return <div className={cx("shadow-md bg-white", className)} {...props} />;
};
