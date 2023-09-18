import React from "react";

export interface BaseIconProps {
  color?: string;
}

export type Icon<TProps extends object = {}> = React.FC<
  TProps & Omit<React.SVGProps<SVGSVGElement>, "viewBox" | keyof BaseIconProps> & BaseIconProps
>;

export * as Icon from "./definitions";
