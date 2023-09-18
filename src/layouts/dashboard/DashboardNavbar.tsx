import { IconButton } from "@/components/buttons/IconButton";
import { Icon } from "@/components/icons";
import { pages } from "@/router";
import React from "react";
import { useMatches, useNavigate } from "react-router-dom";

export const DashboardNavbar: React.FC = () => {
  const matches = useMatches();
  const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const classname = "open-sidebar";

    if (open) {
      if (!document.body.classList.contains(classname)) {
        document.body.classList.add(classname);
      }
    } else {
      if (document.body.classList.contains(classname)) {
        document.body.classList.remove(classname);
      }
    }
  }, [open]);

  return (
    <div className="dashboard-navbar" style={{ maxWidth: open ? "256px" : "56px" }}>
      <IconButton icon={Icon.Home} className="self-start" onClick={() => navigate("/")} />

      <div className="flex flex-col gap-4 flex-1 border-y-2 border-black py-4">
        {pages.map(({ name, path, icon }, i) => {
          const isActive = matches?.[1]?.pathname === `/${path}`;

          return (
            <div key={`page-icon-${i}`} className="flex gap-2 items-center">
              <IconButton icon={icon} color={isActive ? "tertiary" : undefined} onClick={() => navigate(path)} />
              {open && <h3 className="truncate">{name}</h3>}
            </div>
          );
        })}
      </div>

      <div className="self-start w-full pr-[2px]">
        <IconButton
          icon={open ? Icon.ChevronLeft : Icon.ChevronRight}
          color="secondary"
          className="!w-full"
          onClick={() => setOpen((o) => !o)}
        />
      </div>
    </div>
  );
};
