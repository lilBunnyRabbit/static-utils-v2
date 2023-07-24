import { isFunction, isString } from "@/utils/type.util";
import React from "react";

export function stringElement(element: string, props: Record<any, any>) {
  return `<${element} ${Object.keys(props)
    .map((key) => {
      const value = (props as any)[key];
      return value === undefined ? null : `${key}=${isString(value) ? `"${value}"` : `{${value}}`}`;
    })
    .filter(Boolean)
    .join(" ")} />`;
}

export interface DesignSectionProps {
  title: string;
  children?: React.ReactNode | React.FC;
  open?: boolean;
}

export const DesignSection: React.FC<DesignSectionProps> = ({ title, children, open }) => {
  const render = React.useMemo(() => (isFunction(children) ? React.createElement(children) : children), [children]);

  return (
    <details open={open}>
      <summary className="border-b border-b-base font-bold text-2xl select-none cursor-pointer" children={title} />
      <div className="flex flex-col gap-4 w-full mt-4" children={render} />
    </details>
  );
};

export interface PropTableProps {
  props: React.ReactNode[];
  elements: React.ReactNode[];
}

export const PropTable: React.FC<PropTableProps> = ({ props, elements }) => {
  return React.useMemo(
    () => (
      <table className="text-left">
        <thead>
          <tr className="border-b border-b-base">
            <th />
            {props.map((prop, i) => (
              <th key={`prop-${i}`} children={prop} />
            ))}
          </tr>
        </thead>

        <tbody>
          <tr>
            {elements.map((element, i) => (
              <td key={`element-${i}`} className="py-4" children={element} />
            ))}
          </tr>
        </tbody>
      </table>
    ),
    [props, elements]
  );
};

export interface InvertedPropTableProps {
  props: React.ReactNode[];
  variants: React.ReactNode[];
  elements: React.ReactNode[][];
}

export const InvertedPropTable: React.FC<InvertedPropTableProps> = ({ props, variants, elements }) => {
  return React.useMemo(
    () => (
      <table className="text-left table-fixed">
        <thead>
          <tr className="border-b border-b-base">
            <th className="w-[30vw]" />
            {variants.map((variant, i) => (
              <th key={`variant-${i}`} children={variant} />
            ))}
          </tr>
        </thead>

        <tbody>
          {elements.map((element, i) => (
            <tr key={`element-${i}`}>
              <td className="py-4 pr-4">
                <pre className="bg-white w-full max-w-[30vw] overflow-x-auto px-2" children={props[i]} />
              </td>
              {element.map((el, j) => (
                <td key={`element-${i}-${j}`} className="py-4" children={el} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    ),
    [props, variants, elements]
  );
};
