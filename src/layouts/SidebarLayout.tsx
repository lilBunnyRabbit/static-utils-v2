import React from "react";

interface SidebarLayoutProps {
  children: [sidebar: React.ReactNode, body: React.ReactNode];
}

export const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children }) => {
  return (
    <div className="grid grid-cols-[256px,1fr] min-h-screen">
      <div className="relative p-4 bg-zinc-700" children={children[0]} />
      <div className="relative p-4 bg-zinc-900"children={children[1]} />
    </div>
  );
};
