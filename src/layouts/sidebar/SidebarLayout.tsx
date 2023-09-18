import { cx } from "@/utils/class.util";
import { ClassNames } from "@/utils/type.util";
import React from "react";
import "./SidebarLayout.scss";

interface SidebarLayoutProps {
  title: React.ReactNode;
  children: [sidebar: React.ReactNode, body: React.ReactNode];
  classNames?: ClassNames<"root" | "sidebar" | "body">;
  id?: string;
  underlay?: React.ReactNode;
}

export const SidebarLayout = React.forwardRef<HTMLDivElement, SidebarLayoutProps>(
  ({ title, children: [sidebar, body], id, classNames, underlay }, ref) => {
    return (
      <div ref={ref} id={id} className={cx("sidebar-layout", classNames?.root)}>
        {Boolean(underlay) && <pre className="sidebar-layout-underlay" children={underlay} />}

        <div className="sidebar-layout-sidebar">
          <div className="sidebar-box">
            <h2 className="font-bold text-2xl" children={title} />
          </div>
          <div className={cx("sidebar-box", classNames?.sidebar)} children={sidebar} />
        </div>

        <div className={cx("sidebar-layout-body", classNames?.body)} children={body} />
      </div>
    );
  }
);

SidebarLayout.displayName = "SidebarLayout";
