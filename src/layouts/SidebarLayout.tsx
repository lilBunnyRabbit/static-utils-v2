import { cx } from "@/utils/class.util";
import React from "react";

interface SidebarLayoutProps {
  children: [sidebar: React.ReactNode, body: React.ReactNode];
  className?: string;
  id?: string;
}

export const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children, id, className }) => {
  return (
    <div id={id} className={cx("relative grid grid-cols-[256px,1fr] h-screen w-screen overflow-hidden", className)}>
      <div className="relative p-4 bg-zinc-700 overflow-hidden" children={children[0]} />
      <div className="relative p-4 bg-zinc-900 overflow-hidden" children={children[1]} />
    </div>
  );
};
