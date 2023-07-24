import { cx } from "@/utils/class.util";
import React from "react";
import "./SidebarLayout.scss";
import { IconButton } from "@/components/buttons/IconButton";
import { Icon } from "@/components/icons";

interface SidebarLayoutProps {
  title: React.ReactNode;
  children: [sidebar: React.ReactNode, body: React.ReactNode];
  className?: string;
  id?: string;
}

export const SidebarLayout: React.FC<SidebarLayoutProps> = ({ title, children, id, className }) => {
  return (
    <div id={id} className={cx("layout-sidebar", className)}>
      <div>
        <div className="flex flex-col gap-4">
          <h2 className="font-bold text-2xl" children={title} />

          <div className="flex flex-row gap-4">
            <IconButton icon={Icon.ChevronLeft} />
            <IconButton icon={Icon.Save} />
          </div>
        </div>
        <div children={children[0]} />
      </div>

      <div className="relative p-8 overflow-hidden" children={children[1]} />
    </div>
  );
};
